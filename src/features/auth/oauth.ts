import type { OAuthProvider } from '@/api/types'

const OAUTH_STATE_KEY = 'gilmoa_oauth_state'
const OAUTH_PROVIDER_KEY = 'gilmoa_oauth_provider'
const OAUTH_REDIRECT_URI_KEY = 'gilmoa_oauth_redirect_uri'
const OAUTH_RETURN_TO_KEY = 'gilmoa_oauth_return_to'

const PROVIDERS: OAuthProvider[] = ['kakao', 'google', 'naver']

/** WebView·외부 브라우저 왕복에서도 남도록 sessionStorage 대신 localStorage 사용 */
const oauthStorage = {
  get(key: string) {
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  },
  set(key: string, value: string) {
    try {
      localStorage.setItem(key, value)
    } catch {
      // private mode 등
    }
  },
  remove(key: string) {
    try {
      localStorage.removeItem(key)
    } catch {
      // ignore
    }
  },
}

export function isOAuthProvider(value: string): value is OAuthProvider {
  return PROVIDERS.includes(value as OAuthProvider)
}

export function getOAuthRedirectUri(provider: OAuthProvider) {
  return `${window.location.origin}/oauth/${provider}/callback`
}

function createState() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function getOAuthClientId(provider: OAuthProvider): string | undefined {
  const env = import.meta.env
  if (provider === 'kakao') return env.VITE_KAKAO_REST_API_KEY || undefined
  if (provider === 'naver') return env.VITE_NAVER_CLIENT_ID || undefined
  return env.VITE_GOOGLE_WEB_CLIENT_ID || undefined
}

export function buildOAuthAuthorizeUrl(provider: OAuthProvider, options?: { returnTo?: string }) {
  const clientId = getOAuthClientId(provider)
  if (!clientId) {
    throw new Error(
      `${provider} Client ID가 없습니다. .env의 VITE_* 값을 설정해 주세요.`,
    )
  }

  const redirectUri = getOAuthRedirectUri(provider)
  const state = createState()

  oauthStorage.set(OAUTH_STATE_KEY, state)
  oauthStorage.set(OAUTH_PROVIDER_KEY, provider)
  oauthStorage.set(OAUTH_REDIRECT_URI_KEY, redirectUri)
  oauthStorage.set(OAUTH_RETURN_TO_KEY, options?.returnTo || '/')

  const params = new URLSearchParams()

  if (provider === 'kakao') {
    params.set('client_id', clientId)
    params.set('redirect_uri', redirectUri)
    params.set('response_type', 'code')
    params.set('state', state)
    return `https://kauth.kakao.com/oauth/authorize?${params.toString()}`
  }

  if (provider === 'naver') {
    params.set('response_type', 'code')
    params.set('client_id', clientId)
    params.set('redirect_uri', redirectUri)
    params.set('state', state)
    return `https://nid.naver.com/oauth2.0/authorize?${params.toString()}`
  }

  params.set('client_id', clientId)
  params.set('redirect_uri', redirectUri)
  params.set('response_type', 'code')
  params.set('scope', 'openid email profile')
  params.set('state', state)
  params.set('access_type', 'online')
  params.set('include_granted_scopes', 'true')
  params.set('prompt', 'select_account')
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
}

export function startOAuthLogin(provider: OAuthProvider, options?: { returnTo?: string }) {
  const url = buildOAuthAuthorizeUrl(provider, options)
  window.location.assign(url)
}

export type OAuthPendingSession = {
  provider: OAuthProvider
  state: string
  redirectUri: string
  returnTo: string
}

export function readOAuthPendingSession(): OAuthPendingSession | null {
  const providerRaw = oauthStorage.get(OAUTH_PROVIDER_KEY)
  const state = oauthStorage.get(OAUTH_STATE_KEY)
  const redirectUri = oauthStorage.get(OAUTH_REDIRECT_URI_KEY)
  const returnTo = oauthStorage.get(OAUTH_RETURN_TO_KEY) || '/'

  if (!providerRaw || !isOAuthProvider(providerRaw) || !state || !redirectUri) {
    return null
  }

  return { provider: providerRaw, state, redirectUri, returnTo }
}

export function clearOAuthPendingSession() {
  oauthStorage.remove(OAUTH_STATE_KEY)
  oauthStorage.remove(OAUTH_PROVIDER_KEY)
  oauthStorage.remove(OAUTH_REDIRECT_URI_KEY)
  oauthStorage.remove(OAUTH_RETURN_TO_KEY)
}
