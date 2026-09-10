import {
  BedDouble,
  Bike,
  Castle,
  Coffee,
  PartyPopper,
  ShoppingBag,
  Trees,
  UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react'

export type PlaceCategoryId =
  | 'nature'
  | 'food'
  | 'cafe'
  | 'activity'
  | 'history'
  | 'shopping'
  | 'festival'
  | 'stay'

/** UI 라벨 = GET /places·/places/popular `category` 쿼리 값 (Swagger) */
export type PlaceCategoryLabel =
  | '자연'
  | '음식'
  | '카페'
  | '체험'
  | '역사'
  | '쇼핑'
  | '축제'
  | '숙박'

export type PlaceCategory = {
  id: PlaceCategoryId
  label: PlaceCategoryLabel
  icon: LucideIcon
  /** GET /places·/places/popular·/map/places `category` 쿼리 값 */
  apiName: PlaceCategoryLabel
  bg: string
  fg: string
}

/**
 * 홈·인기 관광지·지도 필터 공통 카테고리
 * Swagger: 자연·음식·카페·체험·역사·쇼핑·축제·숙박
 */
export const PLACE_CATEGORIES: readonly PlaceCategory[] = [
  { id: 'nature', label: '자연', apiName: '자연', icon: Trees, bg: '#E9F1E1', fg: '#3B6D11' },
  { id: 'food', label: '음식', apiName: '음식', icon: UtensilsCrossed, bg: '#DCEEE7', fg: '#0F6E56' },
  { id: 'cafe', label: '카페', apiName: '카페', icon: Coffee, bg: '#E3EFF6', fg: '#185FA5' },
  { id: 'activity', label: '체험', apiName: '체험', icon: Bike, bg: '#FFF0E6', fg: '#C2410C' },
  { id: 'history', label: '역사', apiName: '역사', icon: Castle, bg: '#FAF1DE', fg: '#854F0B' },
  { id: 'shopping', label: '쇼핑', apiName: '쇼핑', icon: ShoppingBag, bg: '#FAEBF1', fg: '#993556' },
  { id: 'festival', label: '축제', apiName: '축제', icon: PartyPopper, bg: '#E9E8F8', fg: '#534AB7' },
  { id: 'stay', label: '숙박', apiName: '숙박', icon: BedDouble, bg: '#E8EEF8', fg: '#3B4F7A' },
] as const

export const PLACE_CATEGORY_LABELS = PLACE_CATEGORIES.map((category) => category.label)

export function getPlaceCategoryApiName(label: PlaceCategoryLabel) {
  return PLACE_CATEGORIES.find((category) => category.label === label)?.apiName
}
