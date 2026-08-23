import { MOCK_PLACES, type MockPlace } from '@/data/mockExplore'

const TRAVEL_LABELS = ['도보 5분', '도보 8분', '도보 12분', '차량 8분', '차량 15분', '차량 25분']

function hashString(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0
  }
  return hash
}

// 실제 좌표 데이터가 없어 "가까움"을 흉내 낸다 — 장소 id 쌍마다 항상 같은 점수를 내는
// 해시 기반 결정론적 값을 쓴다. 정렬 순서·이동 라벨이 리렌더마다 흔들리지 않게 하기 위함.
function proximityScore(placeIdA: string, placeIdB: string): number {
  const key = [placeIdA, placeIdB].sort().join(':')
  return hashString(key) % 1000
}

function travelLabelFor(placeIdA: string, placeIdB: string): string {
  return TRAVEL_LABELS[hashString(`${placeIdA}:${placeIdB}`) % TRAVEL_LABELS.length]
}

export type NearbyPlace = {
  place: MockPlace
  /** 기준 장소들 중 가장 가까웠던 곳 id (여러 기준점이 있을 때 어디 기준인지 표시용) */
  nearestToPlaceId: string
  travelLabel: string
}

/**
 * referencePlaceIds(출발지·이미 담은 장소 등) 기준으로 가까운 순으로 정렬한 장소 목록을 만든다.
 * 기준점이 여러 개면 후보마다 가장 가까운 기준점 하나를 골라 점수로 쓴다.
 * 기준점 자신이나 이미 기준점에 포함된 장소는 후보에서 제외된다.
 */
export function rankNearbyPlaces(referencePlaceIds: string[], allPlaces: MockPlace[] = MOCK_PLACES): NearbyPlace[] {
  if (referencePlaceIds.length === 0) return []

  const referenceSet = new Set(referencePlaceIds)

  return allPlaces
    .filter((place) => !referenceSet.has(place.id))
    .map((place) => {
      const nearestToPlaceId = referencePlaceIds.reduce((closestId, refId) =>
        proximityScore(place.id, refId) < proximityScore(place.id, closestId) ? refId : closestId,
      )
      return {
        place,
        nearestToPlaceId,
        travelLabel: travelLabelFor(place.id, nearestToPlaceId),
        score: proximityScore(place.id, nearestToPlaceId),
      }
    })
    .sort((a, b) => a.score - b.score)
    .map(({ place, nearestToPlaceId, travelLabel }) => ({ place, nearestToPlaceId, travelLabel }))
}

/** 후보 하나에 대해, 저장된 장소 중 가장 가까운 곳 1곳의 정보만 필요할 때 쓰는 헬퍼 */
export function findNearestPlace(
  candidateId: string,
  referencePlaceIds: string[],
): { title: string; label: string } | null {
  const others = referencePlaceIds.filter((id) => id !== candidateId)
  const candidatePlace = MOCK_PLACES.find((place) => place.id === candidateId)
  if (others.length === 0 || !candidatePlace) return null

  const [nearest] = rankNearbyPlaces(others, [candidatePlace])
  if (!nearest) return null

  return { title: MOCK_PLACES.find((place) => place.id === nearest.nearestToPlaceId)?.title ?? '', label: nearest.travelLabel }
}
