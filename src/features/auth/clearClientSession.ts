import { clearOAuthPendingSession } from '@/features/auth/oauth'

/** BE/레거시에서 쓸 법한 인증 쿠키 이름 후보 (HttpOnly면 JS로 안 지워질 수 있음) */
const AUTH_COOKIE_NAME_CANDIDATES = [
  'accessToken',
  'refreshToken',
  'access_token',
  'refresh_token',
  'ACCESS_TOKEN',
  'REFRESH_TOKEN',
  'token',
  'JSESSIONID',
] as const

const COOKIE_PATHS = ['/', '/api', '/api/', '/auth', '/api/auth', '/api/auth/'] as const

function expireCookie(name: string, path: string, domain?: string) {
  const domainPart = domain ? `; domain=${domain}` : ''
  document.cookie = `${encodeURIComponent(name)}=; Max-Age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}${domainPart}`
}

function collectCookieNames(): string[] {
  const names = new Set<string>(AUTH_COOKIE_NAME_CANDIDATES)
  try {
    for (const part of document.cookie.split(';')) {
      const name = part.split('=')[0]?.trim()
      if (name) names.add(name)
    }
  } catch {
    // private mode 등
  }
  return [...names]
}

function collectDomainCandidates(): Array<string | undefined> {
  const hostname = window.location.hostname
  const domains: Array<string | undefined> = [undefined, hostname]
  if (hostname && !hostname.startsWith('.')) {
    domains.push(`.${hostname}`)
  }
  const parts = hostname.split('.')
  if (parts.length >= 3) {
    domains.push(`.${parts.slice(-2).join('.')}`)
  }
  return domains
}

/**
 * 로그아웃 시 FE에서 할 수 있는 클라이언트 세션 정리.
 * - OAuth 진행용 localStorage
 * - document.cookie로 보이는(비 HttpOnly) 쿠키 + 알려진 인증 쿠키명 만료
 *
 * HttpOnly 쿠키는 JS로 지울 수 없고 `/auth/logout` Set-Cookie에 의존한다.
 */
export function clearClientAuthSession() {
  clearOAuthPendingSession()

  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return
  }

  const names = collectCookieNames()
  const domains = collectDomainCandidates()

  for (const name of names) {
    for (const path of COOKIE_PATHS) {
      for (const domain of domains) {
        try {
          expireCookie(name, path, domain)
        } catch {
          // ignore
        }
      }
    }
  }
}
