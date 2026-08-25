import { MOCK_PLACES } from '@/data/mockExplore'

const MAP_MARGIN = 9
const MIN_PIN_DISTANCE = 11

function hashString(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0
  }
  return hash
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function basePinPosition(placeId: string, salt: number) {
  return MAP_MARGIN + (hashString(`${placeId}-${salt}`) % (100 - MAP_MARGIN * 2))
}

/** 핀끼리 최소 거리를 확보하도록 해시 기반 좌표를 나선형으로 밀어내며 배치한다 */
function computePinPositions(placeIds: string[]) {
  const positions = new Map<string, { left: number; top: number }>()

  for (const id of placeIds) {
    let left = basePinPosition(id, 1)
    let top = basePinPosition(id, 2)
    let attempt = 0

    while (attempt < 60) {
      const overlaps = [...positions.values()].some(
        (pos) => Math.hypot(pos.left - left, pos.top - top) < MIN_PIN_DISTANCE,
      )
      if (!overlaps) break

      const angle = attempt * 2.399963
      const radius = 3 + attempt * 1.1
      left = clamp(basePinPosition(id, 1) + Math.cos(angle) * radius, MAP_MARGIN, 100 - MAP_MARGIN)
      top = clamp(basePinPosition(id, 2) + Math.sin(angle) * radius, MAP_MARGIN, 100 - MAP_MARGIN)
      attempt += 1
    }

    positions.set(id, { left, top })
  }

  return positions
}

/**
 * 실제 좌표 없이 장소 id로 자리표시 지도용 좌표를 결정하는 전역 맵.
 * 모든 장소를 기준으로 한 번만 계산해서, 화면이 달라져도 같은 장소는 항상 같은 위치에 찍힌다.
 */
export const PLACE_PIN_POSITIONS = computePinPositions(MOCK_PLACES.map((place) => place.id))

export function getPinPosition(placeId: string) {
  return PLACE_PIN_POSITIONS.get(placeId) ?? { left: 50, top: 50 }
}

/** 자리표시 핀(%)을 제주 대략 영역 위경도로 변환 — 네이티브 지도 SDK용 */
const JEJU_LAT_MAX = 33.56
const JEJU_LAT_MIN = 33.2
const JEJU_LNG_MIN = 126.16
const JEJU_LNG_MAX = 126.95

export function getPinLatLng(placeId: string) {
  const { left, top } = getPinPosition(placeId)
  return {
    latitude: JEJU_LAT_MAX - (top / 100) * (JEJU_LAT_MAX - JEJU_LAT_MIN),
    longitude: JEJU_LNG_MIN + (left / 100) * (JEJU_LNG_MAX - JEJU_LNG_MIN),
  }
}
