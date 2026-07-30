export type DepartureCity = '서울' | '부산' | '대구' | '광주' | '대전' | '청주'

export type CompanionType = 'solo' | 'couple' | 'family' | 'friends' | 'colleague'

export type BudgetTier = 'low' | 'mid' | 'high' | 'premium'

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
