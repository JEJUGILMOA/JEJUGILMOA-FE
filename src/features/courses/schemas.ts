import { z } from 'zod'

const optionalString = z.string().nullish().transform((value) => value ?? undefined)
const optionalNumber = z.number().nullish().transform((value) => value ?? undefined)

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

export type CourseTheme = z.infer<typeof courseThemeSchema>
export type CourseWaypoint = z.infer<typeof courseWaypointSchema>
export type RecommendedCourse = z.infer<typeof recommendedCourseSchema>
