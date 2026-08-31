import { endOfDay, isWithinInterval, parse, startOfDay } from 'date-fns'
import type { TravelPlan } from './types'

const DATE_FORMAT = 'yyyy.MM.dd'

/** `/plan` 목록에서 계획을 묶어 보여주는 3가지 구간. */
export type PlanGroup = 'ongoing' | 'draft' | 'saved'

/**
 * 계획 하나가 목록의 어느 구간에 속하는지 계산한다.
 * draft(서버 status DRAFT)는 저장은 이미 끝났지만 `POST /api/trips`(여행 시작)를 아직
 * 호출한 적 없는 상태 — "예정된 여행"으로 보여준다. 서버는 이걸 IN_PROGRESS/COMPLETED로
 * 자동 전환해주지 않고 별도 API 호출이 있어야만 바뀐다(우리 앱엔 아직 그 플로우가 없음).
 * 그래서 "진행중"/"저장된 계획" 구분은 실제 서버 상태가 아니라 오늘 날짜가 여행 기간에
 * 들어오는지로 근사한 것 — `/api/trips` 연동을 만들면 이 함수도 실제 status 기준으로 바꿀 것.
 */
export function getPlanGroup(plan: TravelPlan, today: Date = new Date()): PlanGroup {
  if (plan.status === 'draft') return 'draft'

  const start = startOfDay(parse(plan.startDate, DATE_FORMAT, today))
  const end = endOfDay(parse(plan.endDate, DATE_FORMAT, today))
  return isWithinInterval(today, { start, end }) ? 'ongoing' : 'saved'
}
