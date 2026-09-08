import { apiDelete, apiGet, apiPost } from '@/api/http'
import {
  favoritePlacePageSchema,
  type FavoritePlace,
  type FavoritePlacePage,
} from './schemas'

export type FetchFavoritesParams = {
  page?: number
  size?: number
}

function toPlaceIdNumber(placeId: string | number) {
  const value = typeof placeId === 'number' ? placeId : Number(placeId)
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error('유효하지 않은 장소 ID예요.')
  }
  return value
}

/** GET /favorites — 내 즐겨찾기 목록 */
export async function fetchFavorites(
  params?: FetchFavoritesParams,
): Promise<FavoritePlacePage> {
  const data = await apiGet<unknown>('/favorites', {
    params: {
      page: params?.page ?? 0,
      size: params?.size ?? 20,
    },
  })
  return favoritePlacePageSchema.parse(data)
}

/** POST /favorites — 즐겨찾기 추가 */
export async function addFavorite(placeId: string | number): Promise<void> {
  await apiPost<void>('/favorites', { placeId: toPlaceIdNumber(placeId) })
}

/** DELETE /favorites/{placeId} — 즐겨찾기 삭제 */
export async function removeFavorite(placeId: string | number): Promise<void> {
  await apiDelete<void>(`/favorites/${toPlaceIdNumber(placeId)}`)
}

/** 홈 카드 등에서 쓰는 placeId Set */
export async function fetchFavoritePlaceIds(size = 100): Promise<Set<string>> {
  const page = await fetchFavorites({ page: 0, size })
  return new Set(page.content.map((item: FavoritePlace) => item.placeId))
}
