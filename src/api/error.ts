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

/** 사용자 표시용 — `[PLAN400_12]` 같은 코드 prefix 제거 */
function toUserFacingMessage(message: string, fallback: string): string {
  const stripped = message.replace(/^\[[A-Za-z0-9_]+\]\s*/, '').trim()
  return stripped || fallback
}

export function getErrorMessage(error: unknown, fallback = '요청을 처리하지 못했습니다.') {
  if (isApiError(error)) return toUserFacingMessage(error.message, fallback)
  if (error instanceof Error) return toUserFacingMessage(error.message, fallback)
  return fallback
}

export function formatErrorLog(error: unknown): string {
  if (isApiError(error)) {
    const lines = [`[${error.code}] ${error.message}`]
    if (error.status) lines.push(`HTTP ${error.status}`)
    if (error.details != null) {
      try {
        lines.push(JSON.stringify(error.details, null, 2))
      } catch {
        lines.push(String(error.details))
      }
    }
    return lines.join('\n')
  }

  if (error instanceof Error) {
    return error.stack ?? error.message
  }

  try {
    return JSON.stringify(error, null, 2)
  } catch {
    return String(error)
  }
}
