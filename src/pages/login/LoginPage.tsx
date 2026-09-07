import { useEffect, useState, type ReactNode } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { toast } from '@/components/ui/Toast/Toast'
import { getErrorMessage } from '@/api/error'
import type { OAuthProvider } from '@/api/types'
import { loginWithApple, loginWithOAuth } from '@/features/auth/api'
import { startOAuthLogin } from '@/features/auth/oauth'
import { applyOAuthLoginResult } from '@/features/auth/session'
import { nativeBridge } from '@/bridge/nativeBridge'
import { authStore } from '@/stores/authStore'
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

type LoginProvider = OAuthProvider | 'apple' | 'temp'

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

  /** 실 OAuth 없이 네이티브 탭(WebView)으로 진입 — 개발/미리보기용 */
  const handleTempLogin = () => {
    setLoadingProvider('temp')
    authStore.getState().setAuth({
      user: { id: 'temp', nickname: '임시 사용자' },
      accessToken: 'temp-token',
    })
    if (inNative) {
      nativeBridge.postToNative({
        type: 'LOGIN_SUCCESS',
        provider: 'temp',
        returnTo,
      })
      return
    }
    navigate(returnTo, { replace: true })
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
        <SocialLoginButton
          label="임시 로그인 (앱 미리보기)"
          backgroundColor="#F3F4F6"
          textColor="#374151"
          borderColor="#E5E7EB"
          icon={<span aria-hidden>→</span>}
          loading={loadingProvider === 'temp'}
          disabled={loadingProvider !== null}
          onClick={handleTempLogin}
        />
      </div>

      <p className={hintStyle}>
        소셜 계정으로 시작하면 서비스 이용약관과
        <br />
        개인정보 처리방침에 동의하게 됩니다.
      </p>
    </div>
  )
}
