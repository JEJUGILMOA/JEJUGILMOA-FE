import type { ExploreRecord } from './types'

/** TODO: 둘러보기 API가 준비되면 제거하고 apiClient.get('/records/explore')로 교체 */
export const mockExploreRecords: ExploreRecord[] = [
  {
    id: 'explore-kyoto',
    title: '교토 벚꽃 산책',
    summary: '골목마다 벚꽃이 흩날렸다',
    authorName: 'minji_travel',
    linkedPlanTitle: '교토 벚꽃 여행',
    path: [
      { x: 0.1, y: 0.75 },
      { x: 0.35, y: 0.35 },
      { x: 0.6, y: 0.55 },
      { x: 0.9, y: 0.15 },
    ],
  },
  {
    id: 'explore-busan',
    title: '부산 야경 투어',
    summary: '광안대교 불빛이 바다에 번졌다',
    authorName: 'seaside_hoon',
    linkedPlanTitle: null,
    path: [
      { x: 0.15, y: 0.2 },
      { x: 0.4, y: 0.6 },
      { x: 0.7, y: 0.3 },
      { x: 0.85, y: 0.7 },
    ],
  },
]
