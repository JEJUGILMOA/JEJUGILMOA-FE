import { useEffect, useState, type ReactNode } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { toast } from '@/components/ui/Toast/Toast'
import { getErrorMessage } from '@/api/error'
import type { OAuthProvider } from '@/api/types'
import { loginWithApple, loginWithDevAuth } from '@/features/auth/api'
import { startOAuthLogin } from '@/features/auth/oauth'
import { applyDevLoginResult, applyOAuthLoginResult, toBridgeAuthUser } from '@/features/auth/session'
import { nativeBridge } from '@/bridge/nativeBridge'
import { ROUTES } from '@/constants'
import appIcon from '@/assets/images/appicon.png'
import { AppleIcon, GoogleIcon, KakaoIcon, NaverIcon } from './components/SocialIcons'
import { SocialLoginButton } from './components/SocialLoginButton'
import {
  buttonsStyle,
  headerStyle,
  hintStyle,
  logoMarkStyle,
  logoImageStyle,
  pageStyle,
  subtitleStyle,
  titleStyle,
} from './LoginPage.css.ts'

type LoginProvider = OAuthProvider | 'apple' | 'dev'

/** 같은 Apple identityToken으로 /auth/apple/login 을 두 번 치지 않기 위한 */
const exchangedAppleTokens = new Set<string>()

const WEB_PROVIDERS: {
  id: OAuthProvider
  label: string
  backgroundColor: string
  textColor: string
  borderColor?: string
  icon: ReactNode
}[] = [
  {
    id: 'kakao',
    label: '카카오로 시작하기',
    backgroundColor: '#FEE500',
    textColor: '#191919',
    icon: <KakaoIcon />,
  },
  {
    id: 'naver',
    label: '네이버로 시작하기',
    backgroundColor: '#03C75A',
    textColor: '#FFFFFF',
    icon: <NaverIcon />,
  },
  {
    id: 'google',
    label: 'Google로 시작하기',
    backgroundColor: '#FFFFFF',
    textColor: '#111827',
    borderColor: '#E5E7EB',
    icon: <GoogleIcon />,
  },
]

export function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [loadingProvider, setLoadingProvider] = useState<LoginProvider | null>(null)

  const returnTo = searchParams.get('returnTo') || ROUTES.home
  const inNative = nativeBridge.isNativeWebView()
  /** production 빌드에서는 숨김 — 로컬 `pnpm dev`에서만 노출 */
  const showDevLogin = import.meta.env.DEV

  useEffect(() => {
    const onCredential = (event: Event) => {
      const detail = (event as CustomEvent<{
        identityToken: string
        rawNonce: string
      }>).detail

      if (!detail?.identityToken) return
      if (exchangedAppleTokens.has(detail.identityToken)) return
      exchangedAppleTokens.add(detail.identityToken)

      void (async () => {
        try {
          const result = await loginWithApple({
            identityToken: detail.identityToken,
            rawNonce: detail.rawNonce,
          })
          applyOAuthLoginResult(result)
          if (nativeBridge.isNativeWebView()) {
            nativeBridge.postToNative({
              type: 'LOGIN_SUCCESS',
              provider: 'apple',
              returnTo,
              user: toBridgeAuthUser(result),
            })
          } else {
            navigate(returnTo, { replace: true })
          }
        } catch (error) {
          exchangedAppleTokens.delete(detail.identityToken)
          setLoadingProvider(null)
          toast.error(getErrorMessage(error, 'Apple 로그인에 실패했습니다.'))
        }
      })()
    }

    const onCancelled = () => {
      setLoadingProvider(null)
    }

    const onError = (event: Event) => {
      setLoadingProvider(null)
      const message = (event as CustomEvent<{ message?: string }>).detail?.message
      toast.error(message || 'Apple 로그인에 실패했습니다.')
    }

    window.addEventListener('gilmoa:apple-credential', onCredential)
    window.addEventListener('gilmoa:apple-login-cancelled', onCancelled)
    window.addEventListener('gilmoa:apple-login-error', onError)
    return () => {
      window.removeEventListener('gilmoa:apple-credential', onCredential)
      window.removeEventListener('gilmoa:apple-login-cancelled', onCancelled)
      window.removeEventListener('gilmoa:apple-login-error', onError)
    }
  }, [navigate, returnTo])

  const handleWebLogin = (provider: OAuthProvider) => {
    setLoadingProvider(provider)
    try {
      startOAuthLogin(provider, { returnTo })
      if (nativeBridge.isNativeWebView()) {
        setLoadingProvider(null)
      }
    } catch (error) {
      setLoadingProvider(null)
      toast.error(getErrorMessage(error, '로그인을 시작할 수 없습니다.'))
    }
  }

  const handleAppleLogin = () => {
    if (!inNative) {
      toast.error('Apple 로그인은 iOS 앱에서만 사용할 수 있습니다.')
      return
    }
    setLoadingProvider('apple')
    nativeBridge.postToNative({ type: 'REQUEST_APPLE_LOGIN' })
  }

  /** 개발용 이메일 로그인 — body accessToken을 네이티브가 각 탭 WebView에 주입 */
  const handleDevLogin = async () => {
    setLoadingProvider('dev')
    try {
      const result = await loginWithDevAuth('user@example.com')
      applyDevLoginResult(result)
      if (inNative) {
        nativeBridge.postToNative({
          type: 'LOGIN_SUCCESS',
          provider: 'temp',
          returnTo,
          accessToken: result.accessToken,
          user: {
            id: result.userId,
            nickname: result.nickname,
          },
        })
        return
      }
      toast.success(`${result.nickname}님, 개발 로그인되었어요.`)
      navigate(returnTo, { replace: true })
    } catch (error) {
      setLoadingProvider(null)
      toast.error(getErrorMessage(error, '개발 로그인에 실패했어요.'))
    }
  }

  return (
    <div className={pageStyle}>
      <header className={headerStyle}>
        <div className={logoMarkStyle} aria-hidden>
          <img src={appIcon} alt="" className={logoImageStyle} />
        </div>
        <h1 className={titleStyle}>제주 길모아</h1>
        <p className={subtitleStyle}>우리의 모든 길이 모이는 곳</p>
      </header>

      <div className={buttonsStyle}>
        {WEB_PROVIDERS.map((provider) => (
          <SocialLoginButton
            key={provider.id}
            label={provider.label}
            backgroundColor={provider.backgroundColor}
            textColor={provider.textColor}
            borderColor={provider.borderColor}
            icon={provider.icon}
            loading={loadingProvider === provider.id}
            disabled={loadingProvider !== null}
            onClick={() => handleWebLogin(provider.id)}
          />
        ))}
        {inNative ? (
          <SocialLoginButton
            label="Apple로 시작하기"
            backgroundColor="#000000"
            textColor="#FFFFFF"
            icon={<AppleIcon />}
            loading={loadingProvider === 'apple'}
            disabled={loadingProvider !== null}
            onClick={handleAppleLogin}
          />
        ) : null}
        {showDevLogin ? (
          <SocialLoginButton
            label="개발 로그인 (user@example.com)"
            backgroundColor="#F3F4F6"
            textColor="#374151"
            borderColor="#E5E7EB"
            icon={<span aria-hidden>→</span>}
            loading={loadingProvider === 'dev'}
            disabled={loadingProvider !== null}
            onClick={() => void handleDevLogin()}
          />
        ) : null}
      </div>

      <p className={hintStyle}>
        소셜 계정으로 시작하면 서비스 이용약관과
        <br />
        개인정보 처리방침에 동의하게 됩니다.
      </p>
    </div>
  )
}
