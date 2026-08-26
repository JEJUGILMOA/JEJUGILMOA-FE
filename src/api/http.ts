import type { AxiosRequestConfig } from 'axios'
import { apiClient } from './axios'
import type { ApiEnvelope } from './types'
import { unwrapApiResult } from './unwrap'

type EnvelopeOrRaw<T> = ApiEnvelope<T> | T

async function unwrapResponse<T>(data: EnvelopeOrRaw<T>): Promise<T> {
  return unwrapApiResult<T>(data)
}

/** GET — 응답 envelope의 `result`를 반환 */
export async function apiGet<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const { data } = await apiClient.get<EnvelopeOrRaw<T>>(url, config)
  return unwrapResponse<T>(data)
}

/** POST */
export async function apiPost<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const { data } = await apiClient.post<EnvelopeOrRaw<T>>(url, body, config)
  return unwrapResponse<T>(data)
}

/** PUT */
export async function apiPut<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const { data } = await apiClient.put<EnvelopeOrRaw<T>>(url, body, config)
  return unwrapResponse<T>(data)
}

/** PATCH */
export async function apiPatch<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const { data } = await apiClient.patch<EnvelopeOrRaw<T>>(url, body, config)
  return unwrapResponse<T>(data)
}

/** DELETE */
export async function apiDelete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const { data } = await apiClient.delete<EnvelopeOrRaw<T>>(url, config)
  return unwrapResponse<T>(data)
}
