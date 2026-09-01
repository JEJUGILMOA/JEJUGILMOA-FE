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
import { fetchPlanSummaries, type FetchPlanSummariesParams } from './summariesApi'
import type { BudgetCategory, DayItinerary, PlanDraft, TravelPlan } from './types'

export function usePlansQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.plans,
    queryFn: fetchPlans,
  })
}

export function usePlanQuery(planId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.plan(planId),
    enabled: Boolean(planId),
    queryFn: async () => {
      const plan = await fetchPlanById(planId)
      if (!plan) throw new Error('계획을 찾을 수 없어요.')
      return plan
    },
  })
}

function rememberPlan(queryClient: ReturnType<typeof useQueryClient>, plan: TravelPlan) {
  queryClient.setQueryData(QUERY_KEYS.plan(plan.id), plan)
}

export function useCreatePlanMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createPlan,
    onSuccess: (plan) => {
      rememberPlan(queryClient, plan)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plans })
    },
  })
}

export function useUpdatePlanInfoMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ planId, draft }: { planId: string; draft: PlanDraft }) => updatePlanInfo(planId, draft),
    onSuccess: (plan) => {
      rememberPlan(queryClient, plan)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plans })
    },
  })
}

export function useUpdatePlanTitleMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ planId, title }: { planId: string; title: string }) => updatePlanTitle(planId, title),
    onSuccess: (plan) => {
      rememberPlan(queryClient, plan)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plans })
    },
  })
}

export function useUpdatePlanItineraryMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ planId, itinerary }: { planId: string; itinerary: Record<number, DayItinerary> }) =>
      updatePlanItinerary(planId, itinerary),
    onSuccess: (plan) => {
      rememberPlan(queryClient, plan)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plans })
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
      rememberPlan(queryClient, plan)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plans })
    },
  })
}

export function useConfirmPlanMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: confirmPlan,
    onSuccess: (plan) => {
      rememberPlan(queryClient, plan)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plans })
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

export function usePlanSummariesQuery(
  params?: FetchPlanSummariesParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: QUERY_KEYS.planSummaries(params?.status),
    queryFn: () => fetchPlanSummaries(params),
    enabled: options?.enabled ?? true,
  })
}
