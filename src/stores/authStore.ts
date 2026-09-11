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

function isLikelyNativeWebView() {
  return typeof window !== 'undefined' && Boolean(window.ReactNativeWebView)
}

type AuthState = {
  /** 쿠키 세션이 본체. 개발 mock / 레거시 브릿지용으로만 사용 */
  accessToken: string | null
  user: AuthUser | null
  isAuthenticated: boolean
  /**
   * 네이티브 AUTH_* 주입 전 false.
   * false면 마이페이지 등에서 게스트 CTA 대신 로딩을 보여 준다.
   */
  isAuthResolved: boolean
  setAuth: (payload: { user: AuthUser; accessToken?: string | null }) => void
  setUser: (user: AuthUser) => void
  markAuthResolved: () => void
  clearAuth: () => void
}

export const authStore = createStore<AuthState>()((set) => ({
  // 쿠키 세션이 본체. DEV_AUTH는 UI용 로그인 상태만 켜고 Bearer는 붙이지 않는다.
  accessToken: null,
  user: useDevAuth ? DEV_USER : null,
  isAuthenticated: useDevAuth,
  // WebView는 AUTH_TOKEN/SESSION/GUEST가 오기 전까지 미확정
  isAuthResolved: useDevAuth || !isLikelyNativeWebView(),
  setAuth: ({ user, accessToken = null }) =>
    set({
      accessToken,
      user,
      isAuthenticated: true,
      isAuthResolved: true,
    }),
  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
      isAuthResolved: true,
    }),
  markAuthResolved: () => set({ isAuthResolved: true }),
  clearAuth: () =>
    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      isAuthResolved: true,
    }),
}))

export function useAuthStore<T>(selector: (state: AuthState) => T): T {
  return useStore(authStore, selector)
}
