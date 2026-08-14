export type TransportMode = '배' | '비행기'

export type CompanionType = 'solo' | 'couple' | 'family' | 'friends' | 'colleague'

export type BudgetTier = 'low' | 'mid' | 'high' | 'premium'

export type BudgetCategory = 'transport' | 'lodging' | 'food' | 'etc'

export type InterestTheme =
  | '맛집 탐방'
  | '자연/힐링'
  | '액티비티'
  | '핫플/카페'
  | '문화/역사'
  | '쇼핑'
  | '사진 명소'
  | '축제/이벤트'

/** Day 하나의 일정. 출발 장소·필수 장소는 일정편집 화면에서 인라인으로 채워진다 (기본 null/빈 배열) */
export type DayItinerary = {
  /** 이 Day의 출발 장소 id. 검색으로 입력 (아직 없으면 null) */
  departurePlaceId: string | null
  /** 이 Day에서 반드시 가야 할 장소(가장 가고 싶은 곳) id 목록. 최대 2개까지 (아직 없으면 빈 배열) */
  mustVisitPlaceIds: string[]
  /** 그 외 방문 장소 id 목록. 기존 순서·시간 배정 대상 */
  placeIds: string[]
}

export type TravelPlan = {
  id: string
  title: string
  destination: string
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
  interests: InterestTheme[]
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
  interests: InterestTheme[]
}
