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
  | {
      type: 'SET_MAP'
      visible: boolean
      departure?: { id: string; title: string; latitude: number; longitude: number } | null
      stops?: {
        id: string
        title: string
        latitude: number
        longitude: number
        order: number
        mustVisit?: boolean
      }[]
      unassigned?: { id: string; title: string; latitude: number; longitude: number }[]
      /** 탐색 지도 탭 — API 장소 마커 */
      places?: {
        id: string
        title: string
        latitude: number
        longitude: number
        categoryName?: string
        imageUrl?: string
      }[]
      /** 탐색 지도 탭 — 혼잡도 히트맵 */
      heatmap?: {
        latitude: number
        longitude: number
        level: 'CROWDED' | 'MODERATE'
        intensity: number
      }[]
      overlayTop?: number
      sheetHeight?: number
      cameraFitKey?: string
      /** true면 모달 등 웹 오버레이를 위해 지도를 웹뷰 아래로 내린다 */
      webOnTop?: boolean
    }
  | { type: 'MAP_ZOOM'; delta: number }
  | { type: 'REQUEST_MAP_REGION' }
  | {
      type: 'SET_MODAL'
      visible: boolean
      id?: string
      title?: string
      description?: string
      actions?: {
        id: string
        label: string
        variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
      }[]
    }
  | {
      type: 'SET_TOAST'
      visible: boolean
      id?: string
      kind?: 'success' | 'error' | 'info'
      message?: string
      duration?: number
      actions?: { id: string; label: string; tone?: 'default' | 'primary' | 'danger' }[]
    }
  | {
      type: 'SET_ITINERARY_CHROME'
      visible: boolean
      day?: number
      totalDays?: number
      dateLabel?: string
      searchQuery?: string
      searchPlaceholder?: string
      isSelectingDeparture?: boolean
      nextLabel?: string
      sheetTitle?: string
    }
  | { type: 'REQUEST_APPLE_LOGIN' }
  | {
      type: 'OPEN_OAUTH_LOGIN'
      url: string
      title?: string
      provider?: 'kakao' | 'google' | 'naver'
    }
  | {
      type: 'LOGIN_SUCCESS'
      provider?: 'kakao' | 'google' | 'naver' | 'apple' | 'temp'
      returnTo?: string
    }
  | { type: 'LOGOUT' }

/** 네이티브 → 웹 */
export type NativeToWebMessage =
  | { type: 'NATIVE_READY'; platform: 'ios' | 'android' }
  | { type: 'LOCATION_UPDATE'; location: GeoCoords }
  | { type: 'LOCATION_ERROR'; message: string }
  | {
      type: 'AUTH_TOKEN'
      accessToken: string
      user?: { id: string; nickname: string; profileImageUrl?: string }
    }
  | { type: 'ANDROID_BACK' }
  | { type: 'HEADER_BACK' }
  | { type: 'HEADER_ACTION'; id: string }
  | { type: 'MAP_ASSIGN_PLACE'; id: string }
  | { type: 'MAP_TAPPED' }
  | {
      type: 'MAP_REGION_CHANGED'
      minLat: number
      maxLat: number
      minLng: number
      maxLng: number
    }
  | { type: 'MODAL_ACTION'; id: string }
  | { type: 'MODAL_DISMISS' }
  | { type: 'TOAST_ACTION'; id: string }
  | { type: 'ITINERARY_DAY'; day: number }
  | { type: 'ITINERARY_SEARCH'; query: string }
  | { type: 'ITINERARY_NEXT' }
  | { type: 'ITINERARY_DEPARTURE_CANCEL' }
  | { type: 'NATIVE_LAYOUT'; screenHeight: number }
  | { type: 'KEYBOARD_VISIBLE'; visible: boolean; height?: number }
  /** 같은 탭 재탭 시 탭 루트 경로로 이동 */
  | { type: 'TAB_POP_TO_ROOT'; path: string }
  | {
      type: 'APPLE_CREDENTIAL'
      identityToken: string
      rawNonce: string
      authorizationCode?: string
      email?: string
      fullName?: { givenName?: string | null; familyName?: string | null }
    }
  | { type: 'APPLE_LOGIN_CANCELLED' }
  | { type: 'APPLE_LOGIN_ERROR'; message: string }

declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void
    }
    __GILMOA_BRIDGE_MOCK__?: boolean
    /** 브라우저에서 네이티브 셸처럼 웹 하단 탭바 숨김 */
    __GILMOA_HIDE_WEB_NAV__?: boolean
    __GILMOA_SCREEN_HEIGHT__?: number
  }
}

export {}
