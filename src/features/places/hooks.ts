import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants'
import { fetchPlaceById, fetchPlaces } from './api'

export function usePlacesQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.places,
    queryFn: fetchPlaces,
  })
}

export function usePlaceQuery(placeId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.place(placeId),
    queryFn: () => fetchPlaceById(placeId),
    enabled: Boolean(placeId),
  })
}
