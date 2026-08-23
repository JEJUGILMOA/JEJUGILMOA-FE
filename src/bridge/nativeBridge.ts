import { webToNativeMessageSchema } from './messageSchema'
import type { WebToNativeMessage } from './types'

type BridgeListener = (raw: string) => void

const mockListeners = new Set<BridgeListener>()

function isNativeWebView() {
  return typeof window !== 'undefined' && Boolean(window.ReactNativeWebView)
}

/** 브라우저에서 앱 셸(네이티브 탭바)을 가정하고 웹 하단 네비를 숨김 */
function shouldHideWebBottomNav() {
  if (typeof window === 'undefined') return false
  if (isNativeWebView()) return true
  if (import.meta.env.VITE_HIDE_WEB_NAV === 'true') return true
  if (window.__GILMOA_HIDE_WEB_NAV__) return true
  const nativeQuery = new URLSearchParams(window.location.search).get('native')
  return nativeQuery === '1' || nativeQuery === 'true'
}

function shouldUseMockBridge() {
  if (typeof window === 'undefined') return false
  if (isNativeWebView()) return false
  return (
    import.meta.env.VITE_USE_MOCK_BRIDGE === 'true' ||
    import.meta.env.DEV ||
    Boolean(window.__GILMOA_BRIDGE_MOCK__)
  )
}

export function postToNative(message: WebToNativeMessage) {
  const parsed = webToNativeMessageSchema.safeParse(message)
  if (!parsed.success) {
    console.warn('[bridge] invalid web→native message', parsed.error)
    return
  }

  const payload = JSON.stringify(parsed.data)

  if (isNativeWebView() && window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(payload)
    return
  }

  if (shouldUseMockBridge()) {
    console.info('[mock-bridge] web→native', parsed.data)
    return
  }

  console.warn('[bridge] ReactNativeWebView is not available')
}

export function emitMockNativeMessage(message: unknown) {
  const payload = typeof message === 'string' ? message : JSON.stringify(message)
  mockListeners.forEach((listener) => listener(payload))
  window.dispatchEvent(new MessageEvent('message', { data: payload }))
}

/** 테스트/브라우저용 Mock Bridge 구독 */
export function subscribeMockBridge(listener: BridgeListener) {
  mockListeners.add(listener)
  return () => {
    mockListeners.delete(listener)
  }
}

export function requestAndroidBackHandler(enabled: boolean) {
  postToNative({ type: 'REQUEST_BACK_HANDLER', enabled })
}

export function requestNativeLocation() {
  postToNative({ type: 'REQUEST_LOCATION' })
}

export function notifyWebReady() {
  postToNative({ type: 'WEB_READY' })
}

export const nativeBridge = {
  postToNative,
  emitMockNativeMessage,
  subscribeMockBridge,
  requestAndroidBackHandler,
  requestNativeLocation,
  notifyWebReady,
  isNativeWebView,
  shouldHideWebBottomNav,
  shouldUseMockBridge,
}
