import type { OAuthLoginResult } from '@/api/types'
import type { DevAuthResponse } from '@/features/auth/schemas'
import { authStore } from '@/stores/authStore'

/** 브릿지 LOGIN_SUCCESS / AUTH_* 용 — null 필드 제거 */
export function toBridgeAuthUser(result: {
  userId: string | number
  nickname: string
  profileImageUrl?: string | null
}) {
  return {
    id: String(result.userId),
    nickname: result.nickname,
    ...(result.profileImageUrl ? { profileImageUrl: result.profileImageUrl } : {}),
  }
}

export function applyOAuthLoginResult(result: OAuthLoginResult) {
  authStore.getState().setAuth({
    user: {
      id: String(result.userId),
      nickname: result.nickname,
      profileImageUrl: result.profileImageUrl ?? undefined,
    },
  })
}

export function applyDevLoginResult(result: DevAuthResponse) {
  authStore.getState().setAuth({
    accessToken: result.accessToken,
    user: {
      id: result.userId,
      nickname: result.nickname,
    },
  })
}
