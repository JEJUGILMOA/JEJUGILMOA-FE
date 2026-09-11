import { z } from 'zod'

const optionalString = z.string().nullish().transform((value) => value ?? undefined)

export const tripWaypointSchema = z.object({
  waypointId: z.number(),
  visitDate: z.string(),
  sequenceOrder: z.number(),
  placeId: z.number(),
  placeName: z.string(),
  categoryName: optionalString,
  imageUrl: optionalString,
  address: optionalString,
  visited: z.boolean(),
  visitedAt: optionalString,
  skipped: z.boolean().optional(),
  skippedAt: optionalString,
  isStart: z.boolean().optional(),
  isDestination: z.boolean().optional(),
  isPreferred: z.boolean().optional(),
})

export const currentTripSchema = z.object({
  tripId: z.number(),
  title: z.string(),
  status: z.string(),
  actualStartedAt: optionalString,
  waypoints: z.array(tripWaypointSchema),
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
export type CurrentTrip = z.infer<typeof currentTripSchema>
export type TripComplete = z.infer<typeof tripCompleteSchema>
export type TripEarnedBadge = z.infer<typeof tripEarnedBadgeSchema>
