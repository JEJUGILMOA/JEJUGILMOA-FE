import { createStore } from 'zustand/vanilla'
import { useStore } from 'zustand'

type LoginPromptState = {
  open: boolean
  title: string
  description: string
  returnTo: string
  openPrompt: (options?: {
    title?: string
    description?: string
    returnTo?: string
  }) => void
  closePrompt: () => void
}

const DEFAULT_TITLE = '로그인이 필요해요'
const DEFAULT_DESCRIPTION = '이 기능을 이용하려면 로그인해 주세요.'

export const loginPromptStore = createStore<LoginPromptState>()((set) => ({
  open: false,
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  returnTo: '/',
  openPrompt: (options) =>
    set({
      open: true,
      title: options?.title ?? DEFAULT_TITLE,
      description: options?.description ?? DEFAULT_DESCRIPTION,
      returnTo: options?.returnTo ?? (typeof window !== 'undefined' ? window.location.pathname : '/'),
    }),
  closePrompt: () => set({ open: false }),
}))

export function useLoginPromptStore<T>(selector: (state: LoginPromptState) => T): T {
  return useStore(loginPromptStore, selector)
}
