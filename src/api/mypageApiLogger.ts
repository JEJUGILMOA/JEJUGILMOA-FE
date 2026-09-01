import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { mypageApiLogStore } from '@/stores/mypageApiLogStore'
import { isApiEnvelope } from './unwrap'

/** 마이페이지에서 호출하는 API 경로 */
const MY_PAGE_API_PATTERN =
  /\/users\/me|\/dev\/auth\/|\/badges\/me|\/plans(?:\?|$|\/)|\/records|\/auth\/logout/

type LoggedConfig = InternalAxiosRequestConfig & {
  _myPageLogId?: string
}

function shouldLogMyPageApi(): boolean {
  return import.meta.env.DEV
}

export function getRequestUrl(config: InternalAxiosRequestConfig): string {
  const base = config.baseURL ?? ''
  const path = config.url ?? ''

  if (path.startsWith('http://') || path.startsWith('https://')) return path
  if (!base) return path
  if (base.endsWith('/') && path.startsWith('/')) return `${base.slice(0, -1)}${path}`
  return `${base}${path}`
}

export function isMyPageApiRequest(config: InternalAxiosRequestConfig): boolean {
  return MY_PAGE_API_PATTERN.test(getRequestUrl(config))
}

function toPlainHeaders(headers: InternalAxiosRequestConfig['headers'] | AxiosResponse['headers']) {
  if (!headers) return {}
  if (typeof headers.toJSON === 'function') return headers.toJSON() as Record<string, unknown>
  return headers as Record<string, unknown>
}

function createLogId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function logMyPageApiRequest(config: InternalAxiosRequestConfig) {
  if (!shouldLogMyPageApi() || !isMyPageApiRequest(config)) return

  const id = createLogId()
  ;(config as LoggedConfig)._myPageLogId = id

  mypageApiLogStore.getState().addRequest({
    id,
    method: (config.method ?? 'get').toUpperCase(),
    url: getRequestUrl(config),
    requestHeaders: toPlainHeaders(config.headers),
    requestParams: config.params ?? null,
    requestBody: config.data ?? null,
  })
}

export function logMyPageApiResponse(response: AxiosResponse) {
  if (!shouldLogMyPageApi()) return

  const config = response.config as LoggedConfig
  if (!isMyPageApiRequest(config) || !config._myPageLogId) return

  const data = response.data
  const envelope = isApiEnvelope(data) ? data : null

  mypageApiLogStore.getState().completeSuccess(config._myPageLogId, {
    httpStatus: response.status,
    responseHeaders: toPlainHeaders(response.headers),
    responseBody: data,
    isSuccess: envelope?.isSuccess,
    code: envelope?.code,
    message: envelope?.message,
    result: envelope?.result,
  })
}

export function logMyPageApiError(error: AxiosError) {
  if (!shouldLogMyPageApi() || !error.config || !isMyPageApiRequest(error.config)) return

  const config = error.config as LoggedConfig
  if (!config._myPageLogId) return

  mypageApiLogStore.getState().completeError(config._myPageLogId, {
    httpStatus: error.response?.status,
    responseHeaders: error.response ? toPlainHeaders(error.response.headers) : undefined,
    responseBody: error.response?.data ?? null,
    errorMessage: error.message,
  })
}
