import { createStore } from 'zustand/vanilla'
import { useStore } from 'zustand'

const MAX_LOG_ENTRIES = 30

export type MyPageApiLogStatus = 'pending' | 'success' | 'error'

export type MyPageApiLogEntry = {
  id: string
  method: string
  url: string
  status: MyPageApiLogStatus
  httpStatus?: number
  requestHeaders: Record<string, unknown>
  requestParams: unknown
  requestBody: unknown
  responseHeaders?: Record<string, unknown>
  responseBody?: unknown
  isSuccess?: boolean
  code?: string
  message?: string
  result?: unknown
  errorMessage?: string
  createdAt: number
  updatedAt: number
}

type MyPageApiLogState = {
  entries: MyPageApiLogEntry[]
  isOpen: boolean
  addRequest: (entry: Omit<MyPageApiLogEntry, 'status' | 'createdAt' | 'updatedAt'> & { status?: MyPageApiLogStatus }) => void
  completeSuccess: (
    id: string,
    payload: {
      httpStatus: number
      responseHeaders?: Record<string, unknown>
      responseBody?: unknown
      isSuccess?: boolean
      code?: string
      message?: string
      result?: unknown
    },
  ) => void
  completeError: (
    id: string,
    payload: {
      httpStatus?: number
      responseHeaders?: Record<string, unknown>
      responseBody?: unknown
      errorMessage?: string
    },
  ) => void
  clear: () => void
  setOpen: (isOpen: boolean) => void
  toggleOpen: () => void
}

export const mypageApiLogStore = createStore<MyPageApiLogState>()((set) => ({
  entries: [],
  isOpen: true,
  addRequest: (entry) =>
    set((state) => {
      const now = Date.now()
      const next: MyPageApiLogEntry = {
        ...entry,
        status: entry.status ?? 'pending',
        createdAt: now,
        updatedAt: now,
      }
      return {
        entries: [next, ...state.entries].slice(0, MAX_LOG_ENTRIES),
      }
    }),
  completeSuccess: (id, payload) =>
    set((state) => ({
      entries: state.entries.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              status: 'success',
              httpStatus: payload.httpStatus,
              responseHeaders: payload.responseHeaders,
              responseBody: payload.responseBody,
              isSuccess: payload.isSuccess,
              code: payload.code,
              message: payload.message,
              result: payload.result,
              updatedAt: Date.now(),
            }
          : entry,
      ),
    })),
  completeError: (id, payload) =>
    set((state) => ({
      entries: state.entries.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              status: 'error',
              httpStatus: payload.httpStatus,
              responseHeaders: payload.responseHeaders,
              responseBody: payload.responseBody,
              errorMessage: payload.errorMessage,
              updatedAt: Date.now(),
            }
          : entry,
      ),
    })),
  clear: () => set({ entries: [] }),
  setOpen: (isOpen) => set({ isOpen }),
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
}))

export function useMyPageApiLogStore<T>(selector: (state: MyPageApiLogState) => T): T {
  return useStore(mypageApiLogStore, selector)
}
