import { nativeBridge } from '@/bridge/nativeBridge'

export type NativeTab = 'home' | 'map' | 'plan' | 'record' | 'my'

/** 네이티브면 해당 탭으로 전환(+ path 딥링크). 웹이면 false — 호출측에서 navigate */
export function openTabOnNative(tab: NativeTab, path?: string): boolean {
  if (!nativeBridge.isNativeWebView()) return false
  nativeBridge.postToNative({
    type: 'NAVIGATE_TO_TAB',
    tab,
    path,
  })
  return true
}
