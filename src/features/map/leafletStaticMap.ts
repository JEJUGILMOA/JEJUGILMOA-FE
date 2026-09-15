import type { MapOptions, ZoomPanOptions, FitBoundsOptions, InvalidateSizeOptions } from 'leaflet'

/** 웹 Leaflet 지도 — 카메라 이동/줌 애니메이션 비활성 (로딩·fitBounds 시 흔들림 방지) */
export const LEAFLET_NO_CAMERA_ANIMATION: Pick<
  MapOptions,
  'zoomAnimation' | 'fadeAnimation' | 'markerZoomAnimation'
> = {
  zoomAnimation: false,
  fadeAnimation: false,
  markerZoomAnimation: false,
}

export const LEAFLET_NO_ANIMATE: ZoomPanOptions & FitBoundsOptions & InvalidateSizeOptions = {
  animate: false,
}
