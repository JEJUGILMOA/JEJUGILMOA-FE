import type { ApiEnvelope } from './types'

export function isApiEnvelope(data: unknown): data is ApiEnvelope<unknown> {
  return (
    !!data &&
    typeof data === 'object' &&
    'isSuccess' in data &&
    'result' in data &&
    typeof (data as ApiEnvelope<unknown>).isSuccess === 'boolean'
  )
}

/** 스웨거 공통 `{ isSuccess, code, message, result }` 에서 `result`만 꺼낸다. */
export function unwrapApiResult<T>(data: unknown): T {
  if (isApiEnvelope(data)) {
    return data.result as T
  }
  return data as T
}
