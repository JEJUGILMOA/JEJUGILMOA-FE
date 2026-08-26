import { apiGet } from '@/api/http'
import { placeSchema, type Place } from './schemas'

export type BrowsePlacesParams = {
  keyword?: string
  category?: string
  page?: number
  size?: number
}

export async function fetchPlaces(params?: BrowsePlacesParams): Promise<Place[]> {
  const data = await apiGet<unknown>('/places', { params })
  return placeSchema.array().parse(data)
}

export async function fetchPlaceById(placeId: string): Promise<Place> {
  const data = await apiGet<unknown>(`/places/${placeId}`)
  return placeSchema.parse(data)
}
