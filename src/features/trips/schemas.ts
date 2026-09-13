import { z } from 'zod'

const optionalString = z.string().nullish().transform((value) => value ?? undefined)
const optionalBoolean = z.boolean().nullish().transform((value) => value ?? undefined)
const requiredNumber = z.coerce.number()

export const tripWaypointSchema = z.object({
  waypointId: requiredNumber,
  visitDate: z.string(),
  sequenceOrder: requiredNumber,
  placeId: requiredNumber,
  placeName: z
    .string()
    .nullish()
    .transform((value) => value ?? ''),
  categoryName: optionalString,
  imageUrl: optionalString,
  address: optionalString,
  visited: z
    .boolean()
    .nullish()
    .transform((value) => value ?? false),
  visitedAt: optionalString,
  skipped: optionalBoolean,
  skippedAt: optionalString,
  isStart: optionalBoolean,
  isDestination: optionalBoolean,
  isPreferred: optionalBoolean,
})

/** GET /trips/current · 계획 routes와 동일 — path는 [longitude, latitude][] */
export const tripRouteSchema = z.object({
  date: z.string(),
  status: z.enum(['CALCULATING', 'READY', 'FAILED', 'UNSUPPORTED', 'NOT_REQUIRED']),
  option: optionalString,
  distance: z.coerce.number().nullish().transform((value) => value ?? undefined),
  duration: z.coerce.number().nullish().transform((value) => value ?? undefined),
  calculatedAt: optionalString,
  path: z
    .array(z.array(z.coerce.number()).min(2))
    .nullish()
    .transform((value) => value ?? []),
  failureCode: optionalString,
})

/**
 * 백엔드가 `routes: Route[]` 또는 `routes: { routes: Route[], ... }`(계획 routes 래퍼)로
 * 줄 수 있어 배열로 정규화한다.
 */
function normalizeTripRoutesInput(input: unknown): unknown[] {
  if (input == null) return []
  if (Array.isArray(input)) return input
  if (typeof input === 'object') {
    const nested = (input as { routes?: unknown }).routes
    if (Array.isArray(nested)) return nested

    // { "2026-09-13": { status, path, ... }, ... } 형태
    const entries = Object.entries(input as Record<string, unknown>)
    if (
      entries.length > 0 &&
      entries.every(
        ([, value]) =>
          value != null &&
          typeof value === 'object' &&
          !Array.isArray(value) &&
          ('path' in (value as object) || 'status' in (value as object)),
      )
    ) {
      return entries.map(([date, value]) => {
        const route = value as Record<string, unknown>
        return route.date != null ? route : { ...route, date }
      })
    }
  }
  console.warn('[trip] unexpected routes shape', input)
  return []
}

/** checkVisit / skip 응답 파싱 실패 — 앱 Alert에 raw를 실어 보내기 위함 */
export class TripWaypointParseError extends Error {
  readonly raw: unknown
  readonly issues: string[]

  constructor(raw: unknown, issues: { path: (string | number)[]; message: string }[]) {
    const issueText = issues
      .slice(0, 3)
      .map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`)
      .join('\n')
    let rawText = ''
    try {
      rawText = JSON.stringify(raw)
    } catch {
      rawText = String(raw)
    }
    if (rawText.length > 700) {
      rawText = `${rawText.slice(0, 700)}…`
    }
    super(`응답 해석 실패\n${issueText}\n\nraw: ${rawText}`)
    this.name = 'TripWaypointParseError'
    this.raw = raw
    this.issues = issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`)
  }
}

/** checkVisit / skip 응답: 배열 · 단일 객체 · { waypoints: [] } 모두 허용 */
export function parseTripWaypointList(data: unknown) {
  let list: unknown[]
  if (Array.isArray(data)) {
    list = data
  } else if (
    data != null &&
    typeof data === 'object' &&
    Array.isArray((data as { waypoints?: unknown }).waypoints)
  ) {
    list = (data as { waypoints: unknown[] }).waypoints
  } else if (data == null) {
    list = []
  } else {
    list = [data]
  }

  console.info('[tripWaypoint] parse input', {
    rawType: Array.isArray(data) ? 'array' : data === null ? 'null' : typeof data,
    raw: data,
    normalizedLength: list.length,
  })
  const parsed = tripWaypointSchema.array().safeParse(list)
  if (!parsed.success) {
    console.error('[tripWaypoint] parse failed', {
      issues: parsed.error.issues,
      flatten: parsed.error.flatten(),
      raw: data,
      list,
    })
    throw new TripWaypointParseError(
      data,
      parsed.error.issues.map((issue) => ({
        path: issue.path as (string | number)[],
        message: issue.message,
      })),
    )
  }
  console.info('[tripWaypoint] parse ok', parsed.data)
  return parsed.data
}

export const currentTripSchema = z.object({
  tripId: requiredNumber,
  title: z.string(),
  status: z.string(),
  actualStartedAt: optionalString,
  waypoints: z.array(tripWaypointSchema),
  /** 날짜별 도로 경로. READY + path가 있으면 지도에 실경로로 표시 */
  routes: z.preprocess(normalizeTripRoutesInput, z.array(tripRouteSchema)),
})

/** POST /trips 응답 — current trip과 동일 형태 */
export const startedTripSchema = currentTripSchema

export const tripStartRequestSchema = z.object({
  planId: z.number().int().positive(),
})

export const tripEarnedBadgeSchema = z.object({
  badgeId: z.number(),
  name: z.string(),
  description: optionalString,
  imageUrl: optionalString,
  acquiredAt: optionalString,
})

export const tripCompleteSchema = z.object({
  tripId: z.number(),
  title: z.string(),
  status: z.string(),
  startDate: optionalString,
  endDate: optionalString,
  durationDays: z.number().optional(),
  placeCount: z.number().optional(),
  totalDistanceKm: z.number().optional(),
  actualStartedAt: optionalString,
  actualCompletedAt: optionalString,
  earnedBadges: z.array(tripEarnedBadgeSchema).optional(),
})

export type TripWaypoint = z.infer<typeof tripWaypointSchema>
export type TripRoute = z.infer<typeof tripRouteSchema>
export type CurrentTrip = z.infer<typeof currentTripSchema>
export type StartedTrip = z.infer<typeof startedTripSchema>
export type TripStartRequest = z.infer<typeof tripStartRequestSchema>
export type TripComplete = z.infer<typeof tripCompleteSchema>
export type TripEarnedBadge = z.infer<typeof tripEarnedBadgeSchema>

/** visitDate 순 → N일차, READY 경로만 lat/lng path로 변환 */
export function buildTripDayRoutes(
  waypoints: { visitDate: string }[],
  routes: TripRoute[],
): { dayNumber: number; path: { latitude: number; longitude: number }[] }[] {
  const uniqueDates = [
    ...new Set(waypoints.map((wp) => wp.visitDate).filter(Boolean)),
  ].sort()
  const dateToDay = new Map(uniqueDates.map((date, index) => [date, index + 1] as const))

  const byDay = new Map<number, { latitude: number; longitude: number }[]>()
  for (const route of routes) {
    if (route.status !== 'READY' || route.path.length === 0) continue
    const dayNumber = dateToDay.get(route.date)
    if (dayNumber == null) continue
    const path: { latitude: number; longitude: number }[] = []
    for (const point of route.path) {
      const longitude = point[0]
      const latitude = point[1]
      if (
        typeof latitude === 'number' &&
        typeof longitude === 'number' &&
        Number.isFinite(latitude) &&
        Number.isFinite(longitude)
      ) {
        path.push({ latitude, longitude })
      }
    }
    if (path.length >= 2) byDay.set(dayNumber, path)
  }

  return [...byDay.entries()]
    .sort(([a], [b]) => a - b)
    .map(([dayNumber, path]) => ({ dayNumber, path }))
}
