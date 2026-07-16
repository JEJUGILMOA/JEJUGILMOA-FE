export class ApiError extends Error {
  readonly status: number
  readonly code: string
  readonly details?: unknown

  constructor(message: string, status: number, code = 'UNKNOWN', details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

export function getErrorMessage(error: unknown, fallback = '요청을 처리하지 못했습니다.') {
  if (isApiError(error)) return error.message
  if (error instanceof Error) return error.message
  return fallback
}
