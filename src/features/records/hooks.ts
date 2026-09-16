import { useMutation, useQuery, useQueryClient, type QueryClient, type QueryKey } from '@tanstack/react-query'
import { getErrorMessage } from '@/api/error'
import { toast } from '@/components/ui/Toast/Toast'
import { QUERY_KEYS } from '@/constants'
import { useAuthStore } from '@/stores/authStore'
import {
  addRecordFavorite,
  createRecord,
  deleteRecord,
  fetchCompletedTrips,
  fetchExploreRecords,
  fetchFavoriteRecordIds,
  fetchFavoriteRecords,
  fetchMyRecords,
  removeRecordFavorite,
  reportRecord,
  toggleRecordReaction,
  updateRecord,
} from './api'
import { fetchRecordCards } from './recordsApi'
import type { ExploreRecord, ReactionType, RecordUpdatePatch, ReportCreateRequest, SavedRecord } from './types'

export function useCompletedTripsQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.completedTrips,
    queryFn: fetchCompletedTrips,
  })
}

export function useMyRecordsQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.myRecords,
    queryFn: fetchMyRecords,
  })
}

export function useMySharedRecordsQuery() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  return useQuery({
    queryKey: QUERY_KEYS.mySharedRecords(),
    queryFn: () => fetchRecordCards({ mine: true, page: 0, size: 50 }),
    enabled: isAuthenticated,
    select: (page) => page.content.filter((record) => record.visibility === 'PUBLIC'),
  })
}

export function useExploreRecordsQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.exploreRecords,
    queryFn: fetchExploreRecords,
  })
}

// 둘러보기 목록이 전체공개 상태의 내 기록을 함께 보여주므로, 내 기록을 바꾸는 뮤테이션은
// myRecords뿐 아니라 exploreRecords도 함께 무효화해야 두 탭이 서로 어긋나지 않는다.
export function useCreateRecordMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.myRecords })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.exploreRecords })
    },
  })
}

export function useUpdateRecordMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      patch,
      original,
    }: {
      id: string
      patch: RecordUpdatePatch
      original: SavedRecord
    }) => updateRecord(id, patch, original),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.myRecords })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.exploreRecords })
    },
  })
}

export function useDeleteRecordMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteRecord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.myRecords })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.exploreRecords })
    },
  })
}

// 기록 즐겨찾기 — POST/DELETE /records/{id}/favorites
// 둘러보기·내 기록 캐시에 낙관적으로 반영하고, 목록 재조회로 서버 상태와 맞춘다.
type ReactableRecord = SavedRecord | ExploreRecord

function updateCachedRecord<T extends ReactableRecord>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  id: string,
  updater: (record: T) => T,
) {
  queryClient.setQueryData<T[]>(queryKey, (records) =>
    records?.map((record) => (record.id === id ? updater(record) : record)),
  )
}

function setBookmarkInCaches(queryClient: QueryClient, id: string, isBookmarked: boolean) {
  const apply = <T extends ReactableRecord>(record: T): T => ({ ...record, isBookmarked })
  updateCachedRecord<SavedRecord>(queryClient, QUERY_KEYS.myRecords, id, apply)
  updateCachedRecord<ExploreRecord>(queryClient, QUERY_KEYS.exploreRecords, id, apply)
}

export type ToggleRecordBookmarkInput = {
  id: string
  nextFavorite: boolean
}

function useToggleRecordBookmarkMutationBase() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, nextFavorite }: ToggleRecordBookmarkInput) => {
      if (nextFavorite) await addRecordFavorite(id)
      else await removeRecordFavorite(id)
    },
    onMutate: async ({ id, nextFavorite }) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: QUERY_KEYS.myRecords }),
        queryClient.cancelQueries({ queryKey: QUERY_KEYS.exploreRecords }),
        queryClient.cancelQueries({ queryKey: QUERY_KEYS.favoriteRecordIds }),
      ])

      const previousMy = queryClient.getQueryData<SavedRecord[]>(QUERY_KEYS.myRecords)
      const previousExplore = queryClient.getQueryData<ExploreRecord[]>(QUERY_KEYS.exploreRecords)
      const previousFavoriteIds = queryClient.getQueryData<Set<string>>(QUERY_KEYS.favoriteRecordIds)

      setBookmarkInCaches(queryClient, id, nextFavorite)

      const nextIds = new Set(previousFavoriteIds ?? [])
      if (nextFavorite) nextIds.add(id)
      else nextIds.delete(id)
      queryClient.setQueryData(QUERY_KEYS.favoriteRecordIds, nextIds)

      return { previousMy, previousExplore, previousFavoriteIds }
    },
    onError: (error, input, context) => {
      if (context?.previousMy) {
        queryClient.setQueryData(QUERY_KEYS.myRecords, context.previousMy)
      }
      if (context?.previousExplore) {
        queryClient.setQueryData(QUERY_KEYS.exploreRecords, context.previousExplore)
      }
      if (context?.previousFavoriteIds) {
        queryClient.setQueryData(QUERY_KEYS.favoriteRecordIds, context.previousFavoriteIds)
      }
      toast.error(
        getErrorMessage(
          error,
          input.nextFavorite
            ? '즐겨찾기 추가에 실패했어요. 다시 시도해 주세요.'
            : '즐겨찾기 해제에 실패했어요. 다시 시도해 주세요.',
        ),
      )
    },
    onSuccess: (_data, input) => {
      toast.success(
        input.nextFavorite ? '기록을 즐겨찾기에 추가했어요' : '기록 즐겨찾기를 해제했어요',
      )
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.exploreRecords })
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.favoriteRecordIds })
      void queryClient.invalidateQueries({ queryKey: ['records', 'favorites', 'list'] })
    },
  })
}

export function useFavoriteRecordIdsQuery() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  return useQuery({
    queryKey: QUERY_KEYS.favoriteRecordIds,
    queryFn: () => fetchFavoriteRecordIds(100),
    enabled: isAuthenticated,
  })
}

export function useFavoriteRecordsQuery(params?: { page?: number; size?: number }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const page = params?.page ?? 0
  const size = params?.size ?? 50

  return useQuery({
    queryKey: QUERY_KEYS.favoriteRecords(page, size),
    queryFn: () => fetchFavoriteRecords({ page, size }),
    enabled: isAuthenticated,
  })
}

export function useToggleRecordBookmarkMutation() {
  return useToggleRecordBookmarkMutationBase()
}

export function useToggleExploreRecordBookmarkMutation() {
  return useToggleRecordBookmarkMutationBase()
}

// 좋아요/싫어요는 실 API(POST/DELETE /api/records/{id}/reactions)로 연동.
// UI 반응을 즉시 반영한 뒤 성공 시 서버 값으로 재동기화한다.
function applyReactionOptimistic<T extends ReactableRecord>(
  record: T,
  reaction: ReactionType,
): T {
  const current = record.myReaction
  let likeCount = record.likeCount
  let dislikeCount = record.dislikeCount
  let myReaction: ReactionType | null

  if (current === reaction) {
    myReaction = null
    if (reaction === 'like') likeCount = Math.max(0, likeCount - 1)
    else dislikeCount = Math.max(0, dislikeCount - 1)
  } else {
    myReaction = reaction
    if (current === 'like') likeCount = Math.max(0, likeCount - 1)
    if (current === 'dislike') dislikeCount = Math.max(0, dislikeCount - 1)
    if (reaction === 'like') likeCount += 1
    else dislikeCount += 1
  }

  return { ...record, myReaction, likeCount, dislikeCount }
}

function useRecordReactionMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      reaction,
      currentReaction,
    }: {
      id: string
      reaction: ReactionType
      currentReaction: ReactionType | null
    }) => toggleRecordReaction(id, reaction, currentReaction),
    onMutate: async ({ id, reaction }) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: QUERY_KEYS.myRecords }),
        queryClient.cancelQueries({ queryKey: QUERY_KEYS.exploreRecords }),
      ])

      const previousMy = queryClient.getQueryData<SavedRecord[]>(QUERY_KEYS.myRecords)
      const previousExplore = queryClient.getQueryData<ExploreRecord[]>(QUERY_KEYS.exploreRecords)

      updateCachedRecord<SavedRecord>(queryClient, QUERY_KEYS.myRecords, id, (record) =>
        applyReactionOptimistic(record, reaction),
      )
      updateCachedRecord<ExploreRecord>(queryClient, QUERY_KEYS.exploreRecords, id, (record) =>
        applyReactionOptimistic(record, reaction),
      )

      return { previousMy, previousExplore }
    },
    onError: (error, _variables, context) => {
      if (context?.previousMy) {
        queryClient.setQueryData(QUERY_KEYS.myRecords, context.previousMy)
      }
      if (context?.previousExplore) {
        queryClient.setQueryData(QUERY_KEYS.exploreRecords, context.previousExplore)
      }
      toast.error(getErrorMessage(error, '반응을 처리하지 못했어요. 다시 시도해 주세요.'))
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.myRecords })
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.exploreRecords })
    },
  })
}

export function useReactToRecordMutation() {
  return useRecordReactionMutation()
}

export function useReactToExploreRecordMutation() {
  return useRecordReactionMutation()
}

export type ReportRecordInput = {
  recordId: string
} & ReportCreateRequest

/** POST /records/{recordId}/reports — 여행 기록 신고 */
export function useReportRecordMutation() {
  return useMutation({
    mutationFn: ({ recordId, reasonSummary, reasonDetail }: ReportRecordInput) =>
      reportRecord(recordId, { reasonSummary, reasonDetail }),
    onSuccess: () => {
      toast.success('신고가 접수되었어요. 검토 후 조치할게요.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, '신고를 접수하지 못했어요. 다시 시도해 주세요.'))
    },
  })
}
