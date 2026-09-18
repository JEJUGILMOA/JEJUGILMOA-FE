import type { TravelTheme } from './types'

export const TRAVEL_THEME_LABELS: Record<TravelTheme, string> = {
  FOOD: '맛집 탐방',
  NATURE: '자연/힐링',
  ACTIVITY: '액티비티',
  CAFE: '핫플/카페',
  CULTURE: '문화/역사',
  SHOPPING: '쇼핑',
  FESTIVAL: '축제/이벤트',
}

export const TRAVEL_THEMES = Object.keys(TRAVEL_THEME_LABELS) as TravelTheme[]

/** TravelTheme → GET /map/places·/places `category` 쿼리 값 */
export const TRAVEL_THEME_PLACE_CATEGORY: Record<TravelTheme, string> = {
  FOOD: '음식',
  NATURE: '자연',
  ACTIVITY: '체험',
  CAFE: '카페',
  CULTURE: '역사',
  SHOPPING: '쇼핑',
  FESTIVAL: '축제',
}
