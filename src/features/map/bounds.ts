import type { MapBounds } from './schemas'

/** 제주 전역 대략 영역 — 네이티브 region이 오기 전 기본값 */
export const JEJU_DEFAULT_BOUNDS: MapBounds = {
  minLat: 33.2,
  maxLat: 33.56,
  minLng: 126.16,
  maxLng: 126.95,
}

/** 현재 위치 기준 사각 뷰포트 (약 ±delta 도) */
export function boundsAround(
  latitude: number,
  longitude: number,
  delta = 0.12,
): MapBounds {
  return {
    minLat: latitude - delta,
    maxLat: latitude + delta,
    minLng: longitude - delta,
    maxLng: longitude + delta,
  }
}

export function roundBounds(bounds: MapBounds, digits = 4): MapBounds {
  const factor = 10 ** digits
  const round = (value: number) => Math.round(value * factor) / factor
  return {
    minLat: round(bounds.minLat),
    maxLat: round(bounds.maxLat),
    minLng: round(bounds.minLng),
    maxLng: round(bounds.maxLng),
  }
}
