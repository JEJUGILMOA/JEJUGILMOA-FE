import type { OAuthLoginResult } from '@/api/types'
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
