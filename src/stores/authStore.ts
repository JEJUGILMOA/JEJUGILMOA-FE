import { createStore } from 'zustand/vanilla'
import { useStore } from 'zustand'

export type AuthUser = {
  id: string
  nickname: string
  profileImageUrl?: string
}

const useDevAuth = import.meta.env.VITE_DEV_AUTH !== 'false'

const DEV_USER: AuthUser = {
  id: '1',
  nickname: '김여행',
}

type AuthState = {
  /** 쿠키 세션이 본체. 개발 mock / 레거시 브릿지용으로만 사용 */
  accessToken: string | null
  user: AuthUser | null
  isAuthenticated: boolean
  setAuth: (payload: { user: AuthUser; accessToken?: string | null }) => void
  setUser: (user: AuthUser) => void
  clearAuth: () => void
}

export const authStore = createStore<AuthState>()((set) => ({
  accessToken: useDevAuth ? 'dev-token' : null,
  user: useDevAuth ? DEV_USER : null,
  isAuthenticated: useDevAuth,
  setAuth: ({ user, accessToken = null }) =>
    set({
      accessToken,
      user,
      isAuthenticated: true,
    }),
  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
    }),
  clearAuth: () =>
    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
    }),
}))

export function useAuthStore<T>(selector: (state: AuthState) => T): T {
  return useStore(authStore, selector)
}
