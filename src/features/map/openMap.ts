import { nativeBridge } from '@/bridge/nativeBridge'
import { ROUTES } from '@/constants'

export type OpenMapOptions = {
  /** 네이티브 지도 모드 / 웹 `?mode=` */
  mode?: 'general' | 'plan' | 'activeTrip' | 'heatmap'
  placeId?: string
}

/** 네이티브면 지도 탭으로 브릿지 이동. 웹이면 false — 호출측에서 navigate */
export function openMapOnNative(options?: OpenMapOptions): boolean {
  if (!nativeBridge.isNativeWebView()) return false
  nativeBridge.postToNative({
    type: 'NAVIGATE_TO_MAP',
    payload: {
      mode: options?.mode,
      placeId: options?.placeId,
    },
  })
  return true
}

/** 브라우저용 지도 경로 (`/map?mode=activeTrip`) */
export function mapPath(options?: OpenMapOptions): string {
  const params = new URLSearchParams()
  if (options?.mode) params.set('mode', options.mode)
  if (options?.placeId) params.set('placeId', options.placeId)
  const query = params.toString()
  return query ? `${ROUTES.map}?${query}` : ROUTES.map
}
