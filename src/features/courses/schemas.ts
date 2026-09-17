import { z } from 'zod'

const optionalString = z.string().nullish().transform((value) => value ?? undefined)
/** number|숫자문자열 모두 허용 (목록 waypoint 좌표 등) */
const optionalNumber = z
  .union([z.number(), z.string()])
  .nullish()
  .transform((value) => {
    if (value == null || value === '') return undefined
    const n = typeof value === 'number' ? value : Number(value)
    return Number.isFinite(n) ? n : undefined
  })
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
  placeDescription: optionalString,
  description: optionalString,
  travelTimeToNext: optionalNumber,
  /** OpenAPI CourseStopItem에는 없으나, BE가 넣으면 그대로 사용 */
  latitude: optionalNumber,
  longitude: optionalNumber,
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
  theme: z.string().nullish().transform((value) => value ?? undefined),
  tags: z.array(z.string()).nullish().transform((value) => value ?? []),
  stops: z.array(courseStopSchema).nullish().transform((value) => value ?? []),
})

export const courseSourceTypeSchema = z.enum(['RECOMMENDED', 'RECORD'])

/**
 * `GET /api/courses/saved` 목록 아이템 (`SavedCourseListItemResponse`).
 * RECORD 출처는 estimatedMinutes / theme / copyCount 가 null일 수 있다.
 */
export const savedCourseSchema = z.object({
  savedCourseId: z.coerce.string(),
  sourceType: courseSourceTypeSchema,
  /** RECOMMENDED → 추천 코스 ID, RECORD → 여행 기록 ID */
  sourceId: z.coerce.string().optional(),
  title: z.string(),
  imageUrl: optionalString,
  region: optionalString,
  placeCount: optionalNumber,
  estimatedMinutes: optionalNumber,
  theme: z.string().nullish().transform((value) => value ?? undefined),
  description: optionalString,
  copyCount: optionalNumber,
  waypoints: z.array(courseWaypointSchema).nullish().transform((value) => value ?? []),
})

/**
 * `GET /api/courses/saved/{savedCourseId}/detail` (`SavedCourseDetailResponse`).
 * RECORD 출처는 region / theme / tags / estimatedMinutes / description 이 null일 수 있다.
 */
export const savedCourseDetailSchema = z.object({
  savedCourseId: z.coerce.string(),
  sourceType: courseSourceTypeSchema,
  title: z.string(),
  imageUrl: optionalString,
  region: optionalString,
  theme: z.string().nullish().transform((value) => value ?? undefined),
  placeCount: optionalNumber,
  estimatedMinutes: optionalNumber,
  description: optionalString,
  tags: z.array(z.string()).nullish().transform((value) => value ?? []),
  stops: z.array(courseStopSchema).nullish().transform((value) => value ?? []),
})

export type CourseTheme = z.infer<typeof courseThemeSchema>
export type CourseWaypoint = z.infer<typeof courseWaypointSchema>
export type RecommendedCourse = z.infer<typeof recommendedCourseSchema>
export type CourseStop = z.infer<typeof courseStopSchema>
export type RecommendedCourseDetail = z.infer<typeof recommendedCourseDetailSchema>
export type CourseSourceType = z.infer<typeof courseSourceTypeSchema>
export type SavedCourse = z.infer<typeof savedCourseSchema>
export type SavedCourseDetail = z.infer<typeof savedCourseDetailSchema>
