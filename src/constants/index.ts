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
  planCreate: '/plan/new',
  planEdit: (id: string) => `/plan/${id}/edit`,
  planItinerary: (id: string) => `/plan/${id}/itinerary`,
  planBudget: (id: string) => `/plan/${id}/budget`,
  planPreview: (id: string) => `/plan/${id}/preview`,
  record: '/record',
  recordCreate: '/record/new',
  recordDetail: (id: string) => `/record/${id}`,
  recordPlan: (id: string) => `/record/${id}/plan`,
  recordEdit: (id: string) => `/record/${id}/edit`,
  my: '/my',
  myProfile: '/my/profile',
  myProfileEdit: '/my/profile/edit',
  mySettings: '/my/settings',
  myTrips: '/my/trips',
  myTripDetail: '/my/trips/:tripId',
  myFavorites: '/my/favorites',
  myBadges: '/my/badges',
  mySharedRecords: '/my/shared-records',
  myNotices: '/my/notices',
  myNoticeDetail: '/my/notices/:noticeId',
  mySupport: '/my/support',
  mySupportInquiry: '/my/support/inquiry',
  myTerms: '/my/terms',
  myTermDetail: '/my/terms/:termId',
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
  plan: (id: string) => ['plans', id] as const,
  reviews: (placeId: string) => ['reviews', placeId] as const,
  completedTrips: ['records', 'completedTrips'] as const,
  myRecords: ['records', 'my'] as const,
  exploreRecords: ['records', 'explore'] as const,
} as const
