import type { ExploreRecord } from './types'

/** 실제 이미지 API 연동 전까지 목데이터에서 쓰는 자리표시 사진 (외부 네트워크 없이 라벨만 렌더링) */
function placeholderPhoto(label: string, hue: number): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="hsl(${hue} 55% 55%)"/><text x="50%" y="50%" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif">${label}</text></svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

/** TODO: 둘러보기 API가 준비되면 제거하고 apiClient.get('/records/explore')로 교체 */
export const mockExploreRecords: ExploreRecord[] = [
  {
    id: 'explore-kyoto',
    title: '교토 벚꽃 산책',
    summary: '골목마다 벚꽃이 흩날렸다',
    authorName: 'minji_travel',
    linkedPlanTitle: '교토 벚꽃 여행',
    linkedPlanItinerary: [
      {
        day: 1,
        dateLabel: '04.05',
        items: [
          { time: '10:00', activity: '간사이공항 도착' },
          { time: '14:00', activity: '기요미즈데라 관람' },
          { time: '19:00', activity: '기온 거리 산책' },
        ],
      },
      {
        day: 2,
        dateLabel: '04.06',
        items: [
          { time: '07:00', activity: '아라시야마 대나무숲' },
          { time: '13:00', activity: '후시미이나리 신사' },
          { time: '18:00', activity: '가모가와 강변 저녁' },
        ],
      },
      {
        day: 3,
        dateLabel: '04.07',
        items: [
          { time: '10:00', activity: '기념품 쇼핑' },
          { time: '15:00', activity: '간사이공항 이동' },
        ],
      },
    ],
    path: [
      { x: 0.1, y: 0.75 },
      { x: 0.35, y: 0.35 },
      { x: 0.6, y: 0.55 },
      { x: 0.9, y: 0.15 },
    ],
    photoUrls: [
      placeholderPhoto('기요미즈데라', 15),
      placeholderPhoto('기온 거리', 340),
      placeholderPhoto('아라시야마 대나무숲', 120),
      placeholderPhoto('후시미이나리', 25),
    ],
    tripDateRangeLabel: '2026.04.05 - 04.07 · 2박3일',
    visitedPlaces: [
      {
        placeId: 'kiyomizu',
        placeName: '기요미즈데라',
        note: '벚꽃과 함께 본 목조 본당이 장관이었어요.',
        photoUrls: [placeholderPhoto('기요미즈데라', 15)],
      },
      {
        placeId: 'gion',
        placeName: '기온 거리',
        note: '저녁에 게이샤를 마주쳤어요, 사진은 예의상 못 찍었지만.',
        photoUrls: [placeholderPhoto('기온 거리', 340)],
      },
      {
        placeId: 'arashiyama',
        placeName: '아라시야마 대나무숲',
        note: '이른 아침에 가야 사람 없이 조용히 걸을 수 있어요.',
        photoUrls: [placeholderPhoto('아라시야마 대나무숲', 120)],
      },
      {
        placeId: 'fushimi-inari',
        placeName: '후시미이나리',
        note: '천 개의 도리이를 다 오르면 다리가 후들거려요.',
        photoUrls: [placeholderPhoto('후시미이나리', 25)],
      },
    ],
    createdAt: '2026-04-10T09:00:00.000Z',
    isBookmarked: false,
    likeCount: 18,
    dislikeCount: 1,
    myReaction: null,
  },
  {
    id: 'explore-busan',
    title: '부산 야경 투어',
    summary: '광안대교 불빛이 바다에 번졌다',
    authorName: 'seaside_hoon',
    linkedPlanTitle: null,
    linkedPlanItinerary: null,
    path: [
      { x: 0.15, y: 0.2 },
      { x: 0.4, y: 0.6 },
      { x: 0.7, y: 0.3 },
      { x: 0.85, y: 0.7 },
    ],
    photoUrls: [
      placeholderPhoto('광안리해수욕장', 200),
      placeholderPhoto('해운대', 210),
      placeholderPhoto('태종대', 150),
      placeholderPhoto('감천문화마을', 30),
    ],
    tripDateRangeLabel: '2026.03.20 · 당일치기',
    visitedPlaces: [
      {
        placeId: 'gwangalli',
        placeName: '광안리해수욕장',
        note: '광안대교 조명이 켜지는 타이밍에 맞춰 갔어요.',
        photoUrls: [placeholderPhoto('광안리해수욕장', 200)],
      },
      {
        placeId: 'haeundae',
        placeName: '해운대',
        note: '낮에는 사람이 많아서 저녁 산책 코스로 추천.',
        photoUrls: [placeholderPhoto('해운대', 210)],
      },
      {
        placeId: 'taejongdae',
        placeName: '태종대',
        note: '순환 열차 타고 한 바퀴 돌면 편해요.',
        photoUrls: [placeholderPhoto('태종대', 150)],
      },
      {
        placeId: 'gamcheon',
        placeName: '감천문화마을',
        note: '골목이 미로 같아서 지도 필수예요.',
        photoUrls: [placeholderPhoto('감천문화마을', 30)],
      },
    ],
    createdAt: '2026-03-22T11:30:00.000Z',
    isBookmarked: false,
    likeCount: 7,
    dislikeCount: 0,
    myReaction: null,
  },
]
