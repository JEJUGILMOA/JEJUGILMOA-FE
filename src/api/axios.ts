import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { ApiError } from './error'
import { isApiEnvelope } from './unwrap'
import { authStore } from '@/stores/authStore'

const baseURL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export const apiClient = axios.create({
  baseURL,
  timeout: 15_000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = authStore.getState().accessToken
  // 쿠키 세션이 본체. Bearer는 개발용/명시 토큰이 있을 때만.
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

type ErrorBody = {
  isSuccess?: boolean
  message?: string
  code?: string
  result?: unknown
}

apiClient.interceptors.response.use(
  (response) => {
    const payload = response.data
    if (isApiEnvelope(payload) && payload.isSuccess === false) {
      throw new ApiError(
        payload.message || '요청에 실패했습니다.',
        response.status,
        payload.code || 'API_ERROR',
        payload,
      )
    }
    return response
  },
  (error: AxiosError<ErrorBody>) => {
    if (error.response) {
      const { status, data, config } = error.response
      const url = `${config?.baseURL ?? ''}${config?.url ?? ''}`
      const isAuthCall = /\/auth\/oauth\/|\/auth\/reissue|\/auth\/logout|\/dev\/auth\//.test(url)

      if (status === 401 && !isAuthCall) {
        authStore.getState().clearAuth()
      }

      throw new ApiError(
        data?.message ?? error.message,
        status,
        data?.code ?? 'HTTP_ERROR',
        data,
      )
    }

    if (error.request) {
      throw new ApiError('네트워크 연결을 확인해 주세요.', 0, 'NETWORK_ERROR')
    }

    throw new ApiError(error.message || '알 수 없는 오류가 발생했습니다.', 0, 'UNKNOWN')
  },
)
