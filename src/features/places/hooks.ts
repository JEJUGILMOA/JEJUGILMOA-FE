import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants'
import {
  fetchPlaceById,
  fetchPlaces,
  fetchPopularPlaces,
  type BrowsePlacesParams,
  type FetchPopularPlacesParams,
} from './api'
import type { PlaceListItem, PopularPlace } from './types'

type PlacesQueryOptions = Pick<UseQueryOptions<PlaceListItem[]>, 'enabled'>

export function usePlacesQuery(params?: BrowsePlacesParams, options?: PlacesQueryOptions) {
  return useQuery({
    queryKey: QUERY_KEYS.placesList(params),
    queryFn: () => fetchPlaces(params),
    enabled: options?.enabled ?? true,
  })
}

export function usePlaceQuery(placeId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.place(placeId),
    queryFn: () => fetchPlaceById(placeId),
    enabled: Boolean(placeId),
  })
}

type PopularPlacesQueryOptions = Pick<UseQueryOptions<PopularPlace[]>, 'enabled'>

export function usePopularPlacesQuery(
  params?: FetchPopularPlacesParams,
  options?: PopularPlacesQueryOptions,
) {
  return useQuery({
    queryKey: QUERY_KEYS.popularPlaces(params?.limit),
    queryFn: () => fetchPopularPlaces(params),
    enabled: options?.enabled ?? true,
  })
}
