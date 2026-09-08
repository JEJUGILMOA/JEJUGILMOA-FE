import { z } from 'zod'

const optionalString = z.string().nullish().transform((value) => value ?? undefined)
const optionalNumber = z.number().nullish().transform((value) => value ?? undefined)

export const badgeSchema = z.object({
  badgeId: z.coerce.string(),
  name: z.string(),
  description: z.string(),
  imageUrl: optionalString,
  acquired: z.boolean(),
  acquiredAt: optionalString,
  currentProgress: optionalNumber,
  targetProgress: optionalNumber,
})

export const badgeGroupSchema = z.object({
  group: z.enum(['EXPLORATION', 'GOURMET', 'SOCIAL']),
  badges: z.array(badgeSchema),
})

export type Badge = z.infer<typeof badgeSchema>
export type BadgeGroup = z.infer<typeof badgeGroupSchema>
