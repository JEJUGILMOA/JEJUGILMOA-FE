export const APP_NAME = '길모아'
export const APP_FULL_NAME = 'GILMOA-WEB'

export {
  PLACE_CATEGORIES,
  PLACE_CATEGORY_LABELS,
  getPlaceCategoryApiName,
  type PlaceCategory,
  type PlaceCategoryId,
  type PlaceCategoryLabel,
} from './placeCategories'

export const ROUTES = {
  home: '/',
  login: '/login',
  oauthCallback: (provider: string) => `/oauth/${provider}/callback`,
  map: '/map',
  search: '/search',
  place: '/place/:placeId',
  placesPopular: '/places/popular',
  courses: '/courses',
  course: '/courses/:courseId',
  courseSaved: '/courses/saved/:savedCourseId',
  plan: '/plan',
  planCreate: '/plan/new',
  planCourseRecommend: '/plan/courses',
  planDetail: (id: string) => `/plan/${id}`,
  planEdit: (id: string) => `/plan/${id}/edit`,
  planItinerary: (id: string) => `/plan/${id}/itinerary`,
  planBudget: (id: string) => `/plan/${id}/budget`,
  planPreview: (id: string) => `/plan/${id}/preview`,
  record: '/record',
  /** 기록 탭 — `myrecord`(내 기록) | `search`(둘러보기) */
  recordTab: (tab: 'myrecord' | 'search' = 'myrecord') =>
    tab === 'myrecord' ? '/record?tab=myrecord' : '/record?tab=search',
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
  myBlocks: '/my/blocks',
  myNotices: '/my/notices',
  myNoticeDetail: '/my/notices/:noticeId',
  test: ['/test/jinsung', '/test/suji'],
} as const

/** 약관 및 정책 / 고객센터 (외부 사이트) */
export const EXTERNAL_PRIVACY_POLICY_URL = 'https://www.gilmoa.site/privacy-policy'
export const EXTERNAL_SUPPORT_URL = 'https://www.gilmoa.site/support'

export function placePath(placeId: string) {
  return `/place/${placeId}`
}

export function coursePath(courseId: string) {
  return `/courses/${courseId}`
}

export function savedCoursePath(savedCourseId: string) {
  return `/courses/saved/${savedCourseId}`
}

export const QUERY_KEYS = {
  places: ['places'] as const,
  placesList: (params?: {
    keyword?: string
    category?: string
    page?: number
    size?: number
  }) => ['places', 'list', params] as const,
  popularPlaces: (params?: {
    category?: string
    page?: number
    size?: number
    limit?: number
  }) => ['places', 'popular', params] as const,
  place: (id: string) => ['places', id] as const,
  homePlaces: ['home', 'places'] as const,
  homeCourses: ['home', 'courses'] as const,
  recommendedCourses: (themes?: readonly string[]) => ['courses', 'recommended', themes] as const,
  recommendedCourse: (courseId: string) => ['courses', 'recommended', courseId] as const,
  savedCourses: ['courses', 'saved'] as const,
  savedCourse: (savedCourseId: string) => ['courses', 'saved', savedCourseId] as const,
  plans: ['plans'] as const,
  plan: (id: string) => ['plans', id] as const,
  reviews: (placeId: string) => ['reviews', placeId] as const,
  completedTrips: ['records', 'completedTrips'] as const,
  myRecords: ['records', 'my'] as const,
  mySharedRecords: (page?: number) => ['records', 'shared', page] as const,
  exploreRecords: ['records', 'explore'] as const,
  favoriteRecordIds: ['records', 'favorites', 'ids'] as const,
  favoriteRecords: (page?: number, size?: number) =>
    ['records', 'favorites', 'list', page, size] as const,
  blockedUsers: ['users', 'blocks'] as const,
  myProfile: ['users', 'me'] as const,
  mySettings: ['users', 'me', 'settings'] as const,
  myBadges: ['badges', 'me'] as const,
  planSummaries: (status?: string) => ['plans', 'summaries', status] as const,
  favorites: (page?: number, size?: number) => ['favorites', page, size] as const,
  favoritePlaceIds: ['favorites', 'ids'] as const,
  mapPlaces: (params?: {
    minLat?: number
    maxLat?: number
    minLng?: number
    maxLng?: number
    category?: string
    limit?: number
  }) => ['map', 'places', params] as const,
  mapHeatmap: (params?: {
    minLat?: number
    maxLat?: number
    minLng?: number
    maxLng?: number
    gridSize?: number
  }) => ['map', 'heatmap', params] as const,
  currentTrip: ['trips', 'current'] as const,
} as const
