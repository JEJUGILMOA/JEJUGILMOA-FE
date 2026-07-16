import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { ApiError } from './error'
import { authStore } from '@/stores/authStore'

const baseURL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export const apiClient = axios.create({
  baseURL,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = authStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; code?: string }>) => {
    if (error.response) {
      const { status, data } = error.response
      if (status === 401) {
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
