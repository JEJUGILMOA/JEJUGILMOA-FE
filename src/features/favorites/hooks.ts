import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants'
import { useAuthStore } from '@/stores/authStore'
import {
  addFavorite,
  fetchFavoritePlaceIds,
  fetchFavorites,
  removeFavorite,
  type FetchFavoritesParams,
} from './api'

export function useFavoritesQuery(params?: FetchFavoritesParams) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  return useQuery({
    queryKey: QUERY_KEYS.favorites(params?.page, params?.size),
    queryFn: () => fetchFavorites(params),
    enabled: isAuthenticated,
  })
}

export function useFavoritePlaceIdsQuery() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  return useQuery({
    queryKey: QUERY_KEYS.favoritePlaceIds,
    queryFn: () => fetchFavoritePlaceIds(100),
    enabled: isAuthenticated,
  })
}

export function useToggleFavoriteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      placeId,
      nextFavorite,
    }: {
      placeId: string
      nextFavorite: boolean
    }) => {
      if (nextFavorite) {
        await addFavorite(placeId)
      } else {
        await removeFavorite(placeId)
      }
    },
    onMutate: async ({ placeId, nextFavorite }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.favoritePlaceIds })
      const previous = queryClient.getQueryData<Set<string>>(QUERY_KEYS.favoritePlaceIds)
      const next = new Set(previous ?? [])
      if (nextFavorite) next.add(placeId)
      else next.delete(placeId)
      queryClient.setQueryData(QUERY_KEYS.favoritePlaceIds, next)
      return { previous }
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(QUERY_KEYS.favoritePlaceIds, context.previous)
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.favoritePlaceIds })
      void queryClient.invalidateQueries({ queryKey: ['favorites'] })
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.myProfile })
    },
  })
}
