import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants'
import { createRecord, fetchCompletedTrips, fetchMyRecords } from './api'

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

export function useCreateRecordMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.myRecords })
    },
  })
}
