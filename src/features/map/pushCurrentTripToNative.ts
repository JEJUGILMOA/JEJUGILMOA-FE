import { nativeBridge } from '@/bridge/nativeBridge'
import { fetchPlaceById } from '@/features/places/api'
import {
  buildTripDayRoutes,
  type CurrentTrip,
  type TripWaypoint,
} from '@/features/trips/schemas'

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

/** 네이티브 진행중 여행 시트에 현재 여행 상태를 즉시 반영 */
export async function pushCurrentTripToNative(trip: CurrentTrip | null): Promise<void> {
  if (!nativeBridge.isNativeWebView()) return

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
}
