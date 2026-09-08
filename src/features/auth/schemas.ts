import { z } from 'zod'

const optionalString = z.string().nullish().transform((value) => value ?? undefined)
const optionalNumber = z.number().nullish().transform((value) => value ?? undefined)

export const userProfileSchema = z.object({
  nickname: z.string(),
  profileImageUrl: optionalString,
  bio: optionalString,
  completedTripCount: optionalNumber,
  favoriteCount: optionalNumber,
  badgeCount: optionalNumber,
  email: optionalString,
  joinedAt: optionalString,
})

export const userUpdateRequestSchema = z.object({
  nickname: z.string().trim().min(1).max(50).optional(),
  profileImageUrl: z.string().max(500).optional(),
  bio: z.string().optional(),
})

export const userSettingsSchema = z.object({
  notifyPlanStart: z.boolean(),
  notifyRecordWriting: z.boolean(),
  notifyBadgeAcquired: z.boolean(),
  notifyNextPlace: z.boolean(),
  notifyPlaceArrival: z.boolean(),
  notifyMarketing: z.boolean(),
  locationPermission: z.boolean(),
})

export const userSettingsUpdateSchema = userSettingsSchema.partial()

export const devAuthResponseSchema = z.object({
  userId: z.coerce.string(),
  email: z.string(),
  nickname: z.string(),
  role: z.enum(['USER', 'ADMIN']),
  newUser: z.boolean(),
  accessToken: z.string(),
})

export type UserProfile = z.infer<typeof userProfileSchema>
export type UserUpdateRequest = z.infer<typeof userUpdateRequestSchema>
export type UserSettings = z.infer<typeof userSettingsSchema>
export type UserSettingsUpdate = z.infer<typeof userSettingsUpdateSchema>
export type DevAuthResponse = z.infer<typeof devAuthResponseSchema>
