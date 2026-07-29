export const APP_NAME = '길모아'
export const APP_FULL_NAME = 'GILMOA-WEB'

export {
  PLACE_CATEGORIES,
  PLACE_CATEGORY_LABELS,
  type PlaceCategory,
  type PlaceCategoryId,
  type PlaceCategoryLabel,
} from './placeCategories'

export const ROUTES = {
  home: '/',
  map: '/map',
  search: '/search',
  place: '/place/:placeId',
  placesPopular: '/places/popular',
  courses: '/courses',
  course: '/courses/:courseId',
  plan: '/plan',
  record: '/record',
  my: '/my',
  test: ['/test/jinsung', '/test/suji'],
} as const

export function placePath(placeId: string) {
  return `/place/${placeId}`
}

export function coursePath(courseId: string) {
  return `/courses/${courseId}`
}

export const QUERY_KEYS = {
  places: ['places'] as const,
  place: (id: string) => ['places', id] as const,
  plans: ['plans'] as const,
  reviews: (placeId: string) => ['reviews', placeId] as const,
} as const
