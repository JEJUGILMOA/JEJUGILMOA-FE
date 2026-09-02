import { addDays, differenceInCalendarDays, format, parse } from 'date-fns'
import { apiDelete, apiGet, apiPost, apiPut } from '@/api/http'
import { isApiError } from '@/api/error'
import type {
  CompanionType,
  DayCreateRequest,
  DayItinerary,
  DepartureInfo,
  PlanCreateRequest,
  PlanDraft,
  PlanPlaceSearchParams,
  PlanPlaceSearchPage,
  PlanStatus,
  RecommendationRequest,
  RecommendationResponse,
  TravelCompanion,
  TravelPlan,
  TravelPlanDetailResponse,
  TravelPlanStatus,
  TravelPlanSummary,
  Waypoint,
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
    companionType,
    travelerCount: companionType === 'solo' ? 1 : draft.travelerCount,
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

const COMPANION_API_TO_TYPE: Record<TravelCompanion, CompanionType> = {
  SOLO: 'solo',
  COUPLE: 'couple',
  FAMILY: 'family',
  FRIENDS: 'friends',
  COLLEAGUES: 'colleague',
}

// GET 응답(목록·상세)엔 인원수가 없다(v2 API가 저장하지 않음) — 서버에서 불러온 계획은
// 항상 이 값으로 채워진다.
const DEFAULT_TRAVELER_COUNT = 1

/** `yyyy-MM-dd` -> `yyyy.MM.dd` (`toApiDate`의 반대 방향) */
function fromApiDate(date: string): string {
  return date.replaceAll('-', '.')
}

function fromApiPlanStatus(status: TravelPlanStatus): PlanStatus {
  if (status === 'DRAFT') return 'draft'
  if (status === 'IN_PROGRESS') return 'ongoing'
  return 'completed'
}

/** `GET /api/plans` 목록 아이템 하나를 로컬 `TravelPlan` 모양으로 변환 */
export function mapPlanSummaryToTravelPlan(summary: TravelPlanSummary): TravelPlan {
  return {
    id: String(summary.planId),
    title: summary.title,
    destination: DESTINATION,
    status: fromApiPlanStatus(summary.status),
    startDate: fromApiDate(summary.startDate),
    endDate: fromApiDate(summary.endDate),
    companionType: DEFAULT_COMPANION_TYPE,
    travelerCount: DEFAULT_TRAVELER_COUNT,
    interests: [],
    createdAt: new Date().toISOString(),
    waypointPlaceIds: [],
    itinerary: {},
    budgetTransportation: null,
    budgetAccommodation: null,
    budgetFood: null,
    budgetEtc: null,
    waypointCount: summary.waypointCount,
  }
}

/** `GET /api/plans/{id}` 응답을 로컬 `TravelPlan` 모양으로 변환 */
export function mapPlanDetailToTravelPlan(detail: TravelPlanDetailResponse): TravelPlan {
  const itinerary: Record<number, DayItinerary> = {}
  for (const day of detail.itinerary) {
    const waypoints: Waypoint[] = day.waypoints
      .slice()
      .sort((a, b) => a.sequenceOrder - b.sequenceOrder)
      .map((waypoint) => ({
        placeId: String(waypoint.placeId),
        title: waypoint.placeName,
        isPreferred: waypoint.isPreferred,
      }))
    const departure: DepartureInfo = {
      placeId: day.departurePlaceId !== null ? String(day.departurePlaceId) : '',
      title: day.departureLocationName ?? '',
      // 서버 응답엔 주소가 없다 — 이번 세션에서 검색으로 새로 고른 출발지만 주소를 보여줄 수 있다.
      address: '',
      latitude: day.departureLatitude,
      longitude: day.departureLongitude,
    }
    itinerary[day.dayNumber] = { departure, waypoints }
  }

  return {
    id: String(detail.planId),
    title: detail.title,
    destination: DESTINATION,
    status: fromApiPlanStatus(detail.status),
    startDate: fromApiDate(detail.startDate),
    endDate: fromApiDate(detail.endDate),
    companionType: detail.companion ? COMPANION_API_TO_TYPE[detail.companion] : DEFAULT_COMPANION_TYPE,
    travelerCount: DEFAULT_TRAVELER_COUNT,
    interests: detail.categories ?? [],
    createdAt: new Date().toISOString(),
    waypointPlaceIds: [],
    itinerary,
    budgetTransportation: detail.budgetTransportation,
    budgetAccommodation: detail.budgetAccommodation,
    budgetFood: detail.budgetFood,
    budgetEtc: detail.budgetEtc,
  }
}

export async function fetchPlans(params?: { status?: TravelPlanStatus }): Promise<TravelPlan[]> {
  const summaries = await apiGet<TravelPlanSummary[]>('/plans', { params })
  return summaries.map(mapPlanSummaryToTravelPlan)
}

export async function fetchPlanById(planId: string): Promise<TravelPlan | undefined> {
  try {
    const detail = await apiGet<TravelPlanDetailResponse>(`/plans/${planId}`)
    return mapPlanDetailToTravelPlan(detail)
  } catch (error) {
    if (isApiError(error) && error.status === 404) return undefined
    throw error
  }
}

export async function deletePlan(planId: string): Promise<void> {
  await apiDelete<null>(`/plans/${planId}`)
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
 * 출발지·위도·경도는 day마다 필수라, 경유지는 담았는데 출발지를 한 번도 안 정한 day가
 * 있으면 대신 채워 넣는 안전망. 실제로 출발지를 검색해서 고른 day는 이 값을 안 쓴다.
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
 * 경유지 중 placeId가 숫자로 안 바뀌는 것(`hyeopjae-beach` 같은 mock 장소)은 실제 DB에 없는
 * 장소라 payload에서 빠진다 — STEP4 추천·검색에서 실제로 담은 장소만 전송된다.
 */
export function buildPlanCreateRequest(plan: TravelPlan): PlanCreateRequest {
  const startDate = parse(plan.startDate, DATE_FORMAT, new Date())

  const days: DayCreateRequest[] = Object.entries(plan.itinerary)
    .map(([dayKey, day]): DayCreateRequest | null => {
      const waypoints: WaypointCreateRequest[] = day.waypoints
        .map((waypoint) => ({ placeId: Number(waypoint.placeId), isPreferred: waypoint.isPreferred }))
        .filter((waypoint) => Number.isFinite(waypoint.placeId))
      if (waypoints.length === 0) return null

      const departure = day.departure
      return {
        visitDate: format(addDays(startDate, Number(dayKey) - 1), 'yyyy-MM-dd'),
        departurePlaceId: departure ? Number(departure.placeId) || null : null,
        departureLocationName: departure ? departure.title : FALLBACK_DEPARTURE.name,
        departureLatitude: departure ? departure.latitude : FALLBACK_DEPARTURE.latitude,
        departureLongitude: departure ? departure.longitude : FALLBACK_DEPARTURE.longitude,
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
