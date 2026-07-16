import { useEffect } from 'react'
import { appStore } from '@/stores/appStore'
import { nativeBridge } from '@/bridge/nativeBridge'

/** 앱 초기화: WebView 감지 및 네이티브에 준비 완료 통지 */
export function useAppBootstrap() {
  useEffect(() => {
    const isWebView = nativeBridge.isNativeWebView()
    appStore.getState().setIsWebView(isWebView)
    nativeBridge.notifyWebReady()
    appStore.getState().setInitialized(true)
  }, [])
}
