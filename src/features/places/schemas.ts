import { z } from 'zod'

export const placeSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string().optional(),
  address: z.string().optional(),
  thumbnailUrl: z.string().url().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
})

export type Place = z.infer<typeof placeSchema>
