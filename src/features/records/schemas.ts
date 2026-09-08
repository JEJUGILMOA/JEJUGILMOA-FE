import { z } from 'zod'

const optionalString = z.string().nullish().transform((value) => value ?? undefined)
const optionalNumber = z.number().nullish().transform((value) => value ?? undefined)

export const recordVisibilitySchema = z.enum(['PUBLIC', 'PRIVATE'])

export const travelRecordCardSchema = z
  .object({
    recordId: z.coerce.string(),
    title: z.string(),
    visibility: recordVisibilitySchema.optional(),
    createdAt: optionalString,
    likeCount: optionalNumber,
    viewCount: optionalNumber,
    commentCount: optionalNumber,
    visitedPlaceCount: optionalNumber,
    placeCount: optionalNumber,
    shareUrl: optionalString,
    shareToken: optionalString,
    thumbnailUrl: optionalString,
  })
  .passthrough()

export const recordPageSchema = z.object({
  content: z.array(travelRecordCardSchema),
  page: z.number(),
  size: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
  last: z.boolean(),
})

export type TravelRecordCard = z.infer<typeof travelRecordCardSchema>
export type RecordPage = z.infer<typeof recordPageSchema>
