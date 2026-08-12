import type { KeyboardEvent } from 'react'
import { useNavigate } from 'react-router'
import { Card } from '@/components/ui/Card/Card'
import { ROUTES } from '@/constants'
import type { TravelPlan } from '@/features/plans/types'
import { clickableCardStyle, dateRangeStyle, metaStyle } from './PlanListItem.css.ts'

const COMPANION_LABELS: Record<TravelPlan['companionType'], string> = {
  solo: '혼자',
  couple: '연인과',
  family: '가족과',
  friends: '친구와',
  colleague: '동료와',
}

export type PlanListItemProps = {
  plan: TravelPlan
}

/** `/plan` 목록의 계획 카드 1개 항목. 클릭하면 계획 미리보기(수정 가능)로 이동한다. */
export function PlanListItem({ plan }: PlanListItemProps) {
  const navigate = useNavigate()

  const goToPreview = () => navigate(ROUTES.planPreview(plan.id))

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      goToPreview()
    }
  }

  return (
    <Card
      title={plan.title}
      className={clickableCardStyle}
      role="button"
      tabIndex={0}
      onClick={goToPreview}
      onKeyDown={handleKeyDown}
    >
      <p className={dateRangeStyle}>
        {plan.startDate} - {plan.endDate}
      </p>
      <p className={metaStyle}>
        {plan.transportMode}로 출발 · {COMPANION_LABELS[plan.companionType]}
        {plan.companionType !== 'solo' ? ` · ${plan.travelerCount}명` : ''}
      </p>
    </Card>
  )
}
