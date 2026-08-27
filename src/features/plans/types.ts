export type TransportMode = '배' | '비행기'

export type CompanionType = 'solo' | 'couple' | 'family' | 'friends' | 'colleague'

export type BudgetTier = 'low' | 'mid' | 'high' | 'premium'

export type BudgetCategory = 'transport' | 'lodging' | 'food' | 'etc'

/** Day 일정에 담긴 장소 하나. `isPreferred`가 선호경유지(★) 표시 — 앵커 추천의 기준점이 된다 */
export type Waypoint = {
  placeId: string
  isPreferred: boolean
}

/** Day 하나의 일정. 출발 장소는 일정편집 화면에서 인라인으로 채워진다 (기본 null) */
export type DayItinerary = {
  /** 이 Day의 출발 장소 id. 검색으로 입력 (아직 없으면 null) */
  departurePlaceId: string | null
  /** 방문 장소 목록. 배열 순서가 곧 방문 순서 */
  waypoints: Waypoint[]
}

/**
 * draft = STEP01만 마치고 아직 "계획 저장하기"를 누르지 않은 상태(계획하다 중간에 나옴).
 * saved = 미리보기에서 저장까지 마친 상태. "진행중인 계획"은 이 saved 중 여행 기간에
 * 오늘이 포함된 경우로, 별도 필드 없이 날짜로만 계산한다 ({@link getPlanGroup}).
 */
export type PlanStatus = 'draft' | 'saved'

export type TravelPlan = {
  id: string
  title: string
  destination: string
  status: PlanStatus
  startDate: string
  endDate: string
  transportMode: TransportMode
  /** 제주 도착 시각 ("HH:mm"). Day 1 일정의 시작점으로 쓰인다 */
  arrivalTime: string
  /** 제주 출발 시각 ("HH:mm"). 마지막 Day 일정의 끝점으로 쓰인다 */
  departureTime: string
  companionType: CompanionType
  travelerCount: number
  budgetTier: BudgetTier
  interests: TravelTheme[]
  createdAt: string
  /** STEP 02 경유지 추천에서 담은 장소 id 목록 */
  waypointPlaceIds: string[]
  /** STEP 04 지도추가에서 배정한 Day별 일정 (1부터 시작) */
  itinerary: Record<number, DayItinerary>
  /** STEP 07 예산 입력에서 저장한 카테고리별 예산(원). 입력 전에는 null */
  budgetDetail: Record<BudgetCategory, number> | null
}

/** STEP 01 정보입력 마법사에서 사용하는 draft 상태 */
export type PlanDraft = {
  transportMode: TransportMode
  arrivalTime: string
  departureTime: string
  /** `yyyy.MM.dd` 형식. 미선택 시 null */
  startDate: string | null
  endDate: string | null
  companionType: CompanionType | null
  travelerCount: number
  budgetTier: BudgetTier
  interests: TravelTheme[]
  /** 여행 제목. 비우면 날짜 기준으로 자동 생성 */
  title: string
}

// ---------------------------------------------------------------------------
// 계획 생성 v2 — 백엔드 API 그대로의 타입. 화면(STEP1~6)을 API에 연결하면서
// 위의 로컬 draft 타입들을 이 타입들 기준으로 하나씩 대체해 나간다.
// ---------------------------------------------------------------------------

export type TravelTheme = 'FOOD' | 'NATURE' | 'ACTIVITY' | 'CAFE' | 'CULTURE' | 'SHOPPING' | 'FESTIVAL'

export type TravelCompanion = 'SOLO' | 'COUPLE' | 'FAMILY' | 'FRIENDS' | 'COLLEAGUES'

export type TravelPlanStatus = 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED'

export type WaypointCreateRequest = {
  placeId: number
  isPreferred: boolean
}

export type DayCreateRequest = {
  /** `yyyy-MM-dd` */
  visitDate: string
  waypoints: WaypointCreateRequest[]
}

export type PlanBudgetRequest = {
  /** 단위: 만원 */
  budgetTransportation: number | null
  budgetAccommodation: number | null
  budgetFood: number | null
  budgetEtc: number | null
}

/** `POST /api/plans` 생성, `PUT /api/plans/{planId}` 편집(DRAFT 전용)에 그대로 쓰는 요청 body */
export type PlanCreateRequest = {
  title: string
  /** `yyyy-MM-dd`. PUT 시 기존 값과 달라지면 에러 — GET으로 받은 값을 그대로 되돌려보낸다 */
  startDate: string
  endDate: string
  companion: TravelCompanion | null
  categories: TravelTheme[] | null
  /** DB에 있는 장소면 id, 없으면 null (이때 departureLocationName 필수) */
  departurePlaceId: number | null
  departureLocationName: string | null
  departureLatitude: number
  departureLongitude: number
  days: DayCreateRequest[] | null
  budget: PlanBudgetRequest | null
}

export type PlanWaypointDetail = {
  waypointId: number
  /** `yyyy-MM-dd` */
  visitDate: string
  sequenceOrder: number
  placeId: number
  placeName: string
  categoryName: string | null
  imageUrl: string | null
  address: string
  visited: boolean
  visitedAt: string | null
  /** 해당 날짜 내 첫 경유지 여부. 서버가 sequenceOrder 기준으로 계산 */
  isStart: boolean
  /** 해당 날짜 내 마지막 경유지 여부 */
  isDestination: boolean
  /** 선호경유지(★) 여부 — 앵커 추천의 기준점 */
  isPreferred: boolean
}

export type PlanDayDetail = {
  /** `yyyy-MM-dd` */
  date: string
  /** 1부터 시작 */
  dayNumber: number
  waypoints: PlanWaypointDetail[]
}

/** `GET /api/plans/{planId}` 응답이자 `POST`/`PUT /api/plans/{planId}`의 응답 */
export type TravelPlanDetailResponse = {
  planId: number
  title: string
  startDate: string
  endDate: string
  nights: number
  /** 총 여행 일수 (nights + 1) */
  days: number
  status: TravelPlanStatus
  travelStyle: string | null
  companion: TravelCompanion | null
  departureLocationName: string | null
  departureLatitude: number
  departureLongitude: number
  categories: TravelTheme[] | null
  itinerary: PlanDayDetail[]
  budgetTransportation: number | null
  budgetAccommodation: number | null
  budgetFood: number | null
  budgetEtc: number | null
  /** 4개 예산 필드 합계. null인 항목은 제외하고 합산 */
  totalBudget: number | null
}

/** `GET /api/plans` 목록 아이템 */
export type TravelPlanSummary = {
  planId: number
  title: string
  startDate: string
  endDate: string
  status: TravelPlanStatus
  waypointCount: number
  nights: number
  days: number
  /** 양수 = D-N(미래), 0 = 오늘 출발, 음수 = 지난 여행 */
  dDay: number
}

export type GeoCoordinate = {
  latitude: number
  longitude: number
}

/** `POST /api/recommendations` 요청 — 계획 생성 중·편집 중 동일하게 사용 */
export type RecommendationRequest = {
  /** 앵커 추천(선호경유지 있음) 시 필수, 전역 추천 시 null 허용 */
  departureCoord: GeoCoordinate | null
  /** 비어있으면 전역 랜덤 추천, 있으면 앵커 기반 추천 */
  preferredWaypoints: GeoCoordinate[]
  /** 이미 담은 장소 + 이전 추천에서 받은 장소 id 누적. 최대 200개 */
  excludedPlaceIds: number[]
  /** TourAPI 폴백 결과의 contentId 누적 (새로고침 시) */
  excludeContentIds: string[]
  category: TravelTheme | null
}

/**
 * DB 장소면 placeId만, TourAPI 폴백 장소면 contentId만 채워진다(서로 배타적).
 * placeId가 null이면 아직 DB에 없는 장소라 경유지로 바로 담을 수 없다.
 */
export type RecommendedPlace = {
  placeId: number | null
  contentId: string | null
  name: string
  categoryName: string | null
  imageUrl: string | null
  address: string
  latitude: number
  longitude: number
}

export type RecommendationResponse = {
  /** 최대 10개 */
  items: RecommendedPlace[]
  /** true면 새로고침으로 더 받아올 수 있음 */
  hasMore: boolean
}

/** `GET /api/places` 검색 파라미터 (STEP4 검색 탭) */
export type PlanPlaceSearchParams = {
  keyword?: string
  category?: string
  /** 0-based, 기본값 0 */
  page?: number
  /** 기본값 20 */
  size?: number
}

export type PlanPlaceSearchItem = {
  id: number
  name: string
  address: string
  imageUrl: string | null
  categoryName: string | null
  latitude: number
  longitude: number
}

export type PlanPlaceSearchPage = {
  content: PlanPlaceSearchItem[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

/** `GET /api/courses/recommended` — STEP4 "이런 코스는 어때요?" 카드 */
export type RecommendedCourseWaypoint = {
  sequenceOrder: number
  placeId: number
  placeName: string
  imageUrl: string | null
  latitude: number
  longitude: number
}

export type RecommendedCourse = {
  courseId: number
  title: string
  theme: TravelTheme
  description: string
  copyCount: number
  waypoints: RecommendedCourseWaypoint[]
}
