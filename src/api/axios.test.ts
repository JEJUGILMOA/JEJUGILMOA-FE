import { describe, expect, it } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/mocks/server'
import { authStore } from '@/stores/authStore'
import { apiClient } from './axios'

function envelope<T>(result: T) {
  return { isSuccess: true, code: 'COMMON200', message: 'OK', result }
}

function authError(code: string, message: string) {
  return { isSuccess: false, code, message }
}

describe('apiClient 401 → reissue 재시도', () => {
  it('401 이후 reissue가 성공하면 원래 요청을 재시도해서 성공한다', async () => {
    authStore.getState().clearAuth()
    let meCalls = 0
    let reissueCalls = 0

    server.use(
      http.get('*/users/me', () => {
        meCalls += 1
        if (meCalls === 1) {
          return HttpResponse.json(authError('AUTH401_1', '토큰 만료'), { status: 401 })
        }
        return HttpResponse.json(envelope({ nickname: '김여행' }))
      }),
      http.post('*/auth/reissue', () => {
        reissueCalls += 1
        return HttpResponse.json(envelope(null))
      }),
    )

    const { data } = await apiClient.get('/users/me')

    expect(data.result.nickname).toBe('김여행')
    expect(meCalls).toBe(2)
    expect(reissueCalls).toBe(1)
  })

  it('동시에 여러 요청이 401을 받아도 reissue는 한 번만 호출된다', async () => {
    authStore.getState().clearAuth()
    let meCalls = 0
    let reissueCalls = 0

    server.use(
      http.get('*/users/me', () => {
        meCalls += 1
        if (meCalls <= 2) {
          return HttpResponse.json(authError('AUTH401_1', '토큰 만료'), { status: 401 })
        }
        return HttpResponse.json(envelope({ nickname: '김여행' }))
      }),
      http.post('*/auth/reissue', () => {
        reissueCalls += 1
        return HttpResponse.json(envelope(null))
      }),
    )

    const [first, second] = await Promise.all([
      apiClient.get('/users/me'),
      apiClient.get('/users/me'),
    ])

    expect(first.data.result.nickname).toBe('김여행')
    expect(second.data.result.nickname).toBe('김여행')
    expect(reissueCalls).toBe(1)
  })

  it('reissue도 401이면 로그아웃 처리하고 에러를 던진다', async () => {
    authStore.getState().setAuth({ user: { id: '1', nickname: 'test' } })

    server.use(
      http.get('*/users/me', () =>
        HttpResponse.json(authError('AUTH401_1', '토큰 만료'), { status: 401 }),
      ),
      http.post('*/auth/reissue', () =>
        HttpResponse.json(
          authError('AUTH401_4', '이미 사용되었거나 탈취 의심되는 리프레시 토큰입니다.'),
          { status: 401 },
        ),
      ),
    )

    await expect(apiClient.get('/users/me')).rejects.toThrow()
    expect(authStore.getState().isAuthenticated).toBe(false)
  })
})
