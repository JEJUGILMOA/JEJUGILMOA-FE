import { addDays, differenceInCalendarDays, format, parse } from 'date-fns'
import { Pencil } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Button } from '@/components/ui/Button/Button'
import { Card } from '@/components/ui/Card/Card'
import { Input } from '@/components/ui/Input/Input'
import { Loading } from '@/components/ui/Loading/Loading'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { toast } from '@/components/ui/Toast/Toast'
import { ROUTES } from '@/constants'
import { fetchPlaceById } from '@/features/places/api'
import { buildPlanCreateRequest } from '@/features/plans/api'
import { useCreatePlanMutation, usePlanDraft, useSavePlanEditMutation } from '@/features/plans/hooks'
import { fetchPlanRoutes } from '@/features/plans/mapPlanApi'
import { NEW_PLAN_ID, planDraftStore } from '@/features/plans/planDraftStore'
import type { PlanBudgetRequest } from '@/features/plans/types'
import {
  budgetRowLabelStyle,
  budgetRowStyle,
  budgetRowValueStyle,
  budgetTotalLabelStyle,
  budgetTotalRowStyle,
  budgetTotalValueStyle,
  dayLabelRowStyle,
  dayLabelStyle,
  dayListStyle,
  dayMetaStyle,
  dayPlacesStyle,
  dayRowStyle,
  editButtonStyle,
  emptyHintStyle,
  pageStyle,
  sectionHeaderRowStyle,
  sectionListStyle,
  sectionTitleStyle,
  titleButtonStyle,
  titleInputStyle,
  tripHeaderRowStyle,
  tripHeaderStyle,
  tripMetaStyle,
  tripTitleStyle,
} from './PlanPreviewPage.css.ts'
import { PlanRouteMap, type PlanRouteMapDayRoute } from './components/PlanRouteMap'

const DATE_FORMAT = 'yyyy.MM.dd'

const BUDGET_CATEGORY_LABELS: { key: keyof PlanBudgetRequest; label: string }[] = [
  { key: 'budgetTransportation', label: '교통비' },
  { key: 'budgetAccommodation', label: '숙박' },
  { key: 'budgetFood', label: '식비' },
  { key: 'budgetEtc', label: '기타(입장료 등)' },
]

export function PlanPreviewPage() {
  const { planId = '' } = useParams<{ planId: string }>()
  const navigate = useNavigate()
  const { plan, isPending, isError } = usePlanDraft(planId)
  const createPlanMutation = useCreatePlanMutation()
  const savePlanEditMutation = useSavePlanEditMutation()
  const isSaving = createPlanMutation.isPending || savePlanEditMutation.isPending

  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [titleDraft, setTitleDraft] = useState('')
  /** placeId → 좌표. draft에 없는 경유지는 상세 API로 보완 */
  const [placeCoords, setPlaceCoords] = useState<Record<string, { latitude: number; longitude: number }>>(
    {},
  )
  /** 서버에 저장된 계획의 Day별 경로 (없으면 빈 배열 — 마커만 표시) */
  const [dayRoutes, setDayRoutes] = useState<PlanRouteMapDayRoute[]>([])

  const goBack = () => navigate(-1)
  const goEditInfo = () => navigate(ROUTES.planEdit(planId))
  const goEditItinerary = () =>
    navigate(ROUTES.planItinerary(planId), { state: { fromPreview: true } })
  const goEditBudget = () => navigate(ROUTES.planBudget(planId), { state: { fromPreview: true } })

  // STEP6 — 지금까지 로컬(planDraftStore)에만 모아둔 계획을 여기서 딱 한 번 서버로 보낸다.
  // 신규 계획(NEW_PLAN_ID)이면 POST, 이미 서버에 있던 DRAFT 계획 편집이면 PUT.
  const handleSave = () => {
    if (!plan) return
    const payload = buildPlanCreateRequest(plan)
    const onSuccess = () => {
      toast.success('계획을 저장했어요')
      planDraftStore.getState().clearDraft()
      navigate(ROUTES.plan)
    }
    const onError = () => {
      toast.error('계획 저장에 실패했어요. 다시 시도해 주세요.')
    }

    if (plan.id === NEW_PLAN_ID) {
      createPlanMutation.mutate(payload, { onSuccess, onError })
    } else {
      savePlanEditMutation.mutate({ planId: plan.id, payload }, { onSuccess, onError })
    }
  }

  const startEditTitle = (currentTitle: string) => {
    setTitleDraft(currentTitle)
    setIsEditingTitle(true)
  }

  const commitTitle = () => {
    const nextTitle = titleDraft.trim()
    setIsEditingTitle(false)
    if (!plan || !nextTitle || nextTitle === plan.title) return
    planDraftStore.getState().updateDraft((current) => ({ ...current, title: nextTitle }))
  }

  // draft에 좌표가 없는 경유지는 장소 상세로 보완한다
  useEffect(() => {
    if (!plan) return
    const missingIds = [
      ...new Set(
        Object.values(plan.itinerary).flatMap((day) =>
          day.waypoints
            .filter(
              (waypoint) =>
                Boolean(waypoint.placeId) &&
                (typeof waypoint.latitude !== 'number' || typeof waypoint.longitude !== 'number'),
            )
            .map((waypoint) => waypoint.placeId),
        ),
      ),
    ]
    if (missingIds.length === 0) return

    let cancelled = false
    void Promise.all(
      missingIds.map(async (placeId) => {
        try {
          const place = await fetchPlaceById(placeId)
          if (
            typeof place.latitude === 'number' &&
            typeof place.longitude === 'number' &&
            Number.isFinite(place.latitude) &&
            Number.isFinite(place.longitude)
          ) {
            return { placeId, latitude: place.latitude, longitude: place.longitude }
          }
        } catch {
          // 개별 실패는 무시 — 해당 핀만 지도에서 빠진다
        }
        return null
      }),
    ).then((results) => {
      if (cancelled) return
      const next: Record<string, { latitude: number; longitude: number }> = {}
      for (const row of results) {
        if (!row) continue
        next[row.placeId] = { latitude: row.latitude, longitude: row.longitude }
      }
      if (Object.keys(next).length === 0) return
      setPlaceCoords((prev) => ({ ...prev, ...next }))
    })

    return () => {
      cancelled = true
    }
  }, [plan])

  // 서버에 저장된 계획이면 경로 API를 불러와 Day별 폴리라인으로 그린다 (draft·미생성은 스킵)
  useEffect(() => {
    if (!plan || plan.id === NEW_PLAN_ID) {
      setDayRoutes([])
      return
    }
    const numericId = Number(plan.id)
    if (!Number.isFinite(numericId) || numericId <= 0) {
      setDayRoutes([])
      return
    }

    let cancelled = false
    void fetchPlanRoutes(numericId)
      .then((response) => {
        if (cancelled) return
        const start = parse(plan.startDate, DATE_FORMAT, new Date())
        const dayCount = Math.max(
          differenceInCalendarDays(parse(plan.endDate, DATE_FORMAT, new Date()), start) + 1,
          1,
        )
        const dateToDay = new Map(
          Array.from({ length: dayCount }, (_, index) => [
            format(addDays(start, index), 'yyyy-MM-dd'),
            index + 1,
          ] as const),
        )

        const next: PlanRouteMapDayRoute[] = []
        for (const route of response.routes ?? []) {
          if (route.status !== 'READY' || !route.path?.length) continue
          const dayNumber = dateToDay.get(route.date)
          if (dayNumber == null) continue
          const path: [number, number][] = []
          for (const point of route.path) {
            const longitude = point[0]
            const latitude = point[1]
            if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) continue
            path.push([latitude, longitude])
          }
          if (path.length < 2) continue
          next.push({ dayNumber, path })
        }
        setDayRoutes(next)
      })
      .catch(() => {
        if (!cancelled) setDayRoutes([])
      })

    return () => {
      cancelled = true
    }
  }, [plan])

  if (isPending) {
    return (
      <div>
        <PageHeader title="계획 미리보기" showBack onBack={goBack} />
        <Loading label="여행 계획을 불러오는 중…" />
      </div>
    )
  }

  if (isError || !plan) {
    return (
      <div>
        <PageHeader title="계획 미리보기" showBack onBack={goBack} />
        <p className={emptyHintStyle}>계획을 불러오지 못했어요.</p>
      </div>
    )
  }

  const startDate = parse(plan.startDate, DATE_FORMAT, new Date())
  const endDate = parse(plan.endDate, DATE_FORMAT, new Date())
  const dayCount = Math.max(differenceInCalendarDays(endDate, startDate) + 1, 1)
  const nights = Math.max(dayCount - 1, 0)
  const durationLabel = dayCount <= 1 ? '당일치기' : `${nights}박 ${dayCount}일`

  const days = Array.from({ length: dayCount }, (_, index) => {
    const day = index + 1
    const dayEntry = plan.itinerary[day]
    const waypoints = dayEntry?.waypoints ?? []
    const places = [
      ...(dayEntry?.departure
        ? [
            {
              id: dayEntry.departure.placeId,
              title: dayEntry.departure.title,
              isDeparture: true as const,
              latitude: dayEntry.departure.latitude,
              longitude: dayEntry.departure.longitude,
            },
          ]
        : []),
      ...waypoints.map(({ placeId, title, latitude, longitude }) => {
        const cached = placeCoords[placeId]
        return {
          id: placeId,
          title,
          latitude: latitude ?? cached?.latitude,
          longitude: longitude ?? cached?.longitude,
        }
      }),
    ]
    return { day, places }
  })

  // 여행이 시작된 뒤(진행중·완료)엔 서버가 계획 수정 자체를 막는다(PUT /api/plans는 DRAFT
  // 전용, 그 외엔 PLAN400_17) — 어차피 저장이 막히니 수정 진입점 자체를 안 보여준다.
  const canEdit = plan.status === 'draft'

  const hasBudget =
    plan.budgetTransportation !== null ||
    plan.budgetAccommodation !== null ||
    plan.budgetFood !== null ||
    plan.budgetEtc !== null
  const budgetTotal = hasBudget
    ? BUDGET_CATEGORY_LABELS.reduce((sum, { key }) => sum + (plan[key] ?? 0), 0)
    : 0

  return (
    <div>
      <PageHeader title="계획 미리보기" showBack onBack={goBack} />

      <div className={pageStyle}>
        <div className={tripHeaderStyle}>
          <div className={tripHeaderRowStyle}>
            {isEditingTitle ? (
              <Input
                className={titleInputStyle}
                value={titleDraft}
                onChange={(event) => setTitleDraft(event.target.value)}
                onBlur={commitTitle}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') event.currentTarget.blur()
                  if (event.key === 'Escape') setIsEditingTitle(false)
                }}
                aria-label="계획 제목"
                autoFocus
              />
            ) : canEdit ? (
              <button
                type="button"
                className={titleButtonStyle}
                onClick={() => startEditTitle(plan.title)}
                aria-label={`계획 제목 ${plan.title}. 눌러서 수정하세요`}
              >
                <h2 className={tripTitleStyle}>{plan.title}</h2>
              </button>
            ) : (
              <h2 className={tripTitleStyle}>{plan.title}</h2>
            )}
            {canEdit ? (
              <button
                type="button"
                className={editButtonStyle}
                onClick={goEditInfo}
                aria-label="여행 정보 수정하러 가기"
              >
                <Pencil size={16} />
              </button>
            ) : null}
          </div>
          <p className={tripMetaStyle}>
            {plan.startDate} - {plan.endDate} · {durationLabel}
          </p>
        </div>

        <div className={sectionListStyle}>
          <Card as="section">
            <div className={sectionHeaderRowStyle}>
              <span className={sectionTitleStyle}>경로 지도</span>
            </div>
            <PlanRouteMap days={days} dayRoutes={dayRoutes} />
          </Card>

          <Card as="section">
            <div className={sectionHeaderRowStyle}>
              <span className={sectionTitleStyle}>일정 요약</span>
              {canEdit ? (
                <button
                  type="button"
                  className={editButtonStyle}
                  onClick={goEditItinerary}
                  aria-label="일정 수정하러 가기"
                >
                  <Pencil size={16} />
                </button>
              ) : null}
            </div>
            <div className={dayListStyle}>
              {days.map(({ day, places }) => {
                const labels = places.map((place) => place.title)
                return (
                  <div key={day} className={dayRowStyle}>
                    <div className={dayLabelRowStyle}>
                      <span className={dayLabelStyle}>Day {day}</span>
                      <span className={dayMetaStyle}>{places.length}곳</span>
                    </div>
                    <span className={dayPlacesStyle}>{labels.join(' → ')}</span>
                  </div>
                )
              })}
            </div>
          </Card>

          <Card as="section">
            <div className={sectionHeaderRowStyle}>
              <span className={sectionTitleStyle}>예산 요약</span>
              {canEdit ? (
                <button
                  type="button"
                  className={editButtonStyle}
                  onClick={goEditBudget}
                  aria-label="예산 수정하러 가기"
                >
                  <Pencil size={16} />
                </button>
              ) : null}
            </div>
            {hasBudget ? (
              <>
                {BUDGET_CATEGORY_LABELS.map(({ key, label }) => (
                  <div key={key} className={budgetRowStyle}>
                    <span className={budgetRowLabelStyle}>{label}</span>
                    <span className={budgetRowValueStyle}>
                      {(plan[key] ?? 0).toLocaleString()}원
                    </span>
                  </div>
                ))}
                <div className={budgetTotalRowStyle}>
                  <span className={budgetTotalLabelStyle}>총 예산</span>
                  <span className={budgetTotalValueStyle}>{budgetTotal.toLocaleString()}원</span>
                </div>
              </>
            ) : (
              <p className={emptyHintStyle}>아직 예산을 입력하지 않았어요.</p>
            )}
          </Card>
        </div>

        {canEdit ? (
          <Button fullWidth size="lg" isLoading={isSaving} onClick={handleSave}>
            계획 저장하기
          </Button>
        ) : null}
      </div>
    </div>
  )
}
