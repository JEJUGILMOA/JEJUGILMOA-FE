export type GeoCoords = {
  latitude: number
  longitude: number
  accuracy?: number
}

/** 웹 → 네이티브 */
export type WebToNativeMessage =
  | { type: 'WEB_READY' }
  | { type: 'REQUEST_LOCATION' }
  | { type: 'REQUEST_BACK_HANDLER'; enabled: boolean }
  | { type: 'OPEN_EXTERNAL_URL'; url: string }
  | { type: 'HAPTIC'; style?: 'light' | 'medium' | 'heavy' }
  | { type: 'CLOSE_WEBVIEW' }
  | {
      type: 'SET_HEADER'
      title?: string
      showBack?: boolean
      visible?: boolean
      rightText?: string
      actions?: {
        id: string
        label: string
        tone?: 'default' | 'muted' | 'primary'
        icon?: 'more' | 'bookmark'
      }[]
    }

/** 네이티브 → 웹 */
export type NativeToWebMessage =
  | { type: 'NATIVE_READY'; platform: 'ios' | 'android' }
  | { type: 'LOCATION_UPDATE'; location: GeoCoords }
  | { type: 'LOCATION_ERROR'; message: string }
  | { type: 'AUTH_TOKEN'; accessToken: string }
  | { type: 'ANDROID_BACK' }
  | { type: 'HEADER_BACK' }
  | { type: 'HEADER_ACTION'; id: string }
  | { type: 'KEYBOARD_VISIBLE'; visible: boolean; height?: number }

declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void
    }
    __GILMOA_BRIDGE_MOCK__?: boolean
    /** 브라우저에서 네이티브 셸처럼 웹 하단 탭바 숨김 */
    __GILMOA_HIDE_WEB_NAV__?: boolean
  }
}

export {}
