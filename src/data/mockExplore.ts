import type { PlaceCategoryLabel } from '@/constants'

export type PlaceBadge = {
  label: string
  status?: 'success' | 'info' | 'error' | 'neutral'
}

export type MockPlace = {
  id: string
  title: string
  category: PlaceCategoryLabel
  /** 상세 화면 표시용 카테고리 (없으면 category 사용) */
  categoryLabel?: string
  location: string
  rating: number
  reviewCount?: number
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
  description: string
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
    title: '동문 시장',
    category: '쇼핑',
    categoryLabel: '전통시장',
    location: '제주시 일도일동',
    rating: 4.31,
    reviewCount: 1204,
    distance: '도보 5분',
    hours: '09:00~21:00',
    fee: '무료',
    description:
      '제주 대표 전통시장으로, 흑돼지와 오메기떡 등 향토 음식을 한곳에서 즐길 수 있어요. 활기찬 골목과 다양한 먹거리가 매력입니다.',
    badges: [{ label: '무료' }, { label: '★ 4.31', status: 'neutral' }],
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
    category: '액티비티',
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
    category: '식사',
    location: '제주시',
    rating: 4.16,
    distance: '차량 12분',
    hours: '11:00 - 21:00',
    fee: '유료',
    description: '현지인에게 인기 있는 분식집으로, 김밥과 떡볶이가 대표 메뉴입니다.',
    badges: [{ label: '식사' }, { label: '4.16', status: 'neutral' }],
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
  {
    id: 'gwandeokjeong',
    title: '관덕정',
    category: '역사',
    location: '제주시 일도일동',
    rating: 4.2,
    distance: '도보 8분',
    hours: '09:00 - 18:00',
    fee: '무료',
    description: '조선시대 제주의 중심 관아 건물로, 제주시내 역사 산책의 출발점입니다.',
    badges: [{ label: '무료' }, { label: '4.2', status: 'neutral' }],
  },
  {
    id: 'folk-village',
    title: '제주민속촌',
    category: '문화',
    location: '서귀포시 표선면',
    rating: 4.5,
    distance: '차량 40분',
    hours: '08:30 - 18:00',
    fee: '유료',
    description: '전통 가옥과 민속 문화를 한곳에서 둘러볼 수 있는 야외 박물관입니다.',
    badges: [{ label: '문화' }, { label: '4.5', status: 'neutral' }],
  },
  {
    id: 'aewol-stay',
    title: '애월 바다뷰 숙소',
    category: '숙소',
    location: '제주 애월읍',
    rating: 4.6,
    distance: '차량 28분',
    hours: '체크인 15:00',
    fee: '유료',
    description: '해안도로 근처의 아늑한 숙소로, 일몰과 바다 전망이 뛰어납니다.',
    badges: [{ label: '숙소' }, { label: '4.6', status: 'neutral' }],
  },
  {
    id: 'hallim-park',
    title: '한림공원',
    category: '자연',
    location: '제주 한림읍',
    rating: 4.5,
    distance: '도보 12분',
    hours: '08:30 - 18:00',
    fee: '유료',
    description: '협재 인근의 정원·동굴 공원으로, 산책과 포토 스팟을 함께 즐기기 좋아요.',
    badges: [{ label: '자연' }, { label: '4.5', status: 'neutral' }],
  },
  {
    id: 'seongsan-ilchulbong',
    title: '성산일출봉',
    category: '자연',
    location: '제주 성산읍',
    rating: 4.9,
    distance: '차량 50분',
    hours: '07:00 - 20:00',
    fee: '유료',
    description: '유네스코 세계자연유산으로, 정상에서 맞는 일출과 분화구 풍경이 압도적입니다.',
    badges: [{ label: '유료' }, { label: '4.9', status: 'neutral' }],
  },
  {
    id: 'seopjikoji-cafe',
    title: '섭지코지 카페',
    category: '카페',
    location: '제주 성산읍',
    rating: 4.4,
    distance: '도보 10분',
    hours: '09:00 - 19:00',
    fee: '음료 별도',
    description: '섭지코지 해안을 바라보며 쉬는 카페로, 성산일출봉 코스 중간에 들르기 좋아요.',
    badges: [{ label: '카페' }, { label: '4.4', status: 'neutral' }],
  },
  {
    id: 'seongsan-market',
    title: '성산 항구 시장',
    category: '쇼핑',
    categoryLabel: '시장',
    location: '제주 성산읍',
    rating: 4.2,
    distance: '도보 8분',
    hours: '08:00 - 20:00',
    fee: '무료',
    description: '성산항 인근 먹거리 시장으로, 해산물과 간식을 가볍게 즐기기 좋습니다.',
    badges: [{ label: '무료' }, { label: '4.2', status: 'neutral' }],
  },
  {
    id: 'udo-geommeolle',
    title: '우도 검멀레해변',
    category: '자연',
    location: '제주 우도면',
    rating: 4.7,
    distance: '페리 후 바이크 10분',
    hours: '상시 개방',
    fee: '무료',
    description: '검은 모래와 해식 동굴이 인상적인 우도 대표 해변입니다.',
    badges: [{ label: '무료' }, { label: '4.7', status: 'neutral' }],
  },
  {
    id: 'udo-cafe',
    title: '우도 카페',
    category: '카페',
    location: '제주 우도면',
    rating: 4.5,
    distance: '도보 8분',
    hours: '10:00 - 18:00',
    fee: '음료 별도',
    description: '해변을 따라 이어진 감성 카페로, 우도 일주 중 쉬어가기 좋아요.',
    badges: [{ label: '카페' }, { label: '4.5', status: 'neutral' }],
  },
  {
    id: 'udo-peanut',
    title: '땅콩 아이스크림',
    category: '식사',
    location: '제주 우도면',
    rating: 4.6,
    distance: '도보 5분',
    hours: '09:00 - 18:00',
    fee: '유료',
    description: '우도 명물 땅콩 아이스크림으로, 섬 여행의 달콤한 마무리입니다.',
    badges: [{ label: '식사' }, { label: '4.6', status: 'neutral' }],
  },
  {
    id: 'eorimok-trail',
    title: '어리목 탐방로',
    category: '자연',
    location: '제주 제주시',
    rating: 4.8,
    distance: '차량 40분',
    hours: '탐방 시간에 따름',
    fee: '무료',
    description: '한라산 서쪽 입구의 가벼운 트레킹 코스로, 초보 탐방객에게도 부담이 적습니다.',
    badges: [{ label: '무료' }, { label: '4.8', status: 'neutral' }],
  },
  {
    id: 'san-cafe',
    title: '산속 카페',
    category: '카페',
    location: '제주 제주시',
    rating: 4.3,
    distance: '차량 20분',
    hours: '10:00 - 19:00',
    fee: '음료 별도',
    description: '어리목 하산 후 들르기 좋은 산속 카페로, 따뜻한 음료와 디저트가 있어요.',
    badges: [{ label: '카페' }, { label: '4.3', status: 'neutral' }],
  },
]

export const MOCK_COURSES: MockCourse[] = [
  {
    id: 'hyeopjae',
    title: '협재 해수욕장 코스',
    summary: '협재해수욕장 · 카페 · 올레길',
    meta: '제주 한림읍 · 총 4개 장소 · 예상 3시간',
    description:
      '에메랄드빛 바다와 하얀 모래사장을 따라 걸으며, 카페와 공원을 여유롭게 둘러보는 한림 해안 코스입니다.',
    rating: 4.8,
    badges: [
      { label: '무료' },
      { label: '★ 4.8', status: 'neutral' },
      { label: '도보 위주', status: 'info' },
    ],
    tags: ['무료', '★ 4.8', '도보 위주'],
    steps: [
      { placeId: 'hyeopjae-beach', title: '협재 해수욕장', travelLabel: '도보 10분' },
      { placeId: 'hallim-cafe', title: '한림 해안 카페', travelLabel: '도보 6분' },
      { placeId: 'hallim-park', title: '한림공원', travelLabel: '도보 15분' },
      { placeId: 'aewol-cafe', title: '애월 카페거리', travelLabel: '도보 8분' },
    ],
  },
  {
    id: 'seongsan',
    title: '성산일출봉 코스',
    summary: '성산일출봉 · 섭지코지 · 카페',
    meta: '제주 성산읍 · 총 3개 장소 · 예상 4시간',
    description: '성산일출봉을 중심으로 섭지코지와 항구 시장을 도는 동쪽 대표 코스입니다.',
    rating: 4.9,
    badges: [
      { label: '유료', status: 'info' },
      { label: '★ 4.9', status: 'neutral' },
      { label: '일출', status: 'info' },
    ],
    tags: ['유료', '★ 4.9', '일출'],
    steps: [
      { placeId: 'seongsan-ilchulbong', title: '성산일출봉', travelLabel: '차량 15분' },
      { placeId: 'seopjikoji-cafe', title: '섭지코지 카페', travelLabel: '도보 10분' },
      { placeId: 'seongsan-market', title: '성산 항구 시장' },
    ],
  },
  {
    id: 'udo',
    title: '우도 하루 코스',
    summary: '우도 · 해변 · 땅콩아이스크림',
    meta: '제주 우도면 · 총 3개 장소 · 예상 5시간',
    description: '페리로 건너가 해변과 카페, 땅콩 아이스크림까지 즐기는 우도 하루 코스입니다.',
    rating: 4.7,
    badges: [
      { label: '유료', status: 'info' },
      { label: '★ 4.7', status: 'neutral' },
      { label: '섬여행', status: 'info' },
    ],
    tags: ['유료', '★ 4.7', '섬여행'],
    steps: [
      { placeId: 'udo-geommeolle', title: '우도 검멀레해변', travelLabel: '전동바이크 10분' },
      { placeId: 'udo-cafe', title: '우도 카페', travelLabel: '도보 8분' },
      { placeId: 'udo-peanut', title: '땅콩 아이스크림' },
    ],
  },
  {
    id: 'hallasan',
    title: '한라산 가볍게 코스',
    summary: '한라산 · 어리목 · 카페',
    meta: '제주 제주시 · 총 3개 장소 · 예상 6시간',
    description: '어리목 탐방로를 가볍게 걷고 산속 카페와 동문시장으로 마무리하는 코스입니다.',
    rating: 4.8,
    badges: [
      { label: '무료' },
      { label: '★ 4.8', status: 'neutral' },
      { label: '자연', status: 'info' },
    ],
    tags: ['무료', '★ 4.8', '자연'],
    steps: [
      { placeId: 'eorimok-trail', title: '어리목 탐방로', travelLabel: '도보 30분' },
      { placeId: 'san-cafe', title: '산속 카페', travelLabel: '차량 20분' },
      { placeId: 'dongmun', title: '동문 시장' },
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

export type TravelPickTheme = {
  cream: string
  accent: string
  navy: string
  starColor: string
}

export type MockTravelPick = {
  id: string
  placeId: string
  title: string
  eyebrow: string
  region: string
  description: string
  tags: string[]
  rating: number
  duration: string
  badge: string
  imageUrl: string
  theme: TravelPickTheme
}

/** 홈 ‘오늘의 관광지 추천’ 가로 카드 (히어로는 사진) */
export const MOCK_TRAVEL_PICKS: MockTravelPick[] = [
  {
    id: 'pick-hyeopjae',
    placeId: 'hyeopjae-beach',
    title: '협재',
    eyebrow: '에메랄드 바다',
    region: '제주 · 한림읍',
    description: '하얀 모래와 비양도가 한눈에 들어오는 서쪽의 대표 해변입니다.',
    tags: ['해수욕장', '일몰'],
    rating: 4.8,
    duration: '반나절',
    badge: '여행자 추천',
    imageUrl:
      'https://images.unsplash.com/photo-1612977512598-3b8d6a498bbb?auto=format&fit=crop&w=640&q=80',
    theme: {
      cream: '#FBF6EC',
      accent: '#2F8F8A',
      navy: '#122E3B',
      starColor: '#DC9C3F',
    },
  },
  {
    id: 'pick-seongsan',
    placeId: 'seongsan-ilchulbong',
    title: '성산',
    eyebrow: '일출봉의 아침',
    region: '제주 · 성산읍',
    description: '우뚝 솟은 분화구와 드넓은 초원, 동쪽에서 맞는 제주 일출의 상징입니다.',
    tags: ['일출', '트레킹'],
    rating: 4.9,
    duration: '반나절',
    badge: '오늘의 픽',
    imageUrl:
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=640&q=80',
    theme: {
      cream: '#F7F1E4',
      accent: '#3F6B52',
      navy: '#2B2420',
      starColor: '#C1652E',
    },
  },
  {
    id: 'pick-aewol',
    placeId: 'aewol-cafe',
    title: '애월',
    eyebrow: '카페와 해안도로',
    region: '제주 · 애월읍',
    description: '바다를 옆에 두고 달리는 해안도로와 감성 카페가 이어지는 코스입니다.',
    tags: ['카페거리', '드라이브'],
    rating: 4.7,
    duration: '당일치기',
    badge: '감성 코스',
    imageUrl:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=640&q=80',
    theme: {
      cream: '#FBF6EC',
      accent: '#3E7C74',
      navy: '#163A47',
      starColor: '#E0A24C',
    },
  },
  {
    id: 'pick-dongmun',
    placeId: 'dongmun',
    title: '동문',
    eyebrow: '제주의 맛 골목',
    region: '제주 · 일도일동',
    description: '흑돼지와 오메기떡, 활기찬 시장 골목에서 느끼는 현지 미식 여행입니다.',
    tags: ['전통시장', '먹거리'],
    rating: 4.3,
    duration: '2~3시간',
    badge: '미식 추천',
    imageUrl:
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=640&q=80',
    theme: {
      cream: '#F5F1E4',
      accent: '#5B7A54',
      navy: '#1B1F3B',
      starColor: '#C9A227',
    },
  },
  {
    id: 'pick-udo',
    placeId: 'udo-geommeolle',
    title: '우도',
    eyebrow: '자전거로 도는 섬',
    region: '제주 · 우도면',
    description: '검멀레 해변과 땅콩 아이스크림, 하루면 충분한 작은 섬 여행입니다.',
    tags: ['섬여행', '자전거'],
    rating: 4.7,
    duration: '1박2일',
    badge: '낭만 하루',
    imageUrl:
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=640&q=80',
    theme: {
      cream: '#F7F3EA',
      accent: '#2FB6B0',
      navy: '#0F2438',
      starColor: '#D8467A',
    },
  },
  {
    id: 'pick-hallasan',
    placeId: 'eorimok-trail',
    title: '한라산',
    eyebrow: '오름과 능선',
    region: '제주 · 어리목',
    description: '가볍게 오르는 탐방로와 산속 공기, 제주 중심의 초록 능선을 느껴보세요.',
    tags: ['자연', '하이킹'],
    rating: 4.8,
    duration: '반나절',
    badge: '제주 봄 시즌',
    imageUrl:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=640&q=80',
    theme: {
      cream: '#FBF3E4',
      accent: '#E8871E',
      navy: '#1B4B43',
      starColor: '#E8871E',
    },
  },
]
