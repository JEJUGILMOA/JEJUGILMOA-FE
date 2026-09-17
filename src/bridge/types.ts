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
  | { type: 'OPEN_EXTERNAL_URL'; url: string; fallbackUrl?: string }
  | { type: 'HAPTIC'; style?: 'light' | 'medium' | 'heavy' }
  | { type: 'CLOSE_WEBVIEW' }
  | {
      type: 'NAVIGATE_TO_MAP'
      payload?: {
        placeId?: string
        /** 네이티브 지도 모드. 여행 시작 후엔 `activeTrip` */
        mode?: 'general' | 'plan' | 'activeTrip' | 'heatmap'
      }
    }
  | {
      type: 'NAVIGATE_TO_TAB'
      /** 네이티브 탭 이름 */
      tab: 'home' | 'map' | 'plan' | 'record' | 'my'
      /** 해당 탭 WebView에서 열 경로. 예: `/plan/123` */
      path?: string
    }
  | {
      /** 탭 WebView와 분리된 네이티브 로그인 스택 화면 */
      type: 'OPEN_NATIVE_LOGIN'
      returnTo?: string
    }
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
      unassigned?: {
        id: string
        title: string
        latitude: number
        longitude: number
        categoryName?: string
      }[]
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
      type: 'SET_PLAN_SUMMARIES'
      plans?: {
        planId: number
        title: string
        startDate: string
        endDate: string
        status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
        waypointCount: number
        nights: number
        days: number
        dDay: number
      }[]
      error?: string
    }
  | {
      type: 'MAP_PLAN_DETAIL'
      planId: number
      title: string
      nights: number
      days: number
      durationLabel: string
      waypoints: {
        id: string
        name: string
        latitude: number
        longitude: number
        categoryName?: string
        imageUrl?: string
        address?: string
        order: number
        dayNumber?: number
      }[]
      routePath?: { latitude: number; longitude: number }[]
      dayRoutes?: {
        dayNumber: number
        path: { latitude: number; longitude: number }[]
      }[]
      legs?: {
        fromId: string
        toId: string
        durationMinutes: number
        distanceKm: number
        dayNumber?: number
      }[]
      error?: string
    }
  | {
      type: 'MAP_CURRENT_TRIP'
      trip: {
        tripId: number
        title: string
        status: string
        actualStartedAt?: string
        waypoints: {
          waypointId: number
          visitDate: string
          sequenceOrder: number
          placeId: number
          placeName: string
          categoryName?: string
          imageUrl?: string
          address?: string
          visited: boolean
          visitedAt?: string
          skipped?: boolean
          latitude?: number
          longitude?: number
        }[]
        /** READY 도로 경로 (일차별). 없으면 네이티브가 직선 폴백 */
        dayRoutes?: {
          dayNumber: number
          path: { latitude: number; longitude: number }[]
        }[]
      } | null
      error?: string
    }
  | {
      type: 'MAP_TRIP_VISIT_RESULT'
      tripId: number
      waypoints: {
        waypointId: number
        visitDate: string
        sequenceOrder: number
        placeId: number
        placeName: string
        categoryName?: string
        imageUrl?: string
        address?: string
        visited: boolean
        visitedAt?: string
        skipped?: boolean
        latitude?: number
        longitude?: number
      }[]
      /** 마지막 경유지 인증으로 여행이 자동 완료된 경우 */
      autoCompleted?: boolean
      /** 이번 방문으로 새로 지급된 뱃지 */
      earnedBadges?: {
        badgeId: number
        name: string
        description?: string
        imageUrl?: string
      }[]
      error?: string
    }
  | {
      type: 'MAP_TRIP_COMPLETE_RESULT'
      tripId: number
      title?: string
      durationDays?: number
      placeCount?: number
      totalDistanceKm?: number
      startDate?: string
      endDate?: string
      earnedBadges?: {
        badgeId: number
        name: string
        description?: string
        imageUrl?: string
      }[]
      error?: string
    }
  | { type: 'MAP_ERROR'; code?: string; message: string }
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
      /** 개발 로그인 등 body JWT — 탭 WebView에 AUTH_TOKEN으로 전달 */
      accessToken?: string
      user?: { id: string; nickname: string; profileImageUrl?: string }
    }
  | { type: 'LOGOUT' }
  /** 설정 > 위치 섹션 7회 탭 — 방문 인증 시뮬레이션 토글 */
  | { type: 'TOGGLE_TRIP_VISIT_SPOOF' }
  /** 계획 저장·여행 시작 후 네이티브 탭 갱신 */
  | { type: 'REFRESH_TABS'; tabs: Array<'plan' | 'map' | 'home' | 'record' | 'my'> }

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
  /** Apple/소셜 쿠키 세션 — accessToken 없이 authStore만 맞춤 */
  | {
      type: 'AUTH_SESSION'
      user: { id: string; nickname: string; profileImageUrl?: string }
    }
  /** 네이티브에 보관 세션 없음 — 게스트 UI 확정 */
  | { type: 'AUTH_GUEST' }
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
  | { type: 'REQUEST_PLAN_SUMMARIES' }
  | { type: 'REQUEST_PLAN_DETAIL'; planId: number }
  | { type: 'REQUEST_CURRENT_TRIP' }
  | {
      type: 'REQUEST_MAP_SEARCH'
      minLat: number
      maxLat: number
      minLng: number
      maxLng: number
      category?: string
    }
  | {
      type: 'REQUEST_TRIP_VISIT'
      tripId: number
      waypointId: number
      latitude: number
      longitude: number
    }
  | {
      type: 'REQUEST_TRIP_SKIP'
      tripId: number
      waypointId: number
    }
  | { type: 'REQUEST_TRIP_COMPLETE'; tripId: number }
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
  /** 웹 React Query 캐시 무효화 */
  | { type: 'INVALIDATE_DATA'; scopes: Array<'plans' | 'currentTrip'> }
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
