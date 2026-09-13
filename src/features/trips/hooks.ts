import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants'
import { fetchCurrentTrip, startTrip } from './api'

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
