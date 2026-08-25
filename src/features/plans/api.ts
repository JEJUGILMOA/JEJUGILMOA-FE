import { addDays, differenceInCalendarDays, format, parse } from 'date-fns'
import { mockPlans } from './mockPlans'
import type { BudgetCategory, DayItinerary, PlanDraft, TravelPlan } from './types'

const DESTINATION = '제주도'
const DATE_FORMAT = 'yyyy.MM.dd'
const DEFAULT_COMPANION_TYPE: TravelPlan['companionType'] = 'solo'

function buildTitle(startDate: string, endDate: string): string {
  const start = parse(startDate, DATE_FORMAT, new Date())
  const end = parse(endDate, DATE_FORMAT, new Date())
  const nights = Math.max(differenceInCalendarDays(end, start), 0)
  return `${DESTINATION} ${nights}박 ${nights + 1}일`
}

export function suggestPlanTitle(startDate: string | null, endDate: string | null): string {
  if (!startDate || !endDate) return `${DESTINATION} 여행`
  return buildTitle(startDate, endDate)
}

// STEP 01 입력 마법사는 어느 단계든 건너뛸 수 있어 draft 값이 비어 있을 수 있다.
// 값을 강제로 요구하는 대신, 빠진 값은 fallback(신규 생성 시 오늘 날짜, 수정 시 기존 값)으로
// 채워 계획 생성·수정이 항상 성공하도록 한다 — 세부 정보는 이후 계획 세우기
// (경유지·일정·예산) 단계에서 실제로 채워진다.
function resolvePlanInfo(draft: PlanDraft, fallback: { startDate: string; endDate: string }) {
  const startDate = draft.startDate ?? fallback.startDate
  const endDate = draft.endDate ?? fallback.endDate
  const companionType = draft.companionType ?? DEFAULT_COMPANION_TYPE

  return {
    startDate,
    endDate,
    transportMode: draft.transportMode,
    arrivalTime: draft.arrivalTime,
    departureTime: draft.departureTime,
    companionType,
    travelerCount: companionType === 'solo' ? 1 : draft.travelerCount,
    budgetTier: draft.budgetTier,
    interests: draft.interests,
  }
}

function toTravelPlan(draft: PlanDraft): TravelPlan {
  const info = resolvePlanInfo(draft, {
    startDate: format(new Date(), DATE_FORMAT),
    endDate: format(addDays(new Date(), 1), DATE_FORMAT),
  })

  return {
    id: `plan-${Date.now()}`,
    title: draft.title.trim() || buildTitle(info.startDate, info.endDate),
    destination: DESTINATION,
    status: 'draft',
    ...info,
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

/** TODO: 백엔드 API가 준비되면 apiClient.patch(`/plans/${id}/itinerary`, ...)로 교체 */
export async function updatePlanItinerary(
  planId: string,
  itinerary: Record<number, DayItinerary>,
): Promise<TravelPlan> {
  const index = mockPlans.findIndex((item) => item.id === planId)
  if (index === -1) {
    throw new Error('계획을 찾을 수 없어요.')
  }
  const updated: TravelPlan = { ...mockPlans[index], itinerary }
  mockPlans[index] = updated
  return updated
}

/** TODO: 백엔드 API가 준비되면 apiClient.patch(`/plans/${id}/info`, ...)로 교체 */
export async function updatePlanInfo(planId: string, draft: PlanDraft): Promise<TravelPlan> {
  const index = mockPlans.findIndex((item) => item.id === planId)
  if (index === -1) {
    throw new Error('계획을 찾을 수 없어요.')
  }
  const current = mockPlans[index]
  const info = resolvePlanInfo(draft, { startDate: current.startDate, endDate: current.endDate })
  const dateChanged = info.startDate !== current.startDate || info.endDate !== current.endDate
  const title = draft.title.trim() || (dateChanged ? buildTitle(info.startDate, info.endDate) : current.title)
  const updated: TravelPlan = {
    ...current,
    ...info,
    title,
  }
  mockPlans[index] = updated
  return updated
}

/** TODO: 백엔드 API가 준비되면 apiClient.patch(`/plans/${id}/title`, ...)로 교체 */
export async function updatePlanTitle(planId: string, title: string): Promise<TravelPlan> {
  const index = mockPlans.findIndex((item) => item.id === planId)
  if (index === -1) {
    throw new Error('계획을 찾을 수 없어요.')
  }
  const updated: TravelPlan = { ...mockPlans[index], title }
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

/** 미리보기의 "계획 저장하기" — 여기서만 draft를 saved로 확정한다. TODO: 백엔드 API가
 * 준비되면 apiClient.patch(`/plans/${id}/confirm`, ...)로 교체 */
export async function confirmPlan(planId: string): Promise<TravelPlan> {
  const index = mockPlans.findIndex((item) => item.id === planId)
  if (index === -1) {
    throw new Error('계획을 찾을 수 없어요.')
  }
  const updated: TravelPlan = { ...mockPlans[index], status: 'saved' }
  mockPlans[index] = updated
  return updated
}

/** TODO: 백엔드 API가 준비되면 apiClient.delete(`/plans/${id}`)로 교체 */
export async function deletePlan(planId: string): Promise<void> {
  const index = mockPlans.findIndex((item) => item.id === planId)
  if (index !== -1) mockPlans.splice(index, 1)
}
