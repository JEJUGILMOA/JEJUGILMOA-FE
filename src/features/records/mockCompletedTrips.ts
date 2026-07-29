import type { CompletedTrip } from './types'

/** TODO: 완료 여행 목록 API가 준비되면 features/plans api로 대체 */
export const mockCompletedTrips: CompletedTrip[] = [
  {
    id: 'trip-osaka',
    title: '오사카 3박4일',
    dateRangeLabel: '2026.05.02 - 05.05 · 5곳 방문',
    places: [
      { id: 'place-dotonbori', name: '도톤보리' },
      { id: 'place-osaka-castle', name: '오사카성' },
    ],
    itinerary: [
      {
        day: 1,
        dateLabel: '05.02',
        items: [
          { time: '09:00', activity: '인천공항 출발' },
          { time: '13:00', activity: '간사이공항 도착' },
          { time: '15:00', activity: '도톤보리 도착 · 다코야키 투어' },
        ],
      },
      {
        day: 2,
        dateLabel: '05.03',
        items: [
          { time: '09:00', activity: '오사카성 관람' },
          { time: '14:00', activity: '신사이바시 쇼핑' },
          { time: '19:00', activity: '오코노미야키 저녁' },
        ],
      },
      {
        day: 3,
        dateLabel: '05.04',
        items: [
          { time: '10:00', activity: '구로몬시장' },
          { time: '13:00', activity: '우메다 스카이빌딩' },
          { time: '18:00', activity: '도톤보리 야경 산책' },
        ],
      },
      {
        day: 4,
        dateLabel: '05.05',
        items: [
          { time: '10:00', activity: '숙소 체크아웃' },
          { time: '12:00', activity: '간사이공항 이동' },
          { time: '16:00', activity: '인천공항 도착' },
        ],
      },
    ],
  },
  {
    id: 'trip-gyeongju',
    title: '경주 당일치기',
    dateRangeLabel: '2026.04.18 · 3곳 방문',
    places: [
      { id: 'place-bulguksa', name: '불국사' },
      { id: 'place-cheomseongdae', name: '첨성대' },
      { id: 'place-donggung', name: '동궁과 월지' },
    ],
    itinerary: [
      {
        day: 1,
        dateLabel: '04.18',
        items: [
          { time: '09:00', activity: '경주역 도착' },
          { time: '10:00', activity: '불국사 관람' },
          { time: '14:00', activity: '첨성대 산책' },
          { time: '19:00', activity: '동궁과 월지 야경' },
        ],
      },
    ],
  },
]
