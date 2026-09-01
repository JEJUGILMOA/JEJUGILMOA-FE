import { apiDelete, apiGet, apiPatch, apiPost } from '@/api/http'
import { apiClient } from '@/api/axios'
import { unwrapApiResult } from '@/api/unwrap'
import type { OAuthLoginRequest, OAuthLoginResult, OAuthProvider } from '@/api/types'
import {
  userProfileSchema,
  userSettingsSchema,
  devAuthResponseSchema,
  type UserProfile,
  type UserSettings,
  type UserSettingsUpdate,
  type UserUpdateRequest,
  type DevAuthResponse,
} from './schemas'

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

/** [개발전용] 이메일 로그인 — Swagger 경로는 /dev/auth/login (/api prefix 없음) */
export async function loginWithDevAuth(email: string): Promise<DevAuthResponse> {
  const { data } = await apiClient.post<unknown>('/dev/auth/login', { email }, { baseURL: '' })
  return devAuthResponseSchema.parse(unwrapApiResult(data))
}

/** 내 프로필 */
export async function fetchMyProfile(): Promise<UserProfile> {
  const data = await apiGet<unknown>('/users/me')
  return userProfileSchema.parse(data)
}

/** 내 프로필 수정 */
export async function updateMyProfile(body: UserUpdateRequest): Promise<UserProfile> {
  const data = await apiPatch<unknown>('/users/me', body)
  return userProfileSchema.parse(data)
}

/** 내 설정 조회 */
export async function fetchMySettings(): Promise<UserSettings> {
  const data = await apiGet<unknown>('/users/me/settings')
  return userSettingsSchema.parse(data)
}

/** 내 설정 수정 */
export async function updateMySettings(body: UserSettingsUpdate): Promise<UserSettings> {
  const data = await apiPatch<unknown>('/users/me/settings', body)
  return userSettingsSchema.parse(data)
}

/** 회원 탈퇴 */
export function withdrawMyAccount() {
  return apiDelete<void>('/users/me')
}
