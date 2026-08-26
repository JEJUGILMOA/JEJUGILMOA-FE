import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router'
import { getErrorMessage } from '@/api/error'
import { loginWithOAuth } from '@/features/auth/api'
import {
  clearOAuthPendingSession,
  isOAuthProvider,
  readOAuthPendingSession,
} from '@/features/auth/oauth'
import { applyOAuthLoginResult } from '@/features/auth/session'
import { ROUTES } from '@/constants'
import { Button } from '@/components/ui/Button/Button'
import {
  statusMessageStyle,
  statusPageStyle,
  statusTitleStyle,
} from './LoginPage.css.ts'

/** 같은 인가 코드로 교환 API를 두 번 치지 않기 위한 (Strict Mode 포함) */
const exchangedKeys = new Set<string>()

export function OAuthCallbackPage() {
  const navigate = useNavigate()
  const { provider: providerParam = '' } = useParams()
  const [searchParams] = useSearchParams()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const oauthError = searchParams.get('error')
    const oauthErrorDescription = searchParams.get('error_description')
    if (oauthError) {
      setErrorMessage(oauthErrorDescription || oauthError)
      clearOAuthPendingSession()
      return
    }

    if (!isOAuthProvider(providerParam)) {
      setErrorMessage('지원하지 않는 로그인 방식입니다.')
      return
    }

    const code = searchParams.get('code')
    const state = searchParams.get('state')
    if (!code) {
      setErrorMessage('인가 코드가 없습니다. 다시 로그인해 주세요.')
      clearOAuthPendingSession()
      return
    }

    const exchangeKey = `${providerParam}:${code}`
    if (exchangedKeys.has(exchangeKey)) return
    exchangedKeys.add(exchangeKey)

    const pending = readOAuthPendingSession()
    if (!pending || pending.provider !== providerParam || pending.state !== state) {
      exchangedKeys.delete(exchangeKey)
      setErrorMessage('로그인 검증에 실패했습니다. 다시 시도해 주세요.')
      clearOAuthPendingSession()
      return
    }

    const returnTo = pending.returnTo || ROUTES.home
    const redirectUri = pending.redirectUri

    void (async () => {
      try {
        const result = await loginWithOAuth(providerParam, {
          authorizationCode: code,
          redirectUri,
          state: state ?? undefined,
        })
        applyOAuthLoginResult(result)
        clearOAuthPendingSession()
        // replace로 히스토리에서 콜백을 빼서 뒤로가기 시 code 재사용을 막는다.
        navigate(returnTo, { replace: true })
      } catch (error) {
        exchangedKeys.delete(exchangeKey)
        clearOAuthPendingSession()
        setErrorMessage(getErrorMessage(error, '로그인에 실패했습니다.'))
      }
    })()
  }, [navigate, providerParam, searchParams])

  if (errorMessage) {
    return (
      <div className={statusPageStyle}>
        <h1 className={statusTitleStyle}>로그인 실패</h1>
        <p className={statusMessageStyle}>{errorMessage}</p>
        <Button variant="primary" onClick={() => navigate(ROUTES.login, { replace: true })}>
          다시 로그인
        </Button>
        <Link to={ROUTES.home}>홈으로</Link>
      </div>
    )
  }

  return (
    <div className={statusPageStyle}>
      <h1 className={statusTitleStyle}>로그인 중</h1>
      <p className={statusMessageStyle}>잠시만 기다려 주세요…</p>
    </div>
  )
}
