import { differenceInCalendarDays, parse } from 'date-fns'
import { Pencil } from 'lucide-react'
import { useNavigate, useParams } from 'react-router'
import { Button } from '@/components/ui/Button/Button'
import { Card } from '@/components/ui/Card/Card'
import { Loading } from '@/components/ui/Loading/Loading'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { toast } from '@/components/ui/Toast/Toast'
import { ROUTES } from '@/constants'
import { MOCK_PLACES } from '@/data/mockExplore'
import { usePlanQuery } from '@/features/plans/hooks'
import { ARRIVAL_POINT_BY_TRANSPORT_MODE } from '@/features/plans/transportMode'
import type { BudgetCategory } from '@/features/plans/types'
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
  tripHeaderStyle,
  tripMetaStyle,
  tripTitleStyle,
} from './PlanPreviewPage.css.ts'
import { PlanRouteMap } from './components/PlanRouteMap'

const DATE_FORMAT = 'yyyy.MM.dd'

const BUDGET_CATEGORY_LABELS: { key: BudgetCategory; label: string }[] = [
  { key: 'transport', label: '교통비' },
  { key: 'lodging', label: '숙박' },
  { key: 'food', label: '식비' },
  { key: 'etc', label: '기타(입장료 등)' },
]

function placeTitle(placeId: string) {
  return MOCK_PLACES.find((place) => place.id === placeId)?.title ?? placeId
}

export function PlanPreviewPage() {
  const { planId = '' } = useParams<{ planId: string }>()
  const navigate = useNavigate()
  const { data: plan, isLoading } = usePlanQuery(planId)

  const goBack = () => navigate(-1)
  const goEditItinerary = () =>
    navigate(ROUTES.planItinerary(planId), { state: { fromPreview: true } })
  const goEditBudget = () => navigate(ROUTES.planBudget(planId), { state: { fromPreview: true } })

  const handleSave = () => {
    toast.success('계획을 저장했어요')
    navigate(ROUTES.plan)
  }

  if (isLoading || !plan) {
    return (
      <div>
        <PageHeader title="계획 미리보기" showBack onBack={goBack} />
        <Loading label="여행 계획을 불러오는 중…" />
      </div>
    )
  }

  const startDate = parse(plan.startDate, DATE_FORMAT, new Date())
  const endDate = parse(plan.endDate, DATE_FORMAT, new Date())
  const dayCount = Math.max(differenceInCalendarDays(endDate, startDate) + 1, 1)
  const nights = Math.max(dayCount - 1, 0)
  const durationLabel = dayCount <= 1 ? '당일치기' : `${nights}박 ${dayCount}일`

  const gatewayLabel = ARRIVAL_POINT_BY_TRANSPORT_MODE[plan.transportMode]

  const days = Array.from({ length: dayCount }, (_, index) => {
    const day = index + 1
    const placeIds = plan.itinerary[day] ?? []
    return { day, places: placeIds.map((id) => ({ id, title: placeTitle(id) })) }
  })

  const budgetTotal = plan.budgetDetail
    ? BUDGET_CATEGORY_LABELS.reduce((sum, { key }) => sum + (plan.budgetDetail?.[key] ?? 0), 0)
    : 0

  return (
    <div>
      <PageHeader title="계획 미리보기" showBack onBack={goBack} />

      <div className={pageStyle}>
        <div className={tripHeaderStyle}>
          <h2 className={tripTitleStyle}>{plan.title}</h2>
          <p className={tripMetaStyle}>
            {plan.startDate} - {plan.endDate} · {durationLabel} · {gatewayLabel} {plan.arrivalTime}{' '}
            도착
          </p>
        </div>

        <div className={sectionListStyle}>
          <Card as="section">
            <div className={sectionHeaderRowStyle}>
              <span className={sectionTitleStyle}>경로 지도</span>
            </div>
            <PlanRouteMap days={days} gatewayLabel={gatewayLabel} />
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
                const labels = [
                  ...(day === 1 ? [`${gatewayLabel} 도착`] : []),
                  ...places.map((place) => place.title),
                  ...(day === dayCount ? [`${gatewayLabel} 출발`] : []),
                ]
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
            {plan.budgetDetail ? (
              <>
                {BUDGET_CATEGORY_LABELS.map(({ key, label }) => (
                  <div key={key} className={budgetRowStyle}>
                    <span className={budgetRowLabelStyle}>{label}</span>
                    <span className={budgetRowValueStyle}>
                      {(plan.budgetDetail?.[key] ?? 0).toLocaleString()}원
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

        <Button fullWidth size="lg" onClick={handleSave}>
          계획 저장하기
        </Button>
      </div>
    </div>
  )
}
