import type { OAuthLoginResult } from '@/api/types'
import type { DevAuthResponse } from '@/features/auth/schemas'
import { authStore } from '@/stores/authStore'

export function applyOAuthLoginResult(result: OAuthLoginResult) {
  authStore.getState().setAuth({
    user: {
      id: String(result.userId),
      nickname: result.nickname,
      profileImageUrl: result.profileImageUrl,
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
