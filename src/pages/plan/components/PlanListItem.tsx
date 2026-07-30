import { Card } from '@/components/ui/Card/Card'
import type { TravelPlan } from '@/features/plans/types'
import { dateRangeStyle, metaStyle } from './PlanListItem.css.ts'

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

/** `/plan` 목록의 계획 카드 1개 항목 */
export function PlanListItem({ plan }: PlanListItemProps) {
  return (
    <Card title={plan.title}>
      <p className={dateRangeStyle}>
        {plan.startDate} - {plan.endDate}
      </p>
      <p className={metaStyle}>
        {plan.departureCity} 출발 · {COMPANION_LABELS[plan.companionType]}
        {plan.companionType !== 'solo' ? ` · ${plan.travelerCount}명` : ''}
      </p>
    </Card>
  )
}
