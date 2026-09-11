import { useEffect } from 'react'
import { appStore } from '@/stores/appStore'
import { nativeBridge } from '@/bridge/nativeBridge'

/** 앱 초기화: WebView 감지. WEB_READY는 브릿지 리스너 등록 후 보낸다. */
export function useAppBootstrap() {
  useEffect(() => {
    const isWebView = nativeBridge.isNativeWebView()
    appStore.getState().setIsWebView(isWebView)
    appStore.getState().setInitialized(true)
  }, [])
}
