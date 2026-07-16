import { apiClient } from '@/api/axios'
import { placeSchema, type Place } from './schemas'

export async function fetchPlaces(): Promise<Place[]> {
  const { data } = await apiClient.get<unknown>('/places')
  return placeSchema.array().parse(data)
}

export async function fetchPlaceById(placeId: string): Promise<Place> {
  const { data } = await apiClient.get<unknown>(`/places/${placeId}`)
  return placeSchema.parse(data)
}
