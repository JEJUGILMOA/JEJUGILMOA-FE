import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants'
import { cancelTrip, fetchCurrentTrip, startTrip } from './api'

export function useCurrentTripQuery(enabled = true) {
  return useQuery({
    queryKey: QUERY_KEYS.currentTrip,
    queryFn: fetchCurrentTrip,
    enabled,
  })
}

export function useStartTripMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (planId: number) => startTrip(planId),
    onSuccess: (_data, planId) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plans })
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plan(String(planId)) })
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.currentTrip })
    },
  })
}

export function useCancelTripMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (tripId: number) => cancelTrip(tripId),
    onSuccess: (_data, tripId) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plans })
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plan(String(tripId)) })
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.currentTrip })
    },
  })
}
