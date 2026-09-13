import { addDays, differenceInCalendarDays, format, parse } from 'date-fns'
import { Pencil } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card/Card'
import { Input } from '@/components/ui/Input/Input'
import { fetchPlaceById } from '@/features/places/api'
import { fetchPlanRoutes } from '@/features/plans/mapPlanApi'
import { NEW_PLAN_ID } from '@/features/plans/planDraftStore'
import type { PlanBudgetRequest, TravelPlan } from '@/features/plans/types'
import {
  PlanRouteMap,
  type PlanRouteMapDayRoute,
} from '@/pages/plan/preview/components/PlanRouteMap'
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
  sectionHeaderRowStyle,
  sectionListStyle,
  sectionTitleStyle,
  titleButtonStyle,
  titleInputStyle,
  tripHeaderRowStyle,
  tripHeaderStyle,
  tripMetaStyle,
  tripTitleStyle,
} from './PlanOverview.css.ts'

const DATE_FORMAT = 'yyyy.MM.dd'

const BUDGET_CATEGORY_LABELS: { key: keyof PlanBudgetRequest; label: string }[] = [
  { key: 'budgetTransportation', label: '교통비' },
  { key: 'budgetAccommodation', label: '숙박' },
  { key: 'budgetFood', label: '식비' },
  { key: 'budgetEtc', label: '기타(입장료 등)' },
]

export type PlanOverviewProps = {
  plan: TravelPlan
  /** 연필·제목 수정 노출 여부 (작성/편집 미리보기만 true) */
  editable?: boolean
  onTitleChange?: (title: string) => void
  onEditInfo?: () => void
  onEditItinerary?: () => void
  onEditBudget?: () => void
}

export function PlanOverview({
  plan,
  editable = false,
  onTitleChange,
  onEditInfo,
  onEditItinerary,
  onEditBudget,
}: PlanOverviewProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [titleDraft, setTitleDraft] = useState('')
  const [placeCoords, setPlaceCoords] = useState<
    Record<string, { latitude: number; longitude: number }>
  >({})
  const [dayRoutes, setDayRoutes] = useState<PlanRouteMapDayRoute[]>([])

  const startEditTitle = (currentTitle: string) => {
    setTitleDraft(currentTitle)
    setIsEditingTitle(true)
  }

  const commitTitle = () => {
    const nextTitle = titleDraft.trim()
    setIsEditingTitle(false)
    if (!nextTitle || nextTitle === plan.title) return
    onTitleChange?.(nextTitle)
  }

  useEffect(() => {
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

  useEffect(() => {
    if (plan.id === NEW_PLAN_ID) {
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

  const hasBudget =
    plan.budgetTransportation !== null ||
    plan.budgetAccommodation !== null ||
    plan.budgetFood !== null ||
    plan.budgetEtc !== null
  const budgetTotal = hasBudget
    ? BUDGET_CATEGORY_LABELS.reduce((sum, { key }) => sum + (plan[key] ?? 0), 0)
    : 0

  return (
    <>
      <div className={tripHeaderStyle}>
        <div className={tripHeaderRowStyle}>
          {isEditingTitle && editable ? (
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
          ) : editable && onTitleChange ? (
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
          {editable && onEditInfo ? (
            <button
              type="button"
              className={editButtonStyle}
              onClick={onEditInfo}
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
            {editable && onEditItinerary ? (
              <button
                type="button"
                className={editButtonStyle}
                onClick={onEditItinerary}
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
            {editable && onEditBudget ? (
              <button
                type="button"
                className={editButtonStyle}
                onClick={onEditBudget}
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
                  <span className={budgetRowValueStyle}>{(plan[key] ?? 0).toLocaleString()}원</span>
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
    </>
  )
}
