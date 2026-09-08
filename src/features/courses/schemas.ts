import { z } from 'zod'

const optionalString = z.string().nullish().transform((value) => value ?? undefined)
const optionalNumber = z.number().nullish().transform((value) => value ?? undefined)
const optionalBoolean = z.boolean().nullish().transform((value) => value ?? undefined)

export const courseThemeSchema = z.enum([
  'FOOD',
  'NATURE',
  'ACTIVITY',
  'CAFE',
  'CULTURE',
  'SHOPPING',
  'FESTIVAL',
])

export const courseWaypointSchema = z.object({
  sequenceOrder: z.number(),
  placeId: z.coerce.string(),
  placeName: z.string(),
  imageUrl: optionalString,
  latitude: optionalNumber,
  longitude: optionalNumber,
})

export const recommendedCourseSchema = z.object({
  courseId: z.coerce.string(),
  title: z.string(),
  theme: z.string().nullish().transform((value) => value ?? undefined),
  description: optionalString,
  copyCount: optionalNumber,
  waypoints: z.array(courseWaypointSchema).nullish().transform((value) => value ?? []),
})

export const courseStopSchema = z.object({
  sequenceOrder: z.number(),
  placeId: z.coerce.string(),
  placeName: z.string(),
  placeImageUrl: optionalString,
  travelTimeToNext: optionalNumber,
})

export const recommendedCourseDetailSchema = z.object({
  courseId: z.coerce.string(),
  imageUrl: optionalString,
  title: z.string(),
  region: optionalString,
  isFree: optionalBoolean,
  rating: optionalNumber,
  transportMode: optionalString,
  placeCount: optionalNumber,
  estimatedMinutes: optionalNumber,
  description: optionalString,
  stops: z.array(courseStopSchema).nullish().transform((value) => value ?? []),
})

export type CourseTheme = z.infer<typeof courseThemeSchema>
export type CourseWaypoint = z.infer<typeof courseWaypointSchema>
export type RecommendedCourse = z.infer<typeof recommendedCourseSchema>
export type CourseStop = z.infer<typeof courseStopSchema>
export type RecommendedCourseDetail = z.infer<typeof recommendedCourseDetailSchema>
