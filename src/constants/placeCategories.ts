import {
  BedDouble,
  Bike,
  Castle,
  Coffee,
  Landmark,
  ShoppingBag,
  Trees,
  UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react'

export type PlaceCategoryId =
  | 'food'
  | 'cafe'
  | 'nature'
  | 'history'
  | 'culture'
  | 'shopping'
  | 'activity'
  | 'stay'

export type PlaceCategoryLabel =
  | '식사'
  | '카페'
  | '자연'
  | '역사'
  | '문화'
  | '쇼핑'
  | '액티비티'
  | '숙소'

export type PlaceCategory = {
  id: PlaceCategoryId
  label: PlaceCategoryLabel
  icon: LucideIcon
  bg: string
  fg: string
}

/** 홈·인기 관광지 등에서 공유하는 장소 카테고리 */
export const PLACE_CATEGORIES: readonly PlaceCategory[] = [
  { id: 'food', label: '식사', icon: UtensilsCrossed, bg: '#DCEEE7', fg: '#0F6E56' },
  { id: 'cafe', label: '카페', icon: Coffee, bg: '#E3EFF6', fg: '#185FA5' },
  { id: 'nature', label: '자연', icon: Trees, bg: '#E9F1E1', fg: '#3B6D11' },
  { id: 'history', label: '역사', icon: Castle, bg: '#FAF1DE', fg: '#854F0B' },
  { id: 'culture', label: '문화', icon: Landmark, bg: '#E9E8F8', fg: '#534AB7' },
  { id: 'shopping', label: '쇼핑', icon: ShoppingBag, bg: '#FAEBF1', fg: '#993556' },
  { id: 'activity', label: '액티비티', icon: Bike, bg: '#FFF0E6', fg: '#C2410C' },
  { id: 'stay', label: '숙소', icon: BedDouble, bg: '#E8EEF8', fg: '#3B4F7A' },
] as const

export const PLACE_CATEGORY_LABELS = PLACE_CATEGORIES.map((category) => category.label)
