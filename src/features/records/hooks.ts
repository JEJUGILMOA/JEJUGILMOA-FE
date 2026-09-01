import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants'
import { useAuthStore } from '@/stores/authStore'
import {
  createRecord,
  deleteRecord,
  fetchCompletedTrips,
  fetchExploreRecords,
  fetchMyRecords,
  reactToExploreRecord,
  reactToRecord,
  toggleExploreRecordBookmark,
  toggleRecordBookmark,
  updateRecord,
} from './api'
import { fetchRecordCards } from './recordsApi'
import type { ReactionType, SavedRecord } from './types'

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
    }: {
      id: string
      patch: Partial<
        Pick<
          SavedRecord,
          'title' | 'summary' | 'visibility' | 'visitedPlaces' | 'photoUrls' | 'photoCount'
        >
      >
    }) => updateRecord(id, patch),
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

export function useToggleRecordBookmarkMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => toggleRecordBookmark(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.myRecords })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.exploreRecords })
    },
  })
}

export function useReactToRecordMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, reaction }: { id: string; reaction: ReactionType }) =>
      reactToRecord(id, reaction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.myRecords })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.exploreRecords })
    },
  })
}

// 둘러보기에 노출된 항목이 전체공개로 설정한 내 기록일 수도 있어, 내 기록 쪽도 함께 무효화한다
export function useReactToExploreRecordMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, reaction }: { id: string; reaction: ReactionType }) =>
      reactToExploreRecord(id, reaction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.exploreRecords })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.myRecords })
    },
  })
}

export function useToggleExploreRecordBookmarkMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => toggleExploreRecordBookmark(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.exploreRecords })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.myRecords })
    },
  })
}
