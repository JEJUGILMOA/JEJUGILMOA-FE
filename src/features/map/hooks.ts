import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants'
import {
  fetchMapHeatmap,
  fetchMapPlaces,
  type FetchMapHeatmapParams,
  type FetchMapPlacesParams,
} from './api'
import type { MapBounds } from './schemas'

function isValidBounds(bounds?: MapBounds | null): bounds is MapBounds {
  if (!bounds) return false
  return (
    bounds.minLat < bounds.maxLat &&
    bounds.minLng < bounds.maxLng &&
    Number.isFinite(bounds.minLat) &&
    Number.isFinite(bounds.maxLat) &&
    Number.isFinite(bounds.minLng) &&
    Number.isFinite(bounds.maxLng)
  )
}

export function useMapPlacesQuery(
  params: FetchMapPlacesParams | null,
  options?: { enabled?: boolean },
) {
  const enabled = (options?.enabled ?? true) && isValidBounds(params)

  return useQuery({
    queryKey: QUERY_KEYS.mapPlaces(params ?? undefined),
    queryFn: () => fetchMapPlaces(params!),
    enabled,
    staleTime: 30_000,
  })
}

export function useMapHeatmapQuery(
  params: FetchMapHeatmapParams | null,
  options?: { enabled?: boolean },
) {
  const enabled = (options?.enabled ?? true) && isValidBounds(params)

  return useQuery({
    queryKey: QUERY_KEYS.mapHeatmap(params ?? undefined),
    queryFn: () => fetchMapHeatmap(params!),
    enabled,
    staleTime: 30_000,
  })
}
