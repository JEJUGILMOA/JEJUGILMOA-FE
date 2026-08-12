export type DepartureCity = '서울' | '부산' | '대구' | '광주' | '대전' | '청주'

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

export type TravelPlan = {
  id: string
  title: string
  destination: string
  startDate: string
  endDate: string
  departureCity: DepartureCity
  companionType: CompanionType
  travelerCount: number
  budgetTier: BudgetTier
  interests: InterestTheme[]
  createdAt: string
  /** STEP 02 경유지 추천에서 담은 장소 id 목록 */
  waypointPlaceIds: string[]
  /** STEP 04 지도추가에서 배정한 Day별 장소 id 목록 (1부터 시작) */
  itinerary: Record<number, string[]>
  /** STEP 07 예산 입력에서 저장한 카테고리별 예산(원). 입력 전에는 null */
  budgetDetail: Record<BudgetCategory, number> | null
}

/** STEP 01 정보입력 마법사에서 사용하는 draft 상태 */
export type PlanDraft = {
  departureCity: DepartureCity
  /** `yyyy.MM.dd` 형식. 미선택 시 null */
  startDate: string | null
  endDate: string | null
  companionType: CompanionType | null
  travelerCount: number
  budgetTier: BudgetTier
  interests: InterestTheme[]
}
