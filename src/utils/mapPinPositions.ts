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

/** 공항/항구 도착·출발 지점처럼 MOCK_PLACES에 없는 고정 지점용 id */
export const GATEWAY_ARRIVAL_ID = 'gateway-arrival'
export const GATEWAY_DEPARTURE_ID = 'gateway-departure'

/**
 * 실제 좌표 없이 장소 id로 자리표시 지도용 좌표를 결정하는 전역 맵.
 * 모든 장소를 기준으로 한 번만 계산해서, 화면이 달라져도 같은 장소는 항상 같은 위치에 찍힌다.
 */
export const PLACE_PIN_POSITIONS = computePinPositions([
  ...MOCK_PLACES.map((place) => place.id),
  GATEWAY_ARRIVAL_ID,
  GATEWAY_DEPARTURE_ID,
])

export function getPinPosition(placeId: string) {
  return PLACE_PIN_POSITIONS.get(placeId) ?? { left: 50, top: 50 }
}
