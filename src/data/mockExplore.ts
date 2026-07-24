export type PlaceBadge = {
  label: string
  status?: 'success' | 'info' | 'error' | 'neutral'
}

export type MockPlace = {
  id: string
  title: string
  category: '전체' | '식당' | '카페' | '자연'
  location: string
  rating: number
  distance?: string
  hours?: string
  fee?: string
  description?: string
  badges?: PlaceBadge[]
}

export type MockCourseStep = {
  placeId: string
  title: string
  travelLabel?: string
}

export type MockCourse = {
  id: string
  title: string
  summary: string
  meta: string
  rating: number
  badges: PlaceBadge[]
  tags?: string[]
  steps: MockCourseStep[]
}

export type MockReview = {
  id: string
  userName: string
  rating: number
  date: string
  content: string
}

export const MOCK_PLACES: MockPlace[] = [
  {
    id: 'dongmun',
    title: '동문시장',
    category: '식당',
    location: '제주시 일도일동',
    rating: 4.6,
    distance: '도보 5분',
    hours: '08:00 - 21:00',
    fee: '무료',
    description:
      '제주 대표 전통시장으로, 흑돼지와 오메기떡 등 향토 음식을 한곳에서 즐길 수 있어요.',
    badges: [{ label: '무료' }, { label: '4.6', status: 'neutral' }],
  },
  {
    id: 'hyeopjae-beach',
    title: '협재 해수욕장',
    category: '자연',
    location: '제주 한림읍',
    rating: 4.8,
    distance: '도보 3분',
    hours: '상시 개방',
    fee: '무료',
    description: '에메랄드빛 바다와 비양도가 한눈에 보이는 제주의 대표 해변입니다.',
    badges: [{ label: '무료' }, { label: '4.8', status: 'neutral' }],
  },
  {
    id: 'hallim-cafe',
    title: '한림 해안 카페',
    category: '카페',
    location: '제주 한림읍',
    rating: 4.5,
    distance: '도보 10분',
    hours: '10:00 - 20:00',
    fee: '음료 별도',
    description: '협재 해변 인근의 오션뷰 카페로, 산책 후 쉬어가기 좋아요.',
    badges: [{ label: '카페' }, { label: '4.5', status: 'neutral' }],
  },
  {
    id: 'olle-trail',
    title: '올레길 14코스',
    category: '자연',
    location: '제주 한림읍',
    rating: 4.7,
    distance: '도보 15분',
    hours: '상시 개방',
    fee: '무료',
    description: '해안 절경을 따라 걷는 올레길로, 가벼운 트레킹에 적합합니다.',
    badges: [{ label: '무료' }, { label: '4.7', status: 'neutral' }],
  },
  {
    id: 'jeongi-snack',
    title: '쩡이네 분식',
    category: '식당',
    location: '제주시',
    rating: 4.16,
    distance: '차량 12분',
    hours: '11:00 - 21:00',
    fee: '유료',
    description: '현지인에게 인기 있는 분식집으로, 김밥과 떡볶이가 대표 메뉴입니다.',
    badges: [{ label: '식당' }, { label: '4.16', status: 'neutral' }],
  },
  {
    id: 'aewol-cafe',
    title: '애월 카페거리',
    category: '카페',
    location: '제주 애월읍',
    rating: 4.4,
    distance: '차량 25분',
    hours: '09:00 - 22:00',
    fee: '음료 별도',
    description: '바다를 보며 여유로운 브런치와 커피를 즐길 수 있는 카페 밀집 지역입니다.',
    badges: [{ label: '카페' }, { label: '4.4', status: 'neutral' }],
  },
]

export const MOCK_COURSES: MockCourse[] = [
  {
    id: 'hyeopjae',
    title: '협재 해수욕장 코스',
    summary: '협재해수욕장 · 카페 · 올레길',
    meta: '제주 한림읍 · 도보 중심',
    rating: 4.8,
    badges: [
      { label: '무료' },
      { label: '4.8', status: 'neutral' },
    ],
    tags: ['무료', '4.8', '도보 중심'],
    steps: [
      { placeId: 'hyeopjae-beach', title: '협재 해수욕장', travelLabel: '도보 10분' },
      { placeId: 'hallim-cafe', title: '한림 해안 카페', travelLabel: '도보 15분' },
      { placeId: 'olle-trail', title: '올레길 14코스', travelLabel: '도보 20분' },
      { placeId: 'jeongi-snack', title: '쩡이네 분식' },
    ],
  },
  {
    id: 'seongsan',
    title: '성산일출봉 코스',
    summary: '성산일출봉 · 섭지코지 · 카페',
    meta: '제주 성산읍 · 차량 20분',
    rating: 4.9,
    badges: [
      { label: '유료', status: 'info' },
      { label: '4.9', status: 'neutral' },
    ],
    tags: ['유료', '4.9', '일출'],
    steps: [
      { placeId: 'hyeopjae-beach', title: '성산일출봉', travelLabel: '차량 15분' },
      { placeId: 'aewol-cafe', title: '섭지코지 카페', travelLabel: '도보 10분' },
      { placeId: 'dongmun', title: '성산 항구 시장' },
    ],
  },
  {
    id: 'udo',
    title: '우도 하루 코스',
    summary: '우도 · 해변 · 땅콩아이스크림',
    meta: '제주 우도면 · 페리 15분',
    rating: 4.7,
    badges: [
      { label: '유료', status: 'info' },
      { label: '4.7', status: 'neutral' },
    ],
    tags: ['유료', '4.7', '섬여행'],
    steps: [
      { placeId: 'olle-trail', title: '우도 검멀레해변', travelLabel: '전동바이크 10분' },
      { placeId: 'hallim-cafe', title: '우도 카페', travelLabel: '도보 8분' },
      { placeId: 'jeongi-snack', title: '땅콩 아이스크림' },
    ],
  },
  {
    id: 'hallasan',
    title: '한라산 가볍게 코스',
    summary: '한라산 · 어리목 · 카페',
    meta: '제주 제주시 · 차량 40분',
    rating: 4.8,
    badges: [
      { label: '무료' },
      { label: '4.8', status: 'neutral' },
    ],
    tags: ['무료', '4.8', '자연'],
    steps: [
      { placeId: 'olle-trail', title: '어리목 탐방로', travelLabel: '도보 30분' },
      { placeId: 'aewol-cafe', title: '산속 카페', travelLabel: '차량 20분' },
      { placeId: 'dongmun', title: '제주 동문시장' },
    ],
  },
]

export const MOCK_REVIEWS: MockReview[] = [
  {
    id: 'r1',
    userName: '여행자민수',
    rating: 5,
    date: '2026.07.12',
    content: '사람 많지만 먹거리 선택이 다양해서 좋았어요. 흑돼지 꼬치는 꼭 드세요!',
  },
  {
    id: 'r2',
    userName: '제주러버',
    rating: 4,
    date: '2026.07.03',
    content: '오메기떡이 신선하고 맛있습니다. 주말엔 웨이팅이 있으니 오전에 가는 걸 추천해요.',
  },
  {
    id: 'r3',
    userName: '하루코스',
    rating: 5,
    date: '2026.06.28',
    content: '코스 중간에 들르기 좋아요. 근처 주차장이 협소해서 대중교통이 편했습니다.',
  },
]

export function getCourseById(courseId: string) {
  return MOCK_COURSES.find((course) => course.id === courseId)
}

export function getPlaceById(placeId: string) {
  return MOCK_PLACES.find((place) => place.id === placeId)
}
