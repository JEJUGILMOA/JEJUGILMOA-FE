import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants'
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

export function useExploreRecordsQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.exploreRecords,
    queryFn: fetchExploreRecords,
  })
}

export function useCreateRecordMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.myRecords })
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
    },
  })
}

export function useDeleteRecordMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteRecord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.myRecords })
    },
  })
}

export function useToggleRecordBookmarkMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => toggleRecordBookmark(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.myRecords })
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
    },
  })
}

export function useReactToExploreRecordMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, reaction }: { id: string; reaction: ReactionType }) =>
      reactToExploreRecord(id, reaction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.exploreRecords })
    },
  })
}

export function useToggleExploreRecordBookmarkMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => toggleExploreRecordBookmark(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.exploreRecords })
    },
  })
}
