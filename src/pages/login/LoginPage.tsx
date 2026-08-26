import { useEffect, useState, type ReactNode } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { toast } from '@/components/ui/Toast/Toast'
import { getErrorMessage } from '@/api/error'
import type { OAuthProvider } from '@/api/types'
import { startOAuthLogin } from '@/features/auth/oauth'
import { useAuthStore } from '@/stores/authStore'
import { ROUTES } from '@/constants'
import { GoogleIcon, KakaoIcon, NaverIcon } from './components/SocialIcons'
import { SocialLoginButton } from './components/SocialLoginButton'
import {
  buttonsStyle,
  headerStyle,
  hintStyle,
  logoMarkStyle,
  pageStyle,
  subtitleStyle,
  titleStyle,
} from './LoginPage.css.ts'

const PROVIDERS: {
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
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const [loadingProvider, setLoadingProvider] = useState<OAuthProvider | null>(null)

  const returnTo = searchParams.get('returnTo') || ROUTES.home

  useEffect(() => {
    if (isAuthenticated) {
      navigate(returnTo, { replace: true })
    }
  }, [isAuthenticated, navigate, returnTo])

  const handleLogin = (provider: OAuthProvider) => {
    setLoadingProvider(provider)
    try {
      startOAuthLogin(provider, { returnTo })
    } catch (error) {
      setLoadingProvider(null)
      toast.error(getErrorMessage(error, '로그인을 시작할 수 없습니다.'))
    }
  }

  return (
    <div className={pageStyle}>
      <header className={headerStyle}>
        <div className={logoMarkStyle} aria-hidden>
          길
        </div>
        <h1 className={titleStyle}>제주 길모아</h1>
        <p className={subtitleStyle}>우리의 모든 길이 모이는 곳</p>
      </header>

      <div className={buttonsStyle}>
        {PROVIDERS.map((provider) => (
          <SocialLoginButton
            key={provider.id}
            label={provider.label}
            backgroundColor={provider.backgroundColor}
            textColor={provider.textColor}
            borderColor={provider.borderColor}
            icon={provider.icon}
            loading={loadingProvider === provider.id}
            disabled={loadingProvider !== null}
            onClick={() => handleLogin(provider.id)}
          />
        ))}
      </div>

      <p className={hintStyle}>
        소셜 계정으로 시작하면 서비스 이용약관과
        <br />
        개인정보 처리방침에 동의하게 됩니다.
      </p>
    </div>
  )
}
