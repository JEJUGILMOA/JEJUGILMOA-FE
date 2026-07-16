import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { nativeToWebMessageSchema } from './messageSchema'
import { nativeBridge } from './nativeBridge'
import { appStore } from '@/stores/appStore'
import { authStore } from '@/stores/authStore'

function parseIncomingMessage(data: unknown) {
  if (typeof data !== 'string') return null
  try {
    return nativeToWebMessageSchema.safeParse(JSON.parse(data))
  } catch {
    return null
  }
}

function handleNativeMessage(data: unknown) {
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
        user: authStore.getState().user ?? {
          id: 'native-user',
          nickname: '길모아 사용자',
        },
      })
      break
    case 'ANDROID_BACK':
      window.dispatchEvent(new CustomEvent('gilmoa:android-back'))
      break
    case 'KEYBOARD_VISIBLE':
      document.documentElement.style.setProperty(
        '--keyboard-inset',
        message.visible ? `${message.height ?? 0}px` : '0px',
      )
      break
  }
}

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

    return () => {
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

    window.addEventListener('gilmoa:android-back', onAndroidBack)
    nativeBridge.requestAndroidBackHandler(true)

    return () => {
      window.removeEventListener('gilmoa:android-back', onAndroidBack)
      nativeBridge.requestAndroidBackHandler(false)
    }
  }, [navigate])
}
