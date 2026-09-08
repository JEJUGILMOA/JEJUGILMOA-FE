import { http, HttpResponse } from 'msw'
import type {
  PlanCreateRequest,
  RecommendationResponse,
  TravelPlanDetailResponse,
  TravelPlanSummary,
} from '@/features/plans/types'

const mockPlaces = [
  {
    id: 'place-1',
    name: '성산일출봉',
    category: '자연',
    address: '제주특별자치도 서귀포시 성산읍',
    latitude: 33.458,
    longitude: 126.942,
  },
  {
    id: 'place-2',
    name: '협재 해수욕장',
    category: '해변',
    address: '제주특별자치도 제주시 한림읍',
    latitude: 33.394,
    longitude: 126.239,
  },
]

const mockProfile = {
  nickname: '김여행',
  profileImageUrl: undefined,
  bio: '제주를 사랑하는 여행자',
  completedTripCount: 3,
  favoriteCount: 12,
  badgeCount: 2,
}

function envelope<T>(result: T) {
  return { isSuccess: true, code: 'COMMON200', message: 'OK', result }
}

export const mockPlanSummaries: TravelPlanSummary[] = [
  {
    planId: 1,
    title: '제주 3박 4일',
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
    waypointCount: 0,
    nights: 0,
    days: 1,
    dDay: 9,
  },
]

export const mockPlanDetail: TravelPlanDetailResponse = {
  planId: 1,
  title: '제주 3박 4일',
  startDate: '2026-07-15',
  endDate: '2026-07-18',
  nights: 3,
  days: 4,
  status: 'IN_PROGRESS',
  travelStyle: null,
  companion: 'COUPLE',
  categories: ['NATURE'],
  itinerary: [
    {
      date: '2026-07-15',
      dayNumber: 1,
      departurePlaceId: null,
      departureLocationName: '제주국제공항',
      departureLatitude: 33.5072,
      departureLongitude: 126.4929,
      waypoints: [
        {
          waypointId: 1,
          visitDate: '2026-07-15',
          sequenceOrder: 1,
          placeId: 42,
          placeName: '협재해수욕장',
          categoryName: '자연',
          imageUrl: null,
          address: '제주시 한림읍',
          visited: false,
          visitedAt: null,
          isStart: true,
          isDestination: true,
          isPreferred: true,
        },
      ],
    },
  ],
  budgetTransportation: 150_000,
  budgetAccommodation: 300_000,
  budgetFood: null,
  budgetEtc: null,
  totalBudget: 450_000,
}

export const mockRecommendationResponse: RecommendationResponse = {
  items: [
    {
      placeId: 42,
      contentId: null,
      name: '협재해수욕장',
      categoryName: '자연',
      imageUrl: null,
      address: '제주시 한림읍',
      latitude: 33.394,
      longitude: 126.239,
    },
  ],
  hasMore: false,
}

let nextCreatedPlanId = 100

function toDetailResponse(planId: number, payload: PlanCreateRequest): TravelPlanDetailResponse {
  return {
    planId,
    title: payload.title,
    startDate: payload.startDate,
    endDate: payload.endDate,
    nights: 0,
    days: 1,
    status: 'DRAFT',
    travelStyle: null,
    companion: payload.companion,
    categories: payload.categories,
    itinerary: [],
    budgetTransportation: payload.budget?.budgetTransportation ?? null,
    budgetAccommodation: payload.budget?.budgetAccommodation ?? null,
    budgetFood: payload.budget?.budgetFood ?? null,
    budgetEtc: payload.budget?.budgetEtc ?? null,
    totalBudget: null,
  }
}

export const handlers = [
  http.get('*/places', () => HttpResponse.json(mockPlaces)),
  http.get('*/places/:placeId', ({ params }) => {
    const place = mockPlaces.find((item) => item.id === params.placeId)
    if (!place) {
      return HttpResponse.json({ message: 'Not found', code: 'NOT_FOUND' }, { status: 404 })
    }
    return HttpResponse.json(place)
  }),

  http.get('*/users/me', () => HttpResponse.json(envelope(mockProfile))),
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

  http.get('*/plans', () => HttpResponse.json(envelope(mockPlanSummaries))),
  http.get('*/plans/:planId', ({ params }) => {
    if (params.planId !== String(mockPlanDetail.planId)) {
      return HttpResponse.json(
        { isSuccess: false, code: 'PLAN404_1', message: '존재하지 않는 여행 계획입니다.', result: null },
        { status: 404 },
      )
    }
    return HttpResponse.json(envelope(mockPlanDetail))
  }),
  http.post('*/plans', async ({ request }) => {
    const payload = (await request.json()) as PlanCreateRequest
    return HttpResponse.json(envelope(toDetailResponse(nextCreatedPlanId++, payload)), { status: 201 })
  }),
  http.put('*/plans/:planId', async ({ params, request }) => {
    const payload = (await request.json()) as PlanCreateRequest
    return HttpResponse.json(envelope(toDetailResponse(Number(params.planId), payload)))
  }),
  http.delete('*/plans/:planId', () => HttpResponse.json(envelope(null))),

  http.post('*/recommendations', () => HttpResponse.json(envelope(mockRecommendationResponse))),
]
