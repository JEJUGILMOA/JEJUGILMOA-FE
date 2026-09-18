import { nativeBridge } from '@/bridge/nativeBridge'

/** 네이티브면 브릿지, 웹이면 새 탭으로 외부 URL 열기 */
export function openExternalUrl(url: string) {
  if (nativeBridge.isNativeWebView()) {
    nativeBridge.postToNative({
      type: 'OPEN_EXTERNAL_URL',
      url,
    })
    return
  }
  window.open(url, '_blank', 'noopener,noreferrer')
}
