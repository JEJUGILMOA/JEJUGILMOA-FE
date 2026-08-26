import { apiGet, apiPost } from '@/api/http'
import type {
  OAuthLoginRequest,
  OAuthLoginResult,
  OAuthProvider,
  UserProfileResult,
} from '@/api/types'

/** 소셜 로그인 — 성공 시 백엔드가 인증 쿠키를 심는다 */
export function loginWithOAuth(provider: OAuthProvider, body: OAuthLoginRequest) {
  return apiPost<OAuthLoginResult>(`/auth/oauth/${provider}/login`, body)
}

/** 액세스/리프레시 쿠키 재발급 */
export function reissueAuth() {
  return apiPost<void>('/auth/reissue')
}

/** 로그아웃 — 인증 쿠키 제거 */
export function logoutAuth(deviceId?: string) {
  return apiPost<void>('/auth/logout', undefined, {
    params: deviceId ? { deviceId } : undefined,
  })
}

/** 내 프로필 */
export function fetchMyProfile() {
  return apiGet<UserProfileResult>('/users/me')
}
