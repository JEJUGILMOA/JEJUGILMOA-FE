export type MyProfile = {
  nickname: string
  email: string
  bio: string
  joinedAt: string
  profileImageUrl?: string
  completedTrips: number
  favorites: number
  badges: number
}

export type TripStatus = 'ongoing' | 'planned' | 'completed'

export type MyTrip = {
  id: string
  title: string
  status: TripStatus
  summary: string
  detail?: string
  progress?: number
  nextPlace?: string
  badge?: string
}

export type FavoritePlace = {
  id: string
  name: string
  region: string
  category: string
}

export type BadgeItem = {
  id: string
  name: string
  description: string
  earned: boolean
  category: string
}

export type SharedRecord = {
  id: string
  title: string
  date: string
  stops: number
  views: number
  likes: number
  comments: number
  link: string
  coverTone: 'warm' | 'muted'
}

export type NoticeItem = {
  id: string
  title: string
  date: string
  body: string
}

export type TermItem = {
  id: string
  title: string
  body: string
}


export const mockProfile: MyProfile = {
  nickname: '김여행',
  email: 'travel_kim@email.com',
  bio: '여행 다니는 걸 좋아해요 ✈️',
  joinedAt: '2025.03.14',
  completedTrips: 7,
  favorites: 12,
  badges: 5,
}

export const mockTrips: MyTrip[] = [
  {
    id: 'trip-1',
    title: '제주 3박4일',
    status: 'ongoing',
    summary: '진행중 · 2일차 / 4일',
    detail: '다음: 성산일출봉 · 도보 12분',
    progress: 0.45,
  },
  {
    id: 'trip-2',
    title: '부산 당일치기',
    status: 'planned',
    summary: '2026.08.02 · 경유지 3',
    badge: 'D-21',
  },
  {
    id: 'trip-3',
    title: '경주 1박2일',
    status: 'completed',
    summary: '2026.05.10–11',
    badge: '완료',
  },
]

export const mockFavorites: FavoritePlace[] = [
  { id: 'fav-1', name: '성산일출봉', region: '서귀포', category: '자연' },
  { id: 'fav-2', name: '협재해수욕장', region: '제주시', category: '해변' },
  { id: 'fav-3', name: '오설록 티뮤지엄', region: '서귀포', category: '문화' },
]

export const mockBadges: BadgeItem[] = [
  {
    id: 'badge-1',
    name: '첫 발걸음',
    description: '첫 여행 기록 완료',
    earned: true,
    category: '시작',
  },
  {
    id: 'badge-2',
    name: '해변 탐험가',
    description: '해변 장소 5곳 방문',
    earned: true,
    category: '탐험',
  },
  {
    id: 'badge-3',
    name: '카페 마스터',
    description: '카페 10곳 방문',
    earned: false,
    category: '탐험',
  },
]

export const mockSharedRecords: SharedRecord[] = [
  {
    id: 'share-1',
    title: '제주 3박4일 여행기',
    date: '2026.07.05',
    stops: 7,
    views: 128,
    likes: 24,
    comments: 6,
    link: 'https://gilmoa.app/s/jeju-3n4d',
    coverTone: 'warm',
  },
  {
    id: 'share-2',
    title: '경주 답사 코스',
    date: '2026.05.12',
    stops: 6,
    views: 46,
    likes: 5,
    comments: 1,
    link: 'https://gilmoa.app/s/gyeongju',
    coverTone: 'muted',
  },
]

export const mockNotices: NoticeItem[] = [
  {
    id: 'notice-1',
    title: '제주길모아 서비스 오픈 안내',
    date: '2026.07.01',
    body: '제주 여행을 더 편리하게 즐길 수 있도록 제주길모아 서비스를 오픈했습니다. 많은 이용 부탁드립니다.',
  },
  {
    id: 'notice-2',
    title: '개인정보 처리방침 개정 안내',
    date: '2026.06.15',
    body: '관련 법령 개정에 따라 개인정보 처리방침이 일부 변경됩니다. 마이페이지 > 약관 및 정책에서 확인하세요.',
  },
]

export const mockTerms: TermItem[] = [
  {
    id: 'service',
    title: '서비스 이용약관',
    body: '본 약관은 제주길모아 서비스 이용과 관련하여 회사와 이용자 간의 권리·의무 및 책임사항을 규정합니다.',
  },
  {
    id: 'privacy',
    title: '개인정보 처리방침',
    body: '회사는 이용자의 개인정보를 중요시하며, 관련 법령을 준수하여 개인정보를 안전하게 처리합니다.',
  },
  {
    id: 'location',
    title: '위치기반서비스 이용약관',
    body: '위치기반서비스는 이용자의 동의 하에 제공되며, 서비스 목적 범위 내에서만 위치정보를 이용합니다.',
  },
]

