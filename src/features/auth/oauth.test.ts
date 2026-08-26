import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import {
  buildOAuthAuthorizeUrl,
  clearOAuthPendingSession,
  getOAuthRedirectUri,
  isOAuthProvider,
  readOAuthPendingSession,
} from './oauth'

describe('oauth helpers', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.stubEnv('VITE_KAKAO_REST_API_KEY', 'kakao-rest-key')
    vi.stubEnv('VITE_NAVER_CLIENT_ID', 'naver-client-id')
    vi.stubEnv('VITE_GOOGLE_WEB_CLIENT_ID', 'google-client-id.apps.googleusercontent.com')
  })

  afterEach(() => {
    clearOAuthPendingSession()
    vi.unstubAllEnvs()
  })

  it('recognizes providers', () => {
    expect(isOAuthProvider('kakao')).toBe(true)
    expect(isOAuthProvider('apple')).toBe(false)
  })

  it('builds kakao authorize url and stores session', () => {
    const url = buildOAuthAuthorizeUrl('kakao', { returnTo: '/my' })
    const parsed = new URL(url)

    expect(parsed.origin + parsed.pathname).toBe('https://kauth.kakao.com/oauth/authorize')
    expect(parsed.searchParams.get('client_id')).toBe('kakao-rest-key')
    expect(parsed.searchParams.get('redirect_uri')).toBe(getOAuthRedirectUri('kakao'))
    expect(parsed.searchParams.get('response_type')).toBe('code')

    const pending = readOAuthPendingSession()
    expect(pending?.provider).toBe('kakao')
    expect(pending?.returnTo).toBe('/my')
    expect(pending?.state).toBe(parsed.searchParams.get('state'))
  })

  it('builds naver and google urls', () => {
    const naver = new URL(buildOAuthAuthorizeUrl('naver'))
    expect(naver.origin + naver.pathname).toBe('https://nid.naver.com/oauth2.0/authorize')

    clearOAuthPendingSession()
    const google = new URL(buildOAuthAuthorizeUrl('google'))
    expect(google.origin + google.pathname).toBe(
      'https://accounts.google.com/o/oauth2/v2/auth',
    )
    expect(google.searchParams.get('scope')).toContain('email')
  })
})
