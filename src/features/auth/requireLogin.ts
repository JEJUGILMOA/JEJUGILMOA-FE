import { isApiError } from '@/api/error'
import { authStore } from '@/stores/authStore'
import { loginPromptStore } from '@/stores/loginPromptStore'

type RequireLoginOptions = {
  title?: string
  description?: string
  returnTo?: string
}

/**
 * 로그인된 경우 true.
 * 아니면 로그인 유도 모달을 띄우고 false를 반환한다.
 */
export function requireLogin(options?: RequireLoginOptions): boolean {
  if (authStore.getState().isAuthenticated) return true
  loginPromptStore.getState().openPrompt(options)
  return false
}

/** API 401이면 로그인 모달을 띄우고 true. 그 외는 false. */
export function promptLoginOnUnauthorized(
  error: unknown,
  options?: RequireLoginOptions,
): boolean {
  if (!isApiError(error) || error.status !== 401) return false
  loginPromptStore.getState().openPrompt(options)
  return true
}
