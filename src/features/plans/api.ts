import { addDays, differenceInCalendarDays, format, parse } from 'date-fns'
import { apiGet, apiPost, apiPut } from '@/api/http'
import { mockPlans } from './mockPlans'
import type {
  CompanionType,
  DayCreateRequest,
  PlanCreateRequest,
  PlanDraft,
  PlanPlaceSearchParams,
  PlanPlaceSearchPage,
  RecommendationRequest,
  RecommendationResponse,
  TravelCompanion,
  TravelPlan,
  TravelPlanDetailResponse,
  WaypointCreateRequest,
} from './types'

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

/** PlanCreatePage(STEP1~3)에서 새 계획을 만들 때, 서버 호출 없이 로컬 draft를 만드는 데 쓴다 */
export function toTravelPlan(draft: PlanDraft): TravelPlan {
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
    budgetTransportation: null,
    budgetAccommodation: null,
    budgetFood: null,
    budgetEtc: null,
  }
}

/** TODO: 백엔드 API가 준비되면 apiClient.get('/plans')로 교체 */
export async function fetchPlans(): Promise<TravelPlan[]> {
  // 매 호출마다 새 배열을 반환 — 같은 참조를 반환하면 구조적 공유 최적화로 인해
  // React Query가 "데이터 변경 없음"으로 판단해 리렌더를 건너뛴다.
  return [...mockPlans]
}

/** TODO: 백엔드 API가 준비되면 apiClient.get(`/plans/${id}`)로 교체 */
export async function fetchPlanById(planId: string): Promise<TravelPlan | undefined> {
  return mockPlans.find((plan) => plan.id === planId)
}

/** TODO: 백엔드 API가 준비되면 apiClient.delete(`/plans/${id}`)로 교체 */
export async function deletePlan(planId: string): Promise<void> {
  const index = mockPlans.findIndex((item) => item.id === planId)
  if (index !== -1) mockPlans.splice(index, 1)
}

/** STEP4 추천·검색 탭 — 전역/앵커 추천. preferredWaypoints가 비어있으면 전역, 있으면 앵커 추천 */
export async function fetchRecommendations(
  payload: RecommendationRequest,
): Promise<RecommendationResponse> {
  return apiPost<RecommendationResponse>('/recommendations', payload)
}

/** STEP4 추천·검색 탭 — 키워드로 DB 장소 검색 */
export async function searchPlanPlaces(params: PlanPlaceSearchParams): Promise<PlanPlaceSearchPage> {
  return apiGet<PlanPlaceSearchPage>('/places', { params })
}

const COMPANION_TYPE_TO_API: Record<CompanionType, TravelCompanion> = {
  solo: 'SOLO',
  couple: 'COUPLE',
  family: 'FAMILY',
  friends: 'FRIENDS',
  colleague: 'COLLEAGUES',
}

/**
 * 출발지 좌표를 못 구했을 때 쓰는 기본값. 출발지 입력이 아직 Day별 mock 기반이라(별도
 * 이슈에서 "계획 전체에 하나"로 옮기기 전까지) 실제 좌표가 없는 경우가 대부분이라 임시로
 * 제주국제공항 좌표를 대신 보낸다.
 */
const FALLBACK_DEPARTURE = {
  name: '제주국제공항',
  latitude: 33.507_2,
  longitude: 126.492_9,
}

/** `yyyy.MM.dd` -> `yyyy-MM-dd` */
function toApiDate(date: string): string {
  return date.replaceAll('.', '-')
}

/**
 * STEP6 "계획 저장하기" — 지금까지 로컬(`planDraftStore`)에만 쌓아둔 계획을 API가 원하는
 * `PlanCreateRequest` 모양으로 조립한다. `POST /api/plans`(신규)·`PUT /api/plans/{id}`(편집)에
 * 둘 다 이 같은 모양을 그대로 쓴다.
 *
 * 두 가지는 지금 구조상 어쩔 수 없이 걸러진다:
 * - 경유지 중 placeId가 숫자로 안 바뀌는 것(`hyeopjae-beach` 같은 mock 장소)은 실제 DB에 없는
 *   장소라 payload에서 빠진다. STEP4 추천·검색에서 실제로 담은 장소만 전송된다.
 * - 출발지 좌표는 실제 좌표를 구했을 때만 쓰고, 없으면 FALLBACK_DEPARTURE를 대신 보낸다.
 */
export function buildPlanCreateRequest(plan: TravelPlan): PlanCreateRequest {
  const startDate = parse(plan.startDate, DATE_FORMAT, new Date())

  const days: DayCreateRequest[] = Object.entries(plan.itinerary)
    .map(([dayKey, day]): DayCreateRequest | null => {
      const waypoints: WaypointCreateRequest[] = day.waypoints
        .map((waypoint) => ({ placeId: Number(waypoint.placeId), isPreferred: waypoint.isPreferred }))
        .filter((waypoint) => Number.isFinite(waypoint.placeId))
      if (waypoints.length === 0) return null
      return {
        visitDate: format(addDays(startDate, Number(dayKey) - 1), 'yyyy-MM-dd'),
        waypoints,
      }
    })
    .filter((day): day is DayCreateRequest => day !== null)

  const hasBudget =
    plan.budgetTransportation !== null ||
    plan.budgetAccommodation !== null ||
    plan.budgetFood !== null ||
    plan.budgetEtc !== null

  return {
    title: plan.title,
    startDate: toApiDate(plan.startDate),
    endDate: toApiDate(plan.endDate),
    companion: COMPANION_TYPE_TO_API[plan.companionType] ?? null,
    categories: plan.interests.length > 0 ? plan.interests : null,
    departurePlaceId: null,
    departureLocationName: FALLBACK_DEPARTURE.name,
    departureLatitude: FALLBACK_DEPARTURE.latitude,
    departureLongitude: FALLBACK_DEPARTURE.longitude,
    days: days.length > 0 ? days : null,
    budget: hasBudget
      ? {
          budgetTransportation: plan.budgetTransportation,
          budgetAccommodation: plan.budgetAccommodation,
          budgetFood: plan.budgetFood,
          budgetEtc: plan.budgetEtc,
        }
      : null,
  }
}

/** STEP6 — 신규 계획 저장 */
export async function createPlan(payload: PlanCreateRequest): Promise<TravelPlanDetailResponse> {
  return apiPost<TravelPlanDetailResponse>('/plans', payload)
}

/** STEP6 — 기존 DRAFT 계획 저장 (전체 덮어쓰기). startDate/endDate는 기존 값과 같아야 한다 */
export async function savePlanEdit(
  planId: string,
  payload: PlanCreateRequest,
): Promise<TravelPlanDetailResponse> {
  return apiPut<TravelPlanDetailResponse>(`/plans/${planId}`, payload)
}
