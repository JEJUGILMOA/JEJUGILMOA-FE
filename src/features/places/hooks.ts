import { useInfiniteQuery, useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants'
import {
  fetchPlaceById,
  fetchPlaces,
  fetchPlacesPage,
  fetchPopularPlaces,
  fetchPopularPlacesPage,
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

type PlacesInfiniteParams = {
  keyword?: string
  category?: string
  size?: number
}

export function usePlacesInfiniteQuery(
  params?: PlacesInfiniteParams,
  options?: { enabled?: boolean },
) {
  const size = params?.size ?? 20
  const keyword = params?.keyword?.trim() || undefined
  const category = params?.category

  return useInfiniteQuery({
    queryKey: QUERY_KEYS.placesInfinite({ keyword, category, size }),
    queryFn: ({ pageParam }) =>
      fetchPlacesPage({
        keyword,
        category,
        page: pageParam,
        size,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.last ? undefined : lastPage.page + 1),
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
    queryKey: QUERY_KEYS.popularPlaces(params),
    queryFn: () => fetchPopularPlaces(params),
    enabled: options?.enabled ?? true,
  })
}

type PopularPlacesInfiniteParams = {
  category?: string
  size?: number
}

export function usePopularPlacesInfiniteQuery(
  params?: PopularPlacesInfiniteParams,
  options?: { enabled?: boolean },
) {
  const size = params?.size ?? 20
  const category = params?.category

  return useInfiniteQuery({
    queryKey: QUERY_KEYS.popularPlacesInfinite({ category, size }),
    queryFn: ({ pageParam }) =>
      fetchPopularPlacesPage({
        category,
        page: pageParam,
        size,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.last ? undefined : lastPage.page + 1),
    enabled: options?.enabled ?? true,
  })
}
