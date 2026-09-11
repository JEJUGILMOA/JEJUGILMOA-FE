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

/**
 * 뷰포트 중심 기준 비율로 검색 영역을 축소한다.
 * @param ratio 0~1 (예: 0.55 → 화면 가운데 약 55% 영역)
 */
export function shrinkBounds(bounds: MapBounds, ratio = 0.55): MapBounds {
  const clamped = Math.min(1, Math.max(0.05, ratio))
  const latSpan = bounds.maxLat - bounds.minLat
  const lngSpan = bounds.maxLng - bounds.minLng
  const latPad = (latSpan * (1 - clamped)) / 2
  const lngPad = (lngSpan * (1 - clamped)) / 2
  return {
    minLat: bounds.minLat + latPad,
    maxLat: bounds.maxLat - latPad,
    minLng: bounds.minLng + lngPad,
    maxLng: bounds.maxLng - lngPad,
  }
}

export function boundsEqual(a: MapBounds, b: MapBounds): boolean {
  return (
    a.minLat === b.minLat &&
    a.maxLat === b.maxLat &&
    a.minLng === b.minLng &&
    a.maxLng === b.maxLng
  )
}
