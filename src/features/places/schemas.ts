import { z } from 'zod'

const optionalString = z.string().nullish().transform((value) => value ?? undefined)
const optionalNumber = z.number().nullish().transform((value) => value ?? undefined)

/** GET /places 목록 아이템 */
export const placeListItemSchema = z.object({
  id: z.coerce.string(),
  name: z.string(),
  address: optionalString,
  imageUrl: optionalString,
  categoryName: optionalString,
})

/** GET /places 페이지 응답 */
export const placePageSchema = z.object({
  content: z.array(placeListItemSchema),
  page: z.number(),
  size: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
  last: z.boolean(),
})

/** GET /places/{id} 상세 */
export const placeDetailSchema = placeListItemSchema.extend({
  latitude: optionalNumber,
  longitude: optionalNumber,
  description: optionalString,
  images: z.array(z.string()).nullish().transform((value) => value ?? []),
  homepage: optionalString,
  tel: optionalString,
  overview: optionalString,
})

/** GET /places/popular 아이템 */
export const popularPlaceSchema = z.object({
  placeId: z.coerce.string(),
  name: z.string(),
  imageUrl: optionalString,
  visitCount: optionalNumber,
  region: optionalString,
  hashtags: z.array(z.string()).nullish().transform((value) => value ?? []),
  imageUrls: z.array(z.string()).nullish().transform((value) => value ?? []),
})

/** GET /places/popular 페이지 응답 */
export const popularPlacePageSchema = z.object({
  content: z.array(popularPlaceSchema),
  page: z.number(),
  size: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
  last: z.boolean(),
})

export type PlaceListItem = z.infer<typeof placeListItemSchema>
export type PlacePage = z.infer<typeof placePageSchema>
export type Place = z.infer<typeof placeDetailSchema>
export type PopularPlace = z.infer<typeof popularPlaceSchema>
export type PopularPlacePage = z.infer<typeof popularPlacePageSchema>

/** @deprecated PlaceListItem 사용. 하위 호환용 별칭 */
export const placeSchema = placeDetailSchema
