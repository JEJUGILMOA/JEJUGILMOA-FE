import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants'
import {
  confirmPlan,
  createPlan,
  deletePlan,
  fetchPlanById,
  fetchPlans,
  updatePlanBudget,
  updatePlanInfo,
  updatePlanItinerary,
  updatePlanTitle,
} from './api'
import type { BudgetCategory, DayItinerary, PlanDraft } from './types'

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

export function useUpdatePlanTitleMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ planId, title }: { planId: string; title: string }) => updatePlanTitle(planId, title),
    onSuccess: (plan) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plans })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plan(plan.id) })
    },
  })
}

export function useUpdatePlanItineraryMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ planId, itinerary }: { planId: string; itinerary: Record<number, DayItinerary> }) =>
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

export function useConfirmPlanMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: confirmPlan,
    onSuccess: (plan) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plans })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plan(plan.id) })
    },
  })
}

export function useDeletePlanMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (planId: string) => deletePlan(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plans })
    },
  })
}
