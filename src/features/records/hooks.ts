import { useMutation, useQuery, useQueryClient, type QueryClient, type QueryKey } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants'
import {
  createRecord,
  deleteRecord,
  fetchCompletedTrips,
  fetchExploreRecords,
  fetchMyRecords,
  toggleRecordReaction,
  updateRecord,
} from './api'
import type { ExploreRecord, ReactionType, RecordUpdatePatch, SavedRecord } from './types'

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

// 북마크는 서버 API가 없다(스웨거에 없음) — React Query 캐시를 직접 갱신하는 로컬 전용
// 낙관적 토글로 대신한다. 서버 재조회로 덮어써지면 안 되니 invalidateQueries는 호출하지
// 않는다. 같은 기록이 "내 기록"·"둘러보기" 캐시 양쪽에 있을 수 있어(전체공개 내 기록)
// 두 캐시를 다 갱신한다.
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

function toggleBookmarkInCaches(queryClient: QueryClient, id: string) {
  const toggle = <T extends ReactableRecord>(record: T): T => ({ ...record, isBookmarked: !record.isBookmarked })
  updateCachedRecord<SavedRecord>(queryClient, QUERY_KEYS.myRecords, id, toggle)
  updateCachedRecord<ExploreRecord>(queryClient, QUERY_KEYS.exploreRecords, id, toggle)
}

export function useToggleRecordBookmarkMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => toggleBookmarkInCaches(queryClient, id),
  })
}

export function useToggleExploreRecordBookmarkMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => toggleBookmarkInCaches(queryClient, id),
  })
}

// 좋아요/싫어요는 실 API(POST/DELETE /api/records/{id}/reactions)로 연동됐다. 성공 후
// myRecords·exploreRecords 둘 다 무효화해서 실제 likeCount/dislikeCount/myReaction을
// 서버에서 다시 받아온다(같은 기록이 두 캐시에 동시에 있을 수 있어서 둘 다 무효화).
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.myRecords })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.exploreRecords })
    },
  })
}

export function useReactToRecordMutation() {
  return useRecordReactionMutation()
}

export function useReactToExploreRecordMutation() {
  return useRecordReactionMutation()
}
