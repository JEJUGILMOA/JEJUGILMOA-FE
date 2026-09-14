import { fetchPlaceById } from '@/features/places/api'
import type { PlanDayDetail } from '@/features/plans/types'
import { fetchPlanDetailRaw, fetchPlanRoutes } from '@/features/plans/mapPlanApi'

export type MapPlanWaypointPayload = {
  id: string
  name: string
  latitude: number
  longitude: number
  categoryName?: string
  imageUrl?: string
  address?: string
  /** 해당 일차 내 방문 순서 (1부터) */
  order: number
  /** 1일차 = 1 */
  dayNumber: number
}

export type MapPlanLegPayload = {
  fromId: string
  toId: string
  durationMinutes: number
  distanceKm: number
  dayNumber: number
}

export type MapPlanDayRoutePayload = {
  dayNumber: number
  path: { latitude: number; longitude: number }[]
}

export type MapPlanDetailPayload = {
  planId: number
  title: string
  nights: number
  days: number
  durationLabel: string
  waypoints: MapPlanWaypointPayload[]
  /** @deprecated 일차별 dayRoutes 사용. 하위 호환용 병합 path */
  routePath: { latitude: number; longitude: number }[]
  dayRoutes: MapPlanDayRoutePayload[]
  legs: MapPlanLegPayload[]
}

function dayFallback(day: PlanDayDetail) {
  if (
    typeof day.departureLatitude === 'number' &&
    typeof day.departureLongitude === 'number' &&
    Number.isFinite(day.departureLatitude) &&
    Number.isFinite(day.departureLongitude)
  ) {
    return {
      latitude: day.departureLatitude,
      longitude: day.departureLongitude,
    }
  }
  return null
}

function toCoord(point: [number, number] | number[]) {
  const longitude = point[0]
  const latitude = point[1]
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null
  return { latitude, longitude }
}

export async function buildMapPlanDetail(planId: number): Promise<MapPlanDetailPayload> {
  const detail = await fetchPlanDetailRaw(planId)
  const placeIds = [
    ...new Set(
      (detail.itinerary ?? []).flatMap((day) =>
        (day.waypoints ?? []).map((wp) => String(wp.placeId)),
      ),
    ),
  ]

  const lookup = new Map<
    string,
    { latitude: number; longitude: number; categoryName?: string; imageUrl?: string; address?: string }
  >()

  await Promise.all(
    placeIds.map(async (id) => {
      try {
        const place = await fetchPlaceById(id)
        if (
          typeof place.latitude === 'number' &&
          typeof place.longitude === 'number' &&
          Number.isFinite(place.latitude) &&
          Number.isFinite(place.longitude)
        ) {
          lookup.set(id, {
            latitude: place.latitude,
            longitude: place.longitude,
            categoryName: place.categoryName,
            imageUrl: place.imageUrl,
            address: place.address,
          })
        }
      } catch {
        // skip missing coords
      }
    }),
  )

  const waypoints: MapPlanWaypointPayload[] = []
  const dayWaypointGroups: { dayNumber: number; ids: string[] }[] = []

  for (const day of detail.itinerary ?? []) {
    const fallback = dayFallback(day)
    const dayNumber = day.dayNumber
    let order = 1
    const ids: string[] = []

    for (const wp of day.waypoints ?? []) {
      const looked = lookup.get(String(wp.placeId))
      const latitude = looked?.latitude ?? fallback?.latitude
      const longitude = looked?.longitude ?? fallback?.longitude
      if (latitude == null || longitude == null) continue
      const id = String(wp.placeId)
      waypoints.push({
        id,
        name: wp.placeName,
        latitude,
        longitude,
        categoryName: looked?.categoryName ?? wp.categoryName ?? undefined,
        imageUrl: looked?.imageUrl ?? wp.imageUrl ?? undefined,
        address: looked?.address ?? wp.address,
        order,
        dayNumber,
      })
      ids.push(id)
      order += 1
    }
    dayWaypointGroups.push({ dayNumber, ids })
  }

  const dateToDay = new Map(
    (detail.itinerary ?? []).map((day) => [day.date, day.dayNumber] as const),
  )

  let dayRoutes: MapPlanDayRoutePayload[] = []
  let routePath: { latitude: number; longitude: number }[] = []
  let legs: MapPlanLegPayload[] = []

  try {
    const routes = await fetchPlanRoutes(planId)
    const readyByDay = new Map<number, { path: { latitude: number; longitude: number }[]; meters: number; ms: number }>()

    for (const route of routes.routes ?? []) {
      if (route.status !== 'READY' || !route.path?.length) continue
      const dayNumber = dateToDay.get(route.date)
      if (dayNumber == null) continue
      const path: { latitude: number; longitude: number }[] = []
      for (const point of route.path) {
        const coord = toCoord(point)
        if (coord) path.push(coord)
      }
      if (path.length < 2) continue
      readyByDay.set(dayNumber, {
        path,
        meters: route.distance ?? 0,
        ms: route.duration ?? 0,
      })
    }

    dayRoutes = [...readyByDay.entries()]
      .sort(([a], [b]) => a - b)
      .map(([dayNumber, entry]) => ({ dayNumber, path: entry.path }))

    routePath = dayRoutes.flatMap((entry) => entry.path)

    for (const group of dayWaypointGroups) {
      const ready = readyByDay.get(group.dayNumber)
      const segments = group.ids.length - 1
      if (segments <= 0) continue
      const metersEach = (ready?.meters ?? 0) / segments
      const minutesEach = (ready?.ms ?? 0) / segments / 60000
      if (!ready || (ready.meters <= 0 && ready.ms <= 0)) continue
      for (let i = 0; i < segments; i += 1) {
        legs.push({
          fromId: group.ids[i]!,
          toId: group.ids[i + 1]!,
          durationMinutes: Math.max(1, Math.round(minutesEach)),
          distanceKm: Math.round((metersEach / 1000) * 10) / 10,
          dayNumber: group.dayNumber,
        })
      }
    }
  } catch {
    dayRoutes = []
    routePath = []
    legs = []
  }

  return {
    planId: detail.planId,
    title: detail.title,
    nights: detail.nights,
    days: detail.days,
    durationLabel: `${detail.nights}박 ${detail.days}일`,
    waypoints,
    routePath,
    dayRoutes,
    legs,
  }
}

export function toBridgePlanSummary(plan: {
  planId: string | number
  title: string
  startDate: string
  endDate: string
  status: string
  waypointCount?: number
  nights?: number
  days?: number
  dDay?: number
}) {
  return {
    planId: Number(plan.planId),
    title: plan.title,
    startDate: plan.startDate,
    endDate: plan.endDate,
    status: plan.status as 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED',
    waypointCount: plan.waypointCount ?? 0,
    nights: plan.nights ?? 0,
    days: plan.days ?? 0,
    dDay: plan.dDay ?? 0,
  }
}
