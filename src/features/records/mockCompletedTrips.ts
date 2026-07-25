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
  },
]
