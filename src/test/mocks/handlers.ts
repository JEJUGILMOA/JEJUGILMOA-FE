import { http, HttpResponse } from 'msw'

const mockPlaces = [
  {
    id: 1,
    name: '성산일출봉',
    categoryName: '자연',
    address: '제주특별자치도 서귀포시 성산읍',
    imageUrl: 'https://example.com/seongsan.jpg',
    latitude: 33.458,
    longitude: 126.942,
  },
  {
    id: 2,
    name: '협재 해수욕장',
    categoryName: '자연',
    address: '제주특별자치도 제주시 한림읍',
    imageUrl: 'https://example.com/hyeopjae.jpg',
    latitude: 33.394,
    longitude: 126.239,
  },
]

const mockPopularPlaces = [
  {
    placeId: 1,
    name: '성산일출봉',
    imageUrl: 'https://example.com/seongsan.jpg',
    visitCount: 500,
  },
  {
    placeId: 2,
    name: '한라산',
    imageUrl: 'https://example.com/hallasan.jpg',
    visitCount: 480,
  },
]

const mockCourses = [
  {
    courseId: 10,
    title: '애월 감성 코스',
    theme: 'CAFE',
    description: '카페와 해안을 잇는 여유 코스',
    copyCount: 12,
    waypoints: [
      {
        sequenceOrder: 1,
        placeId: 11,
        placeName: '애월 카페거리',
        imageUrl: 'https://example.com/aewol.jpg',
        latitude: 33.46,
        longitude: 126.31,
      },
      {
        sequenceOrder: 2,
        placeId: 12,
        placeName: '곽지해수욕장',
        imageUrl: 'https://example.com/gwakji.jpg',
        latitude: 33.45,
        longitude: 126.3,
      },
    ],
  },
]

const mockProfile = {
  nickname: '김여행',
  email: 'travel_kim@email.com',
  profileImageUrl: undefined,
  bio: '제주를 사랑하는 여행자',
  joinedAt: '2025-03-14T00:00:00Z',
  completedTripCount: 3,
  favoriteCount: 12,
  badgeCount: 2,
}

const mockSettings = {
  notifyPlanStart: true,
  notifyRecordWriting: true,
  notifyBadgeAcquired: true,
  notifyNextPlace: true,
  notifyPlaceArrival: true,
  notifyMarketing: false,
  locationPermission: true,
}

const mockPlans = [
  {
    planId: 1,
    title: '제주 3박4일',
    startDate: '2026-07-15',
    endDate: '2026-07-18',
    status: 'IN_PROGRESS',
    waypointCount: 2,
    nights: 3,
    days: 4,
    dDay: -9,
  },
  {
    planId: 2,
    title: '제주 당일치기',
    startDate: '2026-08-02',
    endDate: '2026-08-02',
    status: 'DRAFT',
    waypointCount: 3,
    nights: 0,
    days: 1,
    dDay: 9,
  },
]

const mockBadges = [
  {
    group: 'EXPLORATION',
    badges: [
      {
        badgeId: 1,
        name: '제주 한바퀴',
        description: '제주 전 지역을 방문해보세요.',
        imageUrl: 'https://cdn.example.com/badges/1.png',
        acquired: true,
        acquiredAt: '2026-06-01T00:00:00Z',
        currentProgress: 5,
        targetProgress: 5,
      },
      {
        badgeId: 2,
        name: '해변 탐험가',
        description: '해변 장소 5곳 방문',
        imageUrl: null,
        acquired: false,
        acquiredAt: null,
        currentProgress: 2,
        targetProgress: 5,
      },
    ],
  },
  {
    group: 'GOURMET',
    badges: [],
  },
  {
    group: 'SOCIAL',
    badges: [],
  },
]

const mockSharedRecords = {
  content: [
    {
      recordId: 1,
      title: '제주 3박4일 여행기',
      visibility: 'PUBLIC',
      createdAt: '2026-07-05T00:00:00Z',
      visitedPlaceCount: 7,
      viewCount: 128,
      likeCount: 24,
      commentCount: 6,
      shareUrl: 'https://gilmoa.app/s/jeju-3n4d',
    },
  ],
  page: 0,
  size: 20,
  totalElements: 1,
  totalPages: 1,
  last: true,
}

function envelope<T>(result: T) {
  return { isSuccess: true, code: 'FOUND200', message: 'OK', result }
}

export const handlers = [
  http.get('*/places/popular', () => HttpResponse.json(envelope(mockPopularPlaces))),
  http.get('*/courses/recommended', () => HttpResponse.json(envelope(mockCourses))),
  http.get('*/places', ({ request }) => {
    const url = new URL(request.url)
    const size = Number(url.searchParams.get('size') ?? '20')
    const category = url.searchParams.get('category')
    const keyword = url.searchParams.get('keyword')?.trim().toLowerCase() ?? ''

    let content = mockPlaces
    if (category) {
      content = content.filter((place) => place.categoryName === category)
    }
    if (keyword) {
      content = content.filter(
        (place) =>
          place.name.toLowerCase().includes(keyword) ||
          place.address.toLowerCase().includes(keyword),
      )
    }

    return HttpResponse.json(
      envelope({
        content: content.slice(0, size),
        page: 0,
        size,
        totalElements: content.length,
        totalPages: 1,
        last: true,
      }),
    )
  }),
  http.get('*/places/:placeId', ({ params }) => {
    const place = mockPlaces.find((item) => String(item.id) === String(params.placeId))
    if (!place) {
      return HttpResponse.json(
        { isSuccess: false, message: 'Not found', code: 'PLACE404_1', result: null },
        { status: 404 },
      )
    }
    return HttpResponse.json(
      envelope({
        ...place,
        description: null,
        images: [],
        homepage: null,
        tel: null,
        overview: null,
      }),
    )
  }),

  http.get('*/users/me', () => HttpResponse.json(envelope(mockProfile))),
  http.patch('*/users/me', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    Object.assign(mockProfile, body)
    return HttpResponse.json(envelope(mockProfile))
  }),
  http.delete('*/users/me', () => HttpResponse.json(envelope(null))),
  http.get('*/users/me/settings', () => HttpResponse.json(envelope(mockSettings))),
  http.patch('*/users/me/settings', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    Object.assign(mockSettings, body)
    return HttpResponse.json(envelope(mockSettings))
  }),
  http.get('*/plans', ({ request }) => {
    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    const result = status ? mockPlans.filter((plan) => plan.status === status) : mockPlans
    return HttpResponse.json(envelope(result))
  }),
  http.get('*/badges/me', () => HttpResponse.json(envelope(mockBadges))),
  http.get('*/records', ({ request }) => {
    const url = new URL(request.url)
    const mine = url.searchParams.get('mine') === 'true'
    if (!mine) {
      return HttpResponse.json(
        envelope({
          content: [],
          page: 0,
          size: 20,
          totalElements: 0,
          totalPages: 0,
          last: true,
        }),
      )
    }
    return HttpResponse.json(envelope(mockSharedRecords))
  }),
  http.post('*/auth/oauth/:provider/login', () =>
    HttpResponse.json(
      envelope({
        userId: 1,
        nickname: mockProfile.nickname,
        role: 'USER' as const,
        newUser: false,
      }),
    ),
  ),
  http.post('*/auth/reissue', () => HttpResponse.json(envelope(null))),
  http.post('*/auth/logout', () => HttpResponse.json(envelope(null))),
  http.post('*/dev/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email?: string }
    return HttpResponse.json(
      envelope({
        userId: 1,
        email: body.email ?? 'user@example.com',
        nickname: mockProfile.nickname,
        role: 'USER' as const,
        newUser: false,
        accessToken: 'dev-access-token',
      }),
    )
  }),
]
