import { z } from 'zod'

const optionalString = z.string().nullish().transform((value) => value ?? undefined)

export const mapBoundsSchema = z.object({
  minLat: z.number(),
  maxLat: z.number(),
  minLng: z.number(),
  maxLng: z.number(),
})

export const mapPlaceSchema = z.object({
  id: z.coerce.string(),
  name: z.string(),
  categoryName: optionalString,
  imageUrl: optionalString,
  latitude: z.number(),
  longitude: z.number(),
})

export const heatmapLevelSchema = z.enum(['CROWDED', 'MODERATE'])

export const mapHeatmapPointSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  level: heatmapLevelSchema,
  intensity: z.number(),
})

export type MapBounds = z.infer<typeof mapBoundsSchema>
export type MapPlace = z.infer<typeof mapPlaceSchema>
export type HeatmapLevel = z.infer<typeof heatmapLevelSchema>
export type MapHeatmapPoint = z.infer<typeof mapHeatmapPointSchema>
