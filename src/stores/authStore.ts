import { createStore } from 'zustand/vanilla'
import { useStore } from 'zustand'

export type AuthUser = {
  id: string
  nickname: string
  profileImageUrl?: string
}

type AuthState = {
  accessToken: string | null
  user: AuthUser | null
  isAuthenticated: boolean
  setAuth: (payload: { accessToken: string; user: AuthUser }) => void
  clearAuth: () => void
}

export const authStore = createStore<AuthState>()((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  setAuth: ({ accessToken, user }) =>
    set({
      accessToken,
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
