import type { TravelPlan } from './types'

/**
 * 매번 위저드를 처음부터 돌리지 않고도 STEP02~08을 바로 확인할 수 있도록 미리 채워둔 예시 계획.
 * `/plan/plan-demo/...` 로 각 STEP에 바로 진입할 수 있다.
 */
const demoPlan: TravelPlan = {
  id: 'plan-demo',
  title: '제주 감성 여행',
  destination: '제주도',
  status: 'saved',
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
    1: { departurePlaceId: null, mustVisitPlaceIds: [], placeIds: ['hyeopjae-beach', 'hallim-cafe'] },
    2: {
      departurePlaceId: null,
      mustVisitPlaceIds: [],
      placeIds: ['seongsan-ilchulbong', 'seopjikoji-cafe'],
    },
    3: { departurePlaceId: null, mustVisitPlaceIds: [], placeIds: ['dongmun'] },
  },
  budgetDetail: {
    transport: 150_000,
    lodging: 300_000,
    food: 200_000,
    etc: 30_000,
  },
}

/** "저장해야 하는 계획" 구간을 바로 확인할 수 있도록 미리 채워둔, 저장 전(draft) 예시 계획. */
const draftPlan: TravelPlan = {
  id: 'plan-draft-demo',
  title: '제주 3박 4일',
  destination: '제주도',
  status: 'draft',
  startDate: '2026.12.20',
  endDate: '2026.12.23',
  transportMode: '비행기',
  arrivalTime: '09:30',
  departureTime: '20:10',
  companionType: 'family',
  travelerCount: 4,
  budgetTier: 'mid',
  interests: ['자연/힐링'],
  createdAt: new Date().toISOString(),
  waypointPlaceIds: [],
  itinerary: {},
  budgetDetail: null,
}

/** TODO: 백엔드 계획 저장소가 준비되면 제거. 그전까지 세션 내 임시 저장소 역할 */
export const mockPlans: TravelPlan[] = [demoPlan, draftPlan]
