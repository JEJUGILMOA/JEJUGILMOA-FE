import type { NavigateFunction } from 'react-router'
import { nativeBridge } from '@/bridge/nativeBridge'
import { ROUTES } from '@/constants'

/**
 * 로그인 화면 열기.
 * - 네이티브: 탭과 분리된 스택 `/login` 화면
 * - 웹: 인앱 라우터로 `/login` 이동
 */
export function openLogin(
  navigate: NavigateFunction,
  options?: { returnTo?: string },
) {
  const returnTo =
    options?.returnTo ??
    (typeof window !== 'undefined'
      ? `${window.location.pathname}${window.location.search}`
      : ROUTES.home)

  if (nativeBridge.isNativeWebView()) {
    nativeBridge.postToNative({
      type: 'OPEN_NATIVE_LOGIN',
      returnTo,
    })
    return
  }

  navigate(`${ROUTES.login}?returnTo=${encodeURIComponent(returnTo)}`)
}
