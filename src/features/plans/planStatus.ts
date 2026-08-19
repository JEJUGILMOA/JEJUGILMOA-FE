import { endOfDay, isWithinInterval, parse, startOfDay } from 'date-fns'
import type { TravelPlan } from './types'

const DATE_FORMAT = 'yyyy.MM.dd'

/** `/plan` 목록에서 계획을 묶어 보여주는 3가지 구간. */
export type PlanGroup = 'ongoing' | 'draft' | 'saved'

/**
 * 계획 하나가 목록의 어느 구간에 속하는지 계산한다.
 * draft는 무조건 "저장해야 하는 계획"이고, saved는 오늘이 여행 기간에 들어오면
 * "진행중인 계획", 아니면 "저장된 계획"이다.
 */
export function getPlanGroup(plan: TravelPlan, today: Date = new Date()): PlanGroup {
  if (plan.status === 'draft') return 'draft'

  const start = startOfDay(parse(plan.startDate, DATE_FORMAT, today))
  const end = endOfDay(parse(plan.endDate, DATE_FORMAT, today))
  return isWithinInterval(today, { start, end }) ? 'ongoing' : 'saved'
}
