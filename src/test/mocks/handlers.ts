import { http, HttpResponse } from 'msw'

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
]
