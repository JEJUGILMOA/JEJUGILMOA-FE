import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants'
import { createPlan, fetchPlanById, fetchPlans, updatePlanWaypoints } from './api'

export function usePlansQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.plans,
    queryFn: fetchPlans,
  })
}

export function usePlanQuery(planId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.plan(planId),
    queryFn: () => fetchPlanById(planId),
  })
}

export function useCreatePlanMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plans })
    },
  })
}

export function useUpdatePlanWaypointsMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ planId, waypointPlaceIds }: { planId: string; waypointPlaceIds: string[] }) =>
      updatePlanWaypoints(planId, waypointPlaceIds),
    onSuccess: (plan) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plans })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plan(plan.id) })
    },
  })
}
