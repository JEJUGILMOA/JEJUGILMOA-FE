import { apiGet } from '@/api/http'
import {
  placeDetailSchema,
  placeListItemSchema,
  placePageSchema,
  popularPlaceSchema,
  type Place,
  type PlaceListItem,
  type PlacePage,
  type PopularPlace,
} from './schemas'

export type BrowsePlacesParams = {
  keyword?: string
  category?: string
  page?: number
  size?: number
}

export type FetchPopularPlacesParams = {
  /** 홈 TOP: 3~4, 인기 목록: 20(기본) */
  limit?: number
}

/** 장소 검색/카테고리 목록 — 페이지 content만 반환 */
export async function fetchPlaces(params?: BrowsePlacesParams): Promise<PlaceListItem[]> {
  const page = await fetchPlacesPage(params)
  return page.content
}

/** 장소 검색/카테고리 목록 — 페이지 메타 포함 */
export async function fetchPlacesPage(params?: BrowsePlacesParams): Promise<PlacePage> {
  const keyword = params?.keyword?.trim()
  const requestParams = {
    page: params?.page,
    size: params?.size,
    category: params?.category,
    ...(keyword ? { keyword } : {}),
  }
  const data = await apiGet<unknown>('/places', { params: requestParams })
  // 구 목(배열) 응답도 허용해 MSW/로컬 목과 호환
  if (Array.isArray(data)) {
    const content = placeListItemSchema.array().parse(
      data.map((item) => {
        const row = item as Record<string, unknown>
        return {
          id: row.id,
          name: row.name,
          address: row.address,
          imageUrl: row.imageUrl ?? row.thumbnailUrl,
          categoryName: row.categoryName ?? row.category,
        }
      }),
    )
    return {
      content,
      page: 0,
      size: content.length,
      totalElements: content.length,
      totalPages: 1,
      last: true,
    }
  }
  return placePageSchema.parse(data)
}

export async function fetchPlaceById(placeId: string): Promise<Place> {
  const data = await apiGet<unknown>(`/places/${placeId}`)
  return placeDetailSchema.parse(data)
}

/** 인기 관광지 (방문 수 상위) */
export async function fetchPopularPlaces(
  params?: FetchPopularPlacesParams,
): Promise<PopularPlace[]> {
  const data = await apiGet<unknown>('/places/popular', { params })
  return popularPlaceSchema.array().parse(data)
}
