export const APP_NAME = '길모아'
export const APP_FULL_NAME = 'GILMOA-WEB'

export const ROUTES = {
  home: '/',
  map: '/map',
  place: '/place/:placeId',
  plan: '/plan',
  record: '/record',
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

export const QUERY_KEYS = {
  places: ['places'] as const,
  place: (id: string) => ['places', id] as const,
  plans: ['plans'] as const,
  reviews: (placeId: string) => ['reviews', placeId] as const,
} as const
