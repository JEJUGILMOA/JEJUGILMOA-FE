/** 스웨거 공통 응답 래퍼 `ApiResponse*` */
export type ApiEnvelope<T> = {
  isSuccess: boolean
  code: string
  message: string
  result: T
}

export type OAuthProvider = 'kakao' | 'google' | 'naver'

export type OAuthLoginRequest = {
  authorizationCode: string
  redirectUri?: string
  state?: string
}

/** POST /api/auth/apple/login — iOS Apple 전용 */
export type AppleLoginRequest = {
  identityToken: string
  rawNonce: string
}

export type OAuthLoginResult = {
  userId: number
  nickname: string
  profileImageUrl?: string | null
  role: 'USER' | 'ADMIN'
  newUser: boolean
}

export type UserProfileResult = {
  nickname: string
  profileImageUrl?: string
  bio?: string
  completedTripCount?: number
  favoriteCount?: number
  badgeCount?: number
  email?: string
  joinedAt?: string
}
