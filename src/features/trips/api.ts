import { apiGet, apiPost } from '@/api/http'
import { isApiError } from '@/api/error'
import {
  currentTripSchema,
  parseTripVisitResult,
  parseTripWaypointList,
  startedTripSchema,
  tripCancelSchema,
  tripCompleteSchema,
  type CurrentTrip,
  type StartedTrip,
  type TripCancel,
  type TripComplete,
  type TripVisitResult,
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

/** POST /trips — DRAFT 계획을 여행 시작(IN_PROGRESS) */
export async function startTrip(planId: number): Promise<StartedTrip> {
  const data = await apiPost<unknown>('/trips', { planId })
  return startedTripSchema.parse(data)
}

/** POST /trips/{tripId}/visits */
export async function checkTripVisit(params: {
  tripId: number
  waypointId: number
  latitude: number
  longitude: number
}): Promise<TripVisitResult> {
  const data = await apiPost<unknown>(`/trips/${params.tripId}/visits`, {
    waypointId: params.waypointId,
    latitude: params.latitude,
    longitude: params.longitude,
  })
  console.info('[checkVisit] raw result', data)
  return parseTripVisitResult(data)
}

/** POST /trips/{tripId}/waypoints/{waypointId}/skip — GPS 없이 경유지 건너뛰기 */
export async function skipTripWaypoint(params: {
  tripId: number
  waypointId: number
}): Promise<TripWaypoint[]> {
  const data = await apiPost<unknown>(
    `/trips/${params.tripId}/waypoints/${params.waypointId}/skip`,
  )
  console.info('[skipWaypoint] raw result', data)
  return parseTripWaypointList(data)
}

/** POST /trips/{tripId}/complete */
export async function completeTrip(tripId: number): Promise<TripComplete> {
  const data = await apiPost<unknown>(`/trips/${tripId}/complete`)
  return tripCompleteSchema.parse(data)
}

/** POST /trips/{tripId}/cancel — 진행중 여행 중단 (tripId = planId) */
export async function cancelTrip(tripId: number): Promise<TripCancel> {
  const data = await apiPost<unknown>(`/trips/${tripId}/cancel`)
  return tripCancelSchema.parse(data)
}
