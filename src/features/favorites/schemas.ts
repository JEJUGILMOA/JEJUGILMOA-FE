import { z } from 'zod'

const optionalString = z.string().nullish().transform((value) => value ?? undefined)

/** GET /favorites 아이템 */
export const favoritePlaceSchema = z.object({
  placeId: z.coerce.string(),
  name: z.string(),
  category: optionalString,
  address: optionalString,
  imageUrl: optionalString,
})

export const favoritePlacePageSchema = z.object({
  content: z.array(favoritePlaceSchema),
  page: z.number(),
  size: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
  last: z.boolean(),
})

export const favoriteCreateRequestSchema = z.object({
  placeId: z.coerce.number().int().positive(),
})

export type FavoritePlace = z.infer<typeof favoritePlaceSchema>
export type FavoritePlacePage = z.infer<typeof favoritePlacePageSchema>
export type FavoriteCreateRequest = z.infer<typeof favoriteCreateRequestSchema>
