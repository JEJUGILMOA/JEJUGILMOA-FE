import type { PlanSummary } from './schemas'
import type { MyTrip } from '@/pages/mypage/data/mockMyPage'

function formatApiDate(value: string) {
  return value.replace(/-/g, '.')
}

function formatDDay(value?: number) {
  if (value == null) return undefined
  if (value === 0) return 'D-Day'
  return value > 0 ? `D+${value}` : `D${value}`
}

export function mapPlanSummaryToTrip(plan: PlanSummary): MyTrip {
  const status =
    plan.status === 'IN_PROGRESS' ? 'ongoing' : plan.status === 'DRAFT' ? 'planned' : 'completed'

  if (status === 'ongoing') {
    const dayLabel = plan.days != null ? `${plan.days}일` : '진행중'
    return {
      id: plan.planId,
      title: plan.title,
      status,
      summary: `진행중 · ${dayLabel}`,
      badge: formatDDay(plan.dDay),
      progress: 0.45,
    }
  }

  if (status === 'planned') {
    return {
      id: plan.planId,
      title: plan.title,
      status,
      summary: `${formatApiDate(plan.startDate)} · 경유지 ${plan.waypointCount ?? 0}`,
      badge: formatDDay(plan.dDay),
    }
  }

  return {
    id: plan.planId,
    title: plan.title,
    status,
    summary: `${formatApiDate(plan.startDate)}–${formatApiDate(plan.endDate)}`,
    badge: '완료',
  }
}
