import { z } from 'zod'

const optionalString = z.string().nullish().transform((value) => value ?? undefined)
const optionalNumber = z.number().nullish().transform((value) => value ?? undefined)

/** GET /home/places 아이템 */
export const homePlaceSchema = z.object({
  placeId: z.coerce.string(),
  name: z.string(),
  categoryName: optionalString,
  region: optionalString,
  imageUrl: optionalString,
  description: optionalString,
  curationLabel: optionalString,
  rating: optionalNumber,
  hashtags: z.array(z.string()).nullish().transform((value) => value ?? []),
})

/** GET /home/courses 미리보기 아이템 */
export const coursePreviewItemSchema = z.object({
  placeId: z.coerce.string(),
  imageUrl: optionalString,
})

/** GET /home/courses 아이템 */
export const homeCourseSchema = z.object({
  courseId: z.coerce.string(),
  imageUrl: optionalString,
  region: optionalString,
  title: z.string(),
  description: optionalString,
  tags: z.array(z.string()).nullish().transform((value) => value ?? []),
  estimatedMinutes: optionalNumber,
  placeCount: optionalNumber,
  transportMode: optionalString,
  preview: z.array(coursePreviewItemSchema).nullish().transform((value) => value ?? []),
})

export type HomePlace = z.infer<typeof homePlaceSchema>
export type HomeCourse = z.infer<typeof homeCourseSchema>
export type CoursePreviewItem = z.infer<typeof coursePreviewItemSchema>
