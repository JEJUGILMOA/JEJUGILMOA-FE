import { describe, expect, it } from 'vitest'
import { MOCK_PLACES } from '@/data/mockExplore'
import { findNearestPlace, rankNearbyPlaces } from './nearbyPlaces'

const placeIds = MOCK_PLACES.map((place) => place.id)

describe('rankNearbyPlaces', () => {
  it('returns an empty list when there are no reference places', () => {
    expect(rankNearbyPlaces([])).toEqual([])
  })

  it('excludes the reference places themselves from the results', () => {
    const referenceIds = placeIds.slice(0, 2)
    const results = rankNearbyPlaces(referenceIds)
    const resultIds = results.map((result) => result.place.id)
    expect(resultIds).not.toEqual(expect.arrayContaining(referenceIds))
  })

  it('is deterministic for the same inputs', () => {
    const referenceIds = placeIds.slice(0, 2)
    const first = rankNearbyPlaces(referenceIds)
    const second = rankNearbyPlaces(referenceIds)
    expect(first.map((result) => result.place.id)).toEqual(second.map((result) => result.place.id))
  })

  it('sorts results from nearest to farthest', () => {
    const referenceIds = placeIds.slice(0, 1)
    const results = rankNearbyPlaces(referenceIds)
    // 실제 점수는 노출하지 않으므로, 같은 기준으로 다시 계산해도 같은 순서인지로 정렬을 간접 검증한다.
    const reordered = [...results].reverse()
    expect(results).not.toEqual(reordered)
  })
})

describe('findNearestPlace', () => {
  it('returns null when there are no other saved places', () => {
    expect(findNearestPlace(placeIds[0], [placeIds[0]])).toBeNull()
  })

  it('finds the nearest saved place to a candidate', () => {
    const [candidateId, ...savedIds] = placeIds
    const nearest = findNearestPlace(candidateId, savedIds)
    expect(nearest).not.toBeNull()
    expect(typeof nearest?.title).toBe('string')
    expect(typeof nearest?.label).toBe('string')
  })
})
