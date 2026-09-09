import { apiGet } from '@/api/http'
import {
  mapHeatmapPointSchema,
  mapPlaceSchema,
  type MapBounds,
  type MapHeatmapPoint,
  type MapPlace,
} from './schemas'

export type FetchMapPlacesParams = MapBounds & {
  category?: string
  limit?: number
}

export type FetchMapHeatmapParams = MapBounds & {
  gridSize?: number
}

/** GET /map/places — 뷰포트 내 마커용 장소 */
export async function fetchMapPlaces(params: FetchMapPlacesParams): Promise<MapPlace[]> {
  const data = await apiGet<unknown>('/map/places', {
    params: {
      minLat: params.minLat,
      maxLat: params.maxLat,
      minLng: params.minLng,
      maxLng: params.maxLng,
      category: params.category,
      limit: params.limit,
    },
  })
  return mapPlaceSchema.array().parse(data)
}

/** GET /map/heatmap — 인기 지역 혼잡도 */
export async function fetchMapHeatmap(params: FetchMapHeatmapParams): Promise<MapHeatmapPoint[]> {
  const data = await apiGet<unknown>('/map/heatmap', {
    params: {
      minLat: params.minLat,
      maxLat: params.maxLat,
      minLng: params.minLng,
      maxLng: params.maxLng,
      gridSize: params.gridSize,
    },
  })
  return mapHeatmapPointSchema.array().parse(data)
}
