import { nativeBridge } from '@/bridge/nativeBridge'

export type RefreshableTab = 'plan' | 'map' | 'home' | 'record' | 'my'

/** 네이티브면 해당 탭 WebView/지도 상태를 갱신. 웹 단독이면 no-op */
export function refreshTabsOnNative(tabs: RefreshableTab[]): void {
  if (!nativeBridge.isNativeWebView() || tabs.length === 0) return
  nativeBridge.postToNative({ type: 'REFRESH_TABS', tabs })
}
