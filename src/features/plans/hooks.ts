import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants'
import {
  createPlan,
  fetchPlanById,
  fetchPlans,
  updatePlanBudget,
  updatePlanInfo,
  updatePlanItinerary,
  updatePlanWaypoints,
} from './api'
import type { BudgetCategory, PlanDraft } from './types'

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

export function useUpdatePlanInfoMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ planId, draft }: { planId: string; draft: PlanDraft }) => updatePlanInfo(planId, draft),
    onSuccess: (plan) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plans })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plan(plan.id) })
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

export function useUpdatePlanItineraryMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ planId, itinerary }: { planId: string; itinerary: Record<number, string[]> }) =>
      updatePlanItinerary(planId, itinerary),
    onSuccess: (plan) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plans })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plan(plan.id) })
    },
  })
}

export function useUpdatePlanBudgetMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      planId,
      budgetDetail,
    }: {
      planId: string
      budgetDetail: Record<BudgetCategory, number> | null
    }) => updatePlanBudget(planId, budgetDetail),
    onSuccess: (plan) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plans })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plan(plan.id) })
    },
  })
}
