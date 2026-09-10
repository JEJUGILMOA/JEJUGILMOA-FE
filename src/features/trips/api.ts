import { apiGet, apiPost } from '@/api/http'
import { isApiError } from '@/api/error'
import {
  currentTripSchema,
  tripCompleteSchema,
  tripWaypointSchema,
  type CurrentTrip,
  type TripComplete,
  type TripWaypoint,
} from './schemas'

/** GET /trips/current — 없으면 undefined */
export async function fetchCurrentTrip(): Promise<CurrentTrip | undefined> {
  try {
    const data = await apiGet<unknown>('/trips/current')
    return currentTripSchema.parse(data)
  } catch (error) {
    if (isApiError(error) && (error.status === 404 || error.code === 'PLAN404_6')) {
      return undefined
    }
    throw error
  }
}

/** POST /trips/{tripId}/visits */
export async function checkTripVisit(params: {
  tripId: number
  waypointId: number
  latitude: number
  longitude: number
}): Promise<TripWaypoint[]> {
  const data = await apiPost<unknown>(`/trips/${params.tripId}/visits`, {
    waypointId: params.waypointId,
    latitude: params.latitude,
    longitude: params.longitude,
  })
  return tripWaypointSchema.array().parse(data)
}

/** POST /trips/{tripId}/complete */
export async function completeTrip(tripId: number): Promise<TripComplete> {
  const data = await apiPost<unknown>(`/trips/${tripId}/complete`)
  return tripCompleteSchema.parse(data)
}
