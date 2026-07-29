export const APP_NAME = '길모아'
export const APP_FULL_NAME = 'GILMOA-WEB'

export const ROUTES = {
  home: '/',
  map: '/map',
  place: '/place/:placeId',
  plan: '/plan',
  record: '/record',
  recordCreate: '/record/new',
  recordDetail: (id: string) => `/record/${id}`,
  my: '/my',
  test: ['/test/jinsung', '/test/suji'],
} as const

export const QUERY_KEYS = {
  places: ['places'] as const,
  place: (id: string) => ['places', id] as const,
  plans: ['plans'] as const,
  reviews: (placeId: string) => ['reviews', placeId] as const,
  completedTrips: ['records', 'completedTrips'] as const,
  myRecords: ['records', 'my'] as const,
  exploreRecords: ['records', 'explore'] as const,
} as const
