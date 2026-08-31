import { describe, expect, it } from 'vitest'
import { buildPlanCreateRequest, mapPlanDetailToTravelPlan, mapPlanSummaryToTravelPlan } from './api'
import type { TravelPlan, TravelPlanDetailResponse, TravelPlanSummary } from './types'

function makePlan(overrides: Partial<TravelPlan> = {}): TravelPlan {
  return {
    id: 'plan-1',
    title: '제주 3박 4일',
    destination: '제주도',
    status: 'draft',
    startDate: '2026.09.01',
    endDate: '2026.09.03',
    companionType: 'couple',
    travelerCount: 2,
    interests: ['FOOD', 'NATURE'],
    createdAt: new Date().toISOString(),
    waypointPlaceIds: [],
    itinerary: {},
    budgetTransportation: null,
    budgetAccommodation: null,
    budgetFood: null,
    budgetEtc: null,
    ...overrides,
  }
}

describe('buildPlanCreateRequest', () => {
  it('converts basic fields (date format, companion, categories)', () => {
    const request = buildPlanCreateRequest(makePlan())

    expect(request.title).toBe('제주 3박 4일')
    expect(request.startDate).toBe('2026-09-01')
    expect(request.endDate).toBe('2026-09-03')
    expect(request.companion).toBe('COUPLE')
    expect(request.categories).toEqual(['FOOD', 'NATURE'])
  })

  it('sends categories as null when interests are empty', () => {
    const request = buildPlanCreateRequest(makePlan({ interests: [] }))
    expect(request.categories).toBeNull()
  })

  it('sends the fallback departure for a day that has waypoints but no departure set', () => {
    const plan = makePlan({
      itinerary: {
        1: { departure: null, waypoints: [{ placeId: '5', title: '성산일출봉', isPreferred: false }] },
      },
    })

    const request = buildPlanCreateRequest(plan)

    expect(request.days?.[0].departurePlaceId).toBeNull()
    expect(request.days?.[0].departureLocationName).toBe('제주국제공항')
    expect(request.days?.[0].departureLatitude).toBeCloseTo(33.5072)
    expect(request.days?.[0].departureLongitude).toBeCloseTo(126.4929)
  })

  it('sends the real departure per day when one was picked', () => {
    const plan = makePlan({
      itinerary: {
        1: {
          departure: { placeId: '77', title: '제주 게스트하우스', address: '제주시', latitude: 33.5, longitude: 126.5 },
          waypoints: [{ placeId: '5', title: '성산일출봉', isPreferred: false }],
        },
      },
    })

    const request = buildPlanCreateRequest(plan)

    expect(request.days?.[0].departurePlaceId).toBe(77)
    expect(request.days?.[0].departureLocationName).toBe('제주 게스트하우스')
    expect(request.days?.[0].departureLatitude).toBe(33.5)
    expect(request.days?.[0].departureLongitude).toBe(126.5)
  })

  it('drops mock-sourced waypoints whose placeId is not numeric', () => {
    const plan = makePlan({
      itinerary: {
        1: {
          departure: null,
          waypoints: [
            { placeId: 'hyeopjae-beach', title: '협재 해수욕장', isPreferred: false },
            { placeId: '96', title: '실제 DB 장소', isPreferred: true },
          ],
        },
      },
    })

    const request = buildPlanCreateRequest(plan)

    expect(request.days).toHaveLength(1)
    expect(request.days?.[0].waypoints).toEqual([{ placeId: 96, isPreferred: true }])
  })

  it('omits days that end up with no waypoints, and computes visitDate from startDate + day offset', () => {
    const plan = makePlan({
      startDate: '2026.09.01',
      itinerary: {
        1: { departure: null, waypoints: [] },
        2: {
          departure: null,
          waypoints: [{ placeId: '5', title: '성산일출봉', isPreferred: false }],
        },
      },
    })

    const request = buildPlanCreateRequest(plan)

    expect(request.days).toHaveLength(1)
    expect(request.days?.[0]).toMatchObject({
      visitDate: '2026-09-02',
      waypoints: [{ placeId: 5, isPreferred: false }],
    })
  })

  it('sends days as null when nothing has waypoints', () => {
    const request = buildPlanCreateRequest(makePlan({ itinerary: {} }))
    expect(request.days).toBeNull()
  })

  it('sends budget as null unless at least one category is set', () => {
    expect(buildPlanCreateRequest(makePlan()).budget).toBeNull()

    const request = buildPlanCreateRequest(makePlan({ budgetTransportation: 10 }))
    expect(request.budget).toEqual({
      budgetTransportation: 10,
      budgetAccommodation: null,
      budgetFood: null,
      budgetEtc: null,
    })
  })
})

describe('mapPlanSummaryToTravelPlan', () => {
  function makeSummary(overrides: Partial<TravelPlanSummary> = {}): TravelPlanSummary {
    return {
      planId: 26,
      title: '제주 가을 여행',
      startDate: '2027-08-15',
      endDate: '2027-08-17',
      status: 'DRAFT',
      waypointCount: 3,
      nights: 2,
      days: 3,
      dDay: 9,
      ...overrides,
    }
  }

  it('maps id, dates and waypointCount', () => {
    const plan = mapPlanSummaryToTravelPlan(makeSummary())

    expect(plan.id).toBe('26')
    expect(plan.startDate).toBe('2027.08.15')
    expect(plan.endDate).toBe('2027.08.17')
    expect(plan.waypointCount).toBe(3)
    expect(plan.itinerary).toEqual({})
  })

  it.each([
    ['DRAFT', 'draft'],
    ['IN_PROGRESS', 'saved'],
    ['COMPLETED', 'saved'],
  ] as const)('maps status %s -> %s', (apiStatus, localStatus) => {
    const plan = mapPlanSummaryToTravelPlan(makeSummary({ status: apiStatus }))
    expect(plan.status).toBe(localStatus)
  })
})

describe('mapPlanDetailToTravelPlan', () => {
  function makeDetail(overrides: Partial<TravelPlanDetailResponse> = {}): TravelPlanDetailResponse {
    return {
      planId: 26,
      title: '제주 가을 여행',
      startDate: '2027-08-15',
      endDate: '2027-08-17',
      nights: 2,
      days: 3,
      status: 'DRAFT',
      travelStyle: null,
      companion: 'COUPLE',
      categories: ['NATURE', 'CAFE'],
      itinerary: [
        {
          date: '2027-08-15',
          dayNumber: 1,
          departurePlaceId: 99,
          departureLocationName: '새별오름',
          departureLatitude: 33.3605,
          departureLongitude: 126.4086,
          waypoints: [
            {
              waypointId: 8,
              visitDate: '2027-08-15',
              sequenceOrder: 2,
              placeId: 10,
              placeName: '애월 카페거리',
              categoryName: '카페',
              imageUrl: null,
              address: '제주시 애월읍',
              visited: false,
              visitedAt: null,
              isStart: false,
              isDestination: true,
              isPreferred: false,
            },
            {
              waypointId: 7,
              visitDate: '2027-08-15',
              sequenceOrder: 1,
              placeId: 42,
              placeName: '협재해수욕장',
              categoryName: '자연',
              imageUrl: null,
              address: '제주시 한림읍',
              visited: false,
              visitedAt: null,
              isStart: true,
              isDestination: false,
              isPreferred: true,
            },
          ],
        },
        {
          date: '2027-08-16',
          dayNumber: 2,
          departurePlaceId: null,
          departureLocationName: null,
          departureLatitude: 33.507_2,
          departureLongitude: 126.492_9,
          waypoints: [],
        },
      ],
      budgetTransportation: 50_000,
      budgetAccommodation: 150_000,
      budgetFood: null,
      budgetEtc: null,
      totalBudget: 200_000,
      ...overrides,
    }
  }

  it('maps id, dates, companion and categories', () => {
    const plan = mapPlanDetailToTravelPlan(makeDetail())

    expect(plan.id).toBe('26')
    expect(plan.startDate).toBe('2027.08.15')
    expect(plan.endDate).toBe('2027.08.17')
    expect(plan.companionType).toBe('couple')
    expect(plan.interests).toEqual(['NATURE', 'CAFE'])
  })

  it('falls back to solo when companion is null', () => {
    const plan = mapPlanDetailToTravelPlan(makeDetail({ companion: null }))
    expect(plan.companionType).toBe('solo')
  })

  it('falls back to empty interests when categories is null', () => {
    const plan = mapPlanDetailToTravelPlan(makeDetail({ categories: null }))
    expect(plan.interests).toEqual([])
  })

  it('sorts waypoints by sequenceOrder and maps placeId/title/isPreferred', () => {
    const plan = mapPlanDetailToTravelPlan(makeDetail())

    expect(plan.itinerary[1]?.waypoints).toEqual([
      { placeId: '42', title: '협재해수욕장', isPreferred: true },
      { placeId: '10', title: '애월 카페거리', isPreferred: false },
    ])
  })

  it('maps each day departure from the response, using an empty placeId when the day has none', () => {
    const plan = mapPlanDetailToTravelPlan(makeDetail())

    expect(plan.itinerary[1]?.departure).toEqual({
      placeId: '99',
      title: '새별오름',
      address: '',
      latitude: 33.3605,
      longitude: 126.4086,
    })
    expect(plan.itinerary[2]?.departure).toEqual({
      placeId: '',
      title: '',
      address: '',
      latitude: 33.507_2,
      longitude: 126.492_9,
    })
  })

  it('passes budget fields straight through', () => {
    const plan = mapPlanDetailToTravelPlan(makeDetail())

    expect(plan.budgetTransportation).toBe(50_000)
    expect(plan.budgetAccommodation).toBe(150_000)
    expect(plan.budgetFood).toBeNull()
    expect(plan.budgetEtc).toBeNull()
  })
})
