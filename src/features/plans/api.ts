import { differenceInCalendarDays, parse } from 'date-fns'
import { mockPlans } from './mockPlans'
import type { BudgetCategory, PlanDraft, TravelPlan } from './types'

const DESTINATION = '제주도'
const DATE_FORMAT = 'yyyy.MM.dd'

function buildTitle(startDate: string, endDate: string): string {
  const start = parse(startDate, DATE_FORMAT, new Date())
  const end = parse(endDate, DATE_FORMAT, new Date())
  const nights = Math.max(differenceInCalendarDays(end, start), 0)
  return `${DESTINATION} ${nights}박 ${nights + 1}일`
}

function toTravelPlan(draft: PlanDraft): TravelPlan {
  if (!draft.startDate || !draft.endDate) {
    throw new Error('여행 날짜를 선택해 주세요.')
  }
  if (!draft.companionType) {
    throw new Error('동행 유형을 선택해 주세요.')
  }

  return {
    id: `plan-${Date.now()}`,
    title: buildTitle(draft.startDate, draft.endDate),
    destination: DESTINATION,
    startDate: draft.startDate,
    endDate: draft.endDate,
    departureCity: draft.departureCity,
    companionType: draft.companionType,
    travelerCount: draft.companionType === 'solo' ? 1 : draft.travelerCount,
    budgetTier: draft.budgetTier,
    interests: draft.interests,
    createdAt: new Date().toISOString(),
    waypointPlaceIds: [],
    itinerary: {},
    budgetDetail: null,
  }
}

/** TODO: 백엔드 API가 준비되면 apiClient.get('/plans')로 교체 */
export async function fetchPlans(): Promise<TravelPlan[]> {
  // 매 호출마다 새 배열을 반환 — 같은 참조를 반환하면 구조적 공유 최적화로 인해
  // React Query가 "데이터 변경 없음"으로 판단해 리렌더를 건너뛴다.
  return [...mockPlans]
}

/** TODO: 계획 생성 API가 준비되면 apiClient.post('/plans', ...)로 교체 */
export async function createPlan(draft: PlanDraft): Promise<TravelPlan> {
  const plan = toTravelPlan(draft)
  mockPlans.unshift(plan)
  return plan
}

/** TODO: 백엔드 API가 준비되면 apiClient.get(`/plans/${id}`)로 교체 */
export async function fetchPlanById(planId: string): Promise<TravelPlan | undefined> {
  return mockPlans.find((plan) => plan.id === planId)
}

/** TODO: 백엔드 API가 준비되면 apiClient.patch(`/plans/${id}/waypoints`, ...)로 교체 */
export async function updatePlanWaypoints(
  planId: string,
  waypointPlaceIds: string[],
): Promise<TravelPlan> {
  const index = mockPlans.findIndex((item) => item.id === planId)
  if (index === -1) {
    throw new Error('계획을 찾을 수 없어요.')
  }
  // 기존 객체를 그대로 mutate하면 React Query가 참조 비교로 "변경 없음"이라 판단해
  // 리렌더를 건너뛴다 — 항상 새 객체로 교체한다.
  const updated: TravelPlan = { ...mockPlans[index], waypointPlaceIds }
  mockPlans[index] = updated
  return updated
}

/** TODO: 백엔드 API가 준비되면 apiClient.patch(`/plans/${id}/itinerary`, ...)로 교체 */
export async function updatePlanItinerary(
  planId: string,
  itinerary: Record<number, string[]>,
): Promise<TravelPlan> {
  const index = mockPlans.findIndex((item) => item.id === planId)
  if (index === -1) {
    throw new Error('계획을 찾을 수 없어요.')
  }
  const updated: TravelPlan = { ...mockPlans[index], itinerary }
  mockPlans[index] = updated
  return updated
}

/** TODO: 백엔드 API가 준비되면 apiClient.patch(`/plans/${id}/budget`, ...)로 교체 */
export async function updatePlanBudget(
  planId: string,
  budgetDetail: Record<BudgetCategory, number> | null,
): Promise<TravelPlan> {
  const index = mockPlans.findIndex((item) => item.id === planId)
  if (index === -1) {
    throw new Error('계획을 찾을 수 없어요.')
  }
  const updated: TravelPlan = { ...mockPlans[index], budgetDetail }
  mockPlans[index] = updated
  return updated
}
