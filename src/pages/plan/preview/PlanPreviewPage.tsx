import { differenceInCalendarDays, parse } from 'date-fns'
import { Pencil } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Button } from '@/components/ui/Button/Button'
import { Card } from '@/components/ui/Card/Card'
import { Input } from '@/components/ui/Input/Input'
import { Loading } from '@/components/ui/Loading/Loading'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { toast } from '@/components/ui/Toast/Toast'
import { ROUTES } from '@/constants'
import { MOCK_PLACES } from '@/data/mockExplore'
import { buildPlanCreateRequest } from '@/features/plans/api'
import { useCreatePlanMutation, usePlanDraft, useSavePlanEditMutation } from '@/features/plans/hooks'
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
import { PlanRouteMap } from './components/PlanRouteMap'

const DATE_FORMAT = 'yyyy.MM.dd'

/** 예산 입력값은 만원 단위(API와 동일)로 저장돼 있어, 화면에 보여줄 때만 원 단위로 바꾼다. */
const WON_PER_MANWON = 10_000

const BUDGET_CATEGORY_LABELS: { key: keyof PlanBudgetRequest; label: string }[] = [
  { key: 'budgetTransportation', label: '교통비' },
  { key: 'budgetAccommodation', label: '숙박' },
  { key: 'budgetFood', label: '식비' },
  { key: 'budgetEtc', label: '기타(입장료 등)' },
]

function placeTitle(placeId: string) {
  return MOCK_PLACES.find((place) => place.id === placeId)?.title ?? placeId
}

export function PlanPreviewPage() {
  const { planId = '' } = useParams<{ planId: string }>()
  const navigate = useNavigate()
  const { plan, isPending, isError } = usePlanDraft(planId)
  const createPlanMutation = useCreatePlanMutation()
  const savePlanEditMutation = useSavePlanEditMutation()
  const isSaving = createPlanMutation.isPending || savePlanEditMutation.isPending

  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [titleDraft, setTitleDraft] = useState('')

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
      ...(dayEntry?.departurePlaceId
        ? [{ id: dayEntry.departurePlaceId, title: placeTitle(dayEntry.departurePlaceId), isDeparture: true }]
        : []),
      ...waypoints.map(({ placeId, title }) => ({ id: placeId, title })),
    ]
    return { day, places }
  })

  const hasBudget =
    plan.budgetTransportation !== null ||
    plan.budgetAccommodation !== null ||
    plan.budgetFood !== null ||
    plan.budgetEtc !== null
  const budgetTotal = hasBudget
    ? BUDGET_CATEGORY_LABELS.reduce((sum, { key }) => sum + (plan[key] ?? 0), 0) * WON_PER_MANWON
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
            ) : (
              <button
                type="button"
                className={titleButtonStyle}
                onClick={() => startEditTitle(plan.title)}
                aria-label={`계획 제목 ${plan.title}. 눌러서 수정하세요`}
              >
                <h2 className={tripTitleStyle}>{plan.title}</h2>
              </button>
            )}
            <button
              type="button"
              className={editButtonStyle}
              onClick={goEditInfo}
              aria-label="여행 정보 수정하러 가기"
            >
              <Pencil size={16} />
            </button>
          </div>
          <p className={tripMetaStyle}>
            {plan.startDate} - {plan.endDate} · {durationLabel} · {plan.arrivalTime} 도착
          </p>
        </div>

        <div className={sectionListStyle}>
          <Card as="section">
            <div className={sectionHeaderRowStyle}>
              <span className={sectionTitleStyle}>경로 지도</span>
            </div>
            <PlanRouteMap days={days} />
          </Card>

          <Card as="section">
            <div className={sectionHeaderRowStyle}>
              <span className={sectionTitleStyle}>일정 요약</span>
              <button
                type="button"
                className={editButtonStyle}
                onClick={goEditItinerary}
                aria-label="일정 수정하러 가기"
              >
                <Pencil size={16} />
              </button>
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
              <button
                type="button"
                className={editButtonStyle}
                onClick={goEditBudget}
                aria-label="예산 수정하러 가기"
              >
                <Pencil size={16} />
              </button>
            </div>
            {hasBudget ? (
              <>
                {BUDGET_CATEGORY_LABELS.map(({ key, label }) => (
                  <div key={key} className={budgetRowStyle}>
                    <span className={budgetRowLabelStyle}>{label}</span>
                    <span className={budgetRowValueStyle}>
                      {((plan[key] ?? 0) * WON_PER_MANWON).toLocaleString()}원
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

        <Button
          fullWidth
          size="lg"
          isLoading={isSaving}
          onClick={handleSave}
        >
          계획 저장하기
        </Button>
      </div>
    </div>
  )
}
