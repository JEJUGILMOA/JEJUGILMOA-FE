import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { nativeToWebMessageSchema } from './messageSchema'
import { nativeBridge } from './nativeBridge'
import { appStore } from '@/stores/appStore'
import { authStore } from '@/stores/authStore'

/** 네이티브 sendToWeb이 window+document에 같은 메시지를 모두 쏴서 생기는 중복 처리 방지 */
const RECENT_MESSAGE_TTL_MS = 800
const recentMessageAt = new Map<string, number>()

function shouldHandleIncomingMessage(data: unknown): boolean {
  if (typeof data !== 'string') return false
  const now = Date.now()
  const prev = recentMessageAt.get(data)
  if (prev != null && now - prev < RECENT_MESSAGE_TTL_MS) return false
  recentMessageAt.set(data, now)

  if (recentMessageAt.size > 50) {
    for (const [key, at] of recentMessageAt) {
      if (now - at >= RECENT_MESSAGE_TTL_MS) recentMessageAt.delete(key)
    }
  }
  return true
}

function parseIncomingMessage(data: unknown) {
  if (typeof data !== 'string') return null
  try {
    return nativeToWebMessageSchema.safeParse(JSON.parse(data))
  } catch {
    return null
  }
}

function handleNativeMessage(data: unknown) {
  if (!shouldHandleIncomingMessage(data)) return

  const result = parseIncomingMessage(data)
  if (!result?.success) return

  const message = result.data

  switch (message.type) {
    case 'NATIVE_READY':
      appStore.getState().setIsWebView(true)
      break
    case 'LOCATION_UPDATE':
      appStore.getState().setNativeLocation(message.location)
      break
    case 'LOCATION_ERROR':
      console.warn('[bridge] location error', message.message)
      break
    case 'AUTH_TOKEN':
      authStore.getState().setAuth({
        accessToken: message.accessToken,
        user:
          message.user ??
          authStore.getState().user ?? {
            id: 'native-user',
            nickname: '길모아 사용자',
          },
      })
      break
    case 'AUTH_SESSION':
      authStore.getState().setAuth({
        user: message.user,
      })
      break
    case 'AUTH_GUEST':
      authStore.getState().clearAuth()
      break
    case 'ANDROID_BACK':
    case 'HEADER_BACK': {
      const headerBack = new CustomEvent('gilmoa:header-back', { cancelable: true })
      window.dispatchEvent(headerBack)
      if (!headerBack.defaultPrevented) {
        window.dispatchEvent(new CustomEvent('gilmoa:android-back'))
      }
      break
    }
    case 'HEADER_ACTION':
      window.dispatchEvent(new CustomEvent('gilmoa:header-action', { detail: { id: message.id } }))
      break
    case 'MAP_ASSIGN_PLACE':
      window.dispatchEvent(new CustomEvent('gilmoa:map-assign', { detail: { id: message.id } }))
      break
    case 'MAP_TAPPED':
      window.dispatchEvent(new CustomEvent('gilmoa:map-tap'))
      break
    case 'MAP_REGION_CHANGED':
      window.dispatchEvent(
        new CustomEvent('gilmoa:map-region', {
          detail: {
            minLat: message.minLat,
            maxLat: message.maxLat,
            minLng: message.minLng,
            maxLng: message.maxLng,
          },
        }),
      )
      break
    case 'REQUEST_PLAN_SUMMARIES':
      window.dispatchEvent(new CustomEvent('gilmoa:request-plan-summaries'))
      break
    case 'REQUEST_PLAN_DETAIL':
      window.dispatchEvent(
        new CustomEvent('gilmoa:request-plan-detail', {
          detail: { planId: message.planId },
        }),
      )
      break
    case 'REQUEST_CURRENT_TRIP':
      window.dispatchEvent(new CustomEvent('gilmoa:request-current-trip'))
      break
    case 'REQUEST_MAP_SEARCH':
      window.dispatchEvent(
        new CustomEvent('gilmoa:request-map-search', {
          detail: {
            minLat: message.minLat,
            maxLat: message.maxLat,
            minLng: message.minLng,
            maxLng: message.maxLng,
            category: message.category,
          },
        }),
      )
      break
    case 'REQUEST_TRIP_VISIT':
      window.dispatchEvent(
        new CustomEvent('gilmoa:request-trip-visit', {
          detail: {
            tripId: message.tripId,
            waypointId: message.waypointId,
            latitude: message.latitude,
            longitude: message.longitude,
          },
        }),
      )
      break
    case 'REQUEST_TRIP_COMPLETE':
      window.dispatchEvent(
        new CustomEvent('gilmoa:request-trip-complete', {
          detail: { tripId: message.tripId },
        }),
      )
      break
    case 'MODAL_ACTION':
      window.dispatchEvent(new CustomEvent('gilmoa:modal-action', { detail: { id: message.id } }))
      break
    case 'MODAL_DISMISS':
      window.dispatchEvent(new CustomEvent('gilmoa:modal-dismiss'))
      break
    case 'TOAST_ACTION':
      window.dispatchEvent(new CustomEvent('gilmoa:toast-action', { detail: { id: message.id } }))
      break
    case 'ITINERARY_DAY':
      window.dispatchEvent(new CustomEvent('gilmoa:itinerary-day', { detail: { day: message.day } }))
      break
    case 'ITINERARY_SEARCH':
      window.dispatchEvent(new CustomEvent('gilmoa:itinerary-search', { detail: { query: message.query } }))
      break
    case 'ITINERARY_NEXT':
      window.dispatchEvent(new CustomEvent('gilmoa:itinerary-next'))
      break
    case 'ITINERARY_DEPARTURE_CANCEL':
      window.dispatchEvent(new CustomEvent('gilmoa:itinerary-departure-cancel'))
      break
    case 'NATIVE_LAYOUT':
      window.__GILMOA_SCREEN_HEIGHT__ = message.screenHeight
      window.dispatchEvent(
        new CustomEvent('gilmoa:screen-height', { detail: { height: message.screenHeight } }),
      )
      break
    case 'KEYBOARD_VISIBLE':
      document.documentElement.style.setProperty(
        '--keyboard-inset',
        message.visible ? `${message.height ?? 0}px` : '0px',
      )
      break
    case 'TAB_POP_TO_ROOT':
      window.dispatchEvent(
        new CustomEvent('gilmoa:tab-pop-to-root', { detail: { path: message.path } }),
      )
      break
    case 'APPLE_CREDENTIAL':
      window.dispatchEvent(
        new CustomEvent('gilmoa:apple-credential', {
          detail: {
            identityToken: message.identityToken,
            rawNonce: message.rawNonce,
            authorizationCode: message.authorizationCode,
            email: message.email,
            fullName: message.fullName,
          },
        }),
      )
      break
    case 'APPLE_LOGIN_CANCELLED':
      window.dispatchEvent(new CustomEvent('gilmoa:apple-login-cancelled'))
      break
    case 'APPLE_LOGIN_ERROR':
      window.dispatchEvent(
        new CustomEvent('gilmoa:apple-login-error', { detail: { message: message.message } }),
      )
      break
  }
}

const TAB_ROOT_PATHS = new Set(['/', '/plan', '/record', '/my', '/map'])

/**
 * 네이티브 → 웹 메시지 수신 등록/해제 및 Android 뒤로가기 기본 처리
 */
export function useNativeMessage() {
  const navigate = useNavigate()

  useEffect(() => {
    const onWindowMessage = (event: MessageEvent) => {
      handleNativeMessage(event.data)
    }

    const onDocumentMessage = (event: Event) => {
      const custom = event as MessageEvent
      handleNativeMessage(custom.data)
    }

    window.addEventListener('message', onWindowMessage)
    document.addEventListener('message', onDocumentMessage as EventListener)

    const unsubscribeMock = nativeBridge.subscribeMockBridge(handleNativeMessage)

    // 리스너 등록 후에야 WEB_READY — 네이티브가 AUTH_TOKEN을 이때 주입할 수 있게
    nativeBridge.notifyWebReady()

    // 구버전 앱이 AUTH_GUEST를 안 보내도 스켈레톤에 멈추지 않게
    const resolveFallback = window.setTimeout(() => {
      if (!authStore.getState().isAuthResolved) {
        authStore.getState().markAuthResolved()
      }
    }, 1500)

    return () => {
      window.clearTimeout(resolveFallback)
      window.removeEventListener('message', onWindowMessage)
      document.removeEventListener('message', onDocumentMessage as EventListener)
      unsubscribeMock()
    }
  }, [])

  useEffect(() => {
    const onAndroidBack = () => {
      if (window.history.length > 1) {
        navigate(-1)
        return
      }
      nativeBridge.postToNative({ type: 'CLOSE_WEBVIEW' })
    }

    const onTabPopToRoot = (event: Event) => {
      const path = (event as CustomEvent<{ path?: string }>).detail?.path
      if (typeof path !== 'string' || !TAB_ROOT_PATHS.has(path)) return
      navigate(path, { replace: true })
    }

    window.addEventListener('gilmoa:android-back', onAndroidBack)
    window.addEventListener('gilmoa:tab-pop-to-root', onTabPopToRoot)
    nativeBridge.requestAndroidBackHandler(true)

    return () => {
      window.removeEventListener('gilmoa:android-back', onAndroidBack)
      window.removeEventListener('gilmoa:tab-pop-to-root', onTabPopToRoot)
      nativeBridge.requestAndroidBackHandler(false)
    }
  }, [navigate])
}
