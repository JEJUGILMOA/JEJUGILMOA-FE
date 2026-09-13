import { useEffect } from 'react'
import { getErrorMessage } from '@/api/error'
import { nativeBridge } from '@/bridge/nativeBridge'
import { buildMapPlanDetail, toBridgePlanSummary } from '@/features/map/buildMapPlanDetail'
import { fetchMapHeatmap, fetchMapPlaces } from '@/features/map/api'
import type { MapBounds } from '@/features/map/schemas'
import { fetchPlanSummaries } from '@/features/plans/summariesApi'
import { fetchPlaceById } from '@/features/places/api'
import { checkTripVisit, completeTrip, fetchCurrentTrip, skipTripWaypoint } from '@/features/trips/api'
import { buildTripDayRoutes, TripWaypointParseError, type TripWaypoint } from '@/features/trips/schemas'
import { ZodError } from 'zod'

const MAP_PLACES_LIMIT = 25
const MAP_HEATMAP_GRID = 10

function tripActionErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof TripWaypointParseError) {
    return error.message
  }
  if (error instanceof ZodError) {
    return '방문 인증 응답을 해석하지 못했어요.'
  }
  return getErrorMessage(error, fallback)
}

async function enrichTripWaypoints(waypoints: TripWaypoint[]) {
  return Promise.all(
    waypoints.map(async (wp) => {
      try {
        const place = await fetchPlaceById(String(wp.placeId))
        return {
          ...wp,
          categoryName: wp.categoryName ?? place.categoryName,
          imageUrl: wp.imageUrl ?? place.imageUrl,
          address: wp.address ?? place.address,
          latitude: place.latitude,
          longitude: place.longitude,
        }
      } catch {
        return { ...wp }
      }
    }),
  )
}

async function pushMapSearch(bounds: MapBounds, category?: string) {
  const [places, heatmap] = await Promise.all([
    fetchMapPlaces({
      ...bounds,
      category,
      limit: MAP_PLACES_LIMIT,
    }),
    fetchMapHeatmap({
      ...bounds,
      gridSize: MAP_HEATMAP_GRID,
    }),
  ])

  nativeBridge.postToNative({
    type: 'SET_MAP',
    visible: true,
    places: places.map((place) => ({
      id: place.id,
      title: place.name,
      latitude: place.latitude,
      longitude: place.longitude,
      categoryName: place.categoryName,
      imageUrl: place.imageUrl,
    })),
    heatmap: heatmap.map((point) => ({
      latitude: point.latitude,
      longitude: point.longitude,
      level: point.level,
      intensity: point.intensity,
    })),
  })
}

async function pushPlanSummaries() {
  try {
    const plans = await fetchPlanSummaries()
    nativeBridge.postToNative({
      type: 'SET_PLAN_SUMMARIES',
      plans: plans.map(toBridgePlanSummary),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : '계획을 불러오지 못했어요'
    nativeBridge.postToNative({
      type: 'SET_PLAN_SUMMARIES',
      plans: [],
      error: message,
    })
  }
}

async function pushPlanDetail(planId: number) {
  try {
    const detail = await buildMapPlanDetail(planId)
    nativeBridge.postToNative({
      type: 'MAP_PLAN_DETAIL',
      ...detail,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : '계획 상세를 불러오지 못했어요'
    nativeBridge.postToNative({
      type: 'MAP_PLAN_DETAIL',
      planId,
      title: '',
      nights: 0,
      days: 0,
      durationLabel: '',
      waypoints: [],
      error: message,
    })
  }
}

async function pushCurrentTrip() {
  try {
    const trip = await fetchCurrentTrip()
    if (!trip) {
      nativeBridge.postToNative({ type: 'MAP_CURRENT_TRIP', trip: null })
      return
    }
    const waypoints = await enrichTripWaypoints(trip.waypoints)
    const dayRoutes = buildTripDayRoutes(waypoints, trip.routes)
    nativeBridge.postToNative({
      type: 'MAP_CURRENT_TRIP',
      trip: { ...trip, waypoints, dayRoutes },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : '진행중 여행을 불러오지 못했어요'
    nativeBridge.postToNative({
      type: 'MAP_CURRENT_TRIP',
      trip: null,
      error: message,
    })
  }
}

/**
 * 네이티브 지도 탭 숨은 WebView용 데이터 레이어.
 * REQUEST_* 수신 → FE API → SET_MAP / MAP_* 응답
 */
export function useMapNativeDataLayer(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return

    const onPlanSummaries = () => {
      void pushPlanSummaries()
    }
    const onPlanDetail = (event: Event) => {
      const planId = (event as CustomEvent<{ planId?: number }>).detail?.planId
      if (typeof planId !== 'number') return
      void pushPlanDetail(planId)
    }
    const onCurrentTrip = () => {
      void pushCurrentTrip()
    }
    const onMapSearch = (event: Event) => {
      const detail = (event as CustomEvent<MapBounds & { category?: string }>).detail
      if (!detail) return
      void pushMapSearch(
        {
          minLat: detail.minLat,
          maxLat: detail.maxLat,
          minLng: detail.minLng,
          maxLng: detail.maxLng,
        },
        detail.category,
      ).catch((error: unknown) => {
        const message = error instanceof Error ? error.message : '지도 검색에 실패했어요'
        nativeBridge.postToNative({ type: 'MAP_ERROR', message })
      })
    }
    const onTripVisit = (event: Event) => {
      const detail = (
        event as CustomEvent<{
          tripId: number
          waypointId: number
          latitude: number
          longitude: number
        }>
      ).detail
      if (!detail) return
      void (async () => {
        try {
          console.info('[checkVisit] request', detail)
          const waypoints = await checkTripVisit(detail)
          const enriched = await enrichTripWaypoints(waypoints)
          nativeBridge.postToNative({
            type: 'MAP_TRIP_VISIT_RESULT',
            tripId: detail.tripId,
            waypoints: enriched,
          })
        } catch (error) {
          console.error('[checkVisit] failed', error)
          const message = tripActionErrorMessage(error, '방문 인증에 실패했어요')
          nativeBridge.postToNative({
            type: 'MAP_TRIP_VISIT_RESULT',
            tripId: detail.tripId,
            waypoints: [],
            error: message,
          })
        }
      })()
    }
    const onTripSkip = (event: Event) => {
      const detail = (
        event as CustomEvent<{
          tripId: number
          waypointId: number
        }>
      ).detail
      if (!detail) return
      void (async () => {
        try {
          console.info('[skipWaypoint] request', detail)
          const waypoints = await skipTripWaypoint(detail)
          const enriched = await enrichTripWaypoints(waypoints)
          nativeBridge.postToNative({
            type: 'MAP_TRIP_VISIT_RESULT',
            tripId: detail.tripId,
            waypoints: enriched,
          })
        } catch (error) {
          console.error('[skipWaypoint] failed', error)
          const message = tripActionErrorMessage(error, '경유지 건너뛰기에 실패했어요')
          nativeBridge.postToNative({
            type: 'MAP_TRIP_VISIT_RESULT',
            tripId: detail.tripId,
            waypoints: [],
            error: message,
          })
        }
      })()
    }
    const onTripComplete = (event: Event) => {
      const tripId = (event as CustomEvent<{ tripId?: number }>).detail?.tripId
      if (typeof tripId !== 'number') return
      void (async () => {
        try {
          const result = await completeTrip(tripId)
          nativeBridge.postToNative({
            type: 'MAP_TRIP_COMPLETE_RESULT',
            tripId,
            title: result.title,
            earnedBadges: (result.earnedBadges ?? []).map((badge) => ({
              badgeId: badge.badgeId,
              name: badge.name,
              description: badge.description,
              imageUrl: badge.imageUrl,
            })),
          })
        } catch (error) {
          const message = error instanceof Error ? error.message : '여행 완료에 실패했어요'
          nativeBridge.postToNative({
            type: 'MAP_TRIP_COMPLETE_RESULT',
            tripId,
            error: message,
          })
        }
      })()
    }

    window.addEventListener('gilmoa:request-plan-summaries', onPlanSummaries)
    window.addEventListener('gilmoa:request-plan-detail', onPlanDetail)
    window.addEventListener('gilmoa:request-current-trip', onCurrentTrip)
    window.addEventListener('gilmoa:request-map-search', onMapSearch)
    window.addEventListener('gilmoa:request-trip-visit', onTripVisit)
    window.addEventListener('gilmoa:request-trip-skip', onTripSkip)
    window.addEventListener('gilmoa:request-trip-complete', onTripComplete)

    return () => {
      window.removeEventListener('gilmoa:request-plan-summaries', onPlanSummaries)
      window.removeEventListener('gilmoa:request-plan-detail', onPlanDetail)
      window.removeEventListener('gilmoa:request-current-trip', onCurrentTrip)
      window.removeEventListener('gilmoa:request-map-search', onMapSearch)
      window.removeEventListener('gilmoa:request-trip-visit', onTripVisit)
      window.removeEventListener('gilmoa:request-trip-skip', onTripSkip)
      window.removeEventListener('gilmoa:request-trip-complete', onTripComplete)
    }
  }, [enabled])
}
