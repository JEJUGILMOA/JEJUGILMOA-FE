import type { TravelPlan } from './types'

/**
 * 매번 위저드를 처음부터 돌리지 않고도 STEP02~08을 바로 확인할 수 있도록 미리 채워둔 예시 계획.
 * `/plan/plan-demo/...` 로 각 STEP에 바로 진입할 수 있다.
 */
const demoPlan: TravelPlan = {
  id: 'plan-demo',
  title: '제주 감성 여행',
  destination: '제주도',
  startDate: '2026.09.04',
  endDate: '2026.09.06',
  transportMode: '비행기',
  arrivalTime: '10:20',
  departureTime: '19:40',
  companionType: 'couple',
  travelerCount: 2,
  budgetTier: 'mid',
  interests: ['맛집 탐방', '자연/힐링'],
  createdAt: new Date().toISOString(),
  waypointPlaceIds: [
    'hyeopjae-beach',
    'hallim-cafe',
    'olle-trail',
    'seongsan-ilchulbong',
    'seopjikoji-cafe',
    'dongmun',
  ],
  itinerary: {
    1: { departurePlaceId: null, mustVisitPlaceId: null, placeIds: ['hyeopjae-beach', 'hallim-cafe'] },
    2: {
      departurePlaceId: null,
      mustVisitPlaceId: null,
      placeIds: ['seongsan-ilchulbong', 'seopjikoji-cafe'],
    },
    3: { departurePlaceId: null, mustVisitPlaceId: null, placeIds: ['dongmun'] },
  },
  budgetDetail: {
    transport: 150_000,
    lodging: 300_000,
    food: 200_000,
    etc: 30_000,
  },
}

/** TODO: 백엔드 계획 저장소가 준비되면 제거. 그전까지 세션 내 임시 저장소 역할 */
export const mockPlans: TravelPlan[] = [demoPlan]
