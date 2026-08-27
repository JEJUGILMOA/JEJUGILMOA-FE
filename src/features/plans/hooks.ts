import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants'
import {
  confirmPlan,
  createPlan,
  deletePlan,
  fetchPlanById,
  fetchPlans,
  fetchRecommendations,
  searchPlanPlaces,
  updatePlanBudget,
  updatePlanInfo,
  updatePlanItinerary,
  updatePlanTitle,
} from './api'
import type {
  BudgetCategory,
  DayItinerary,
  PlanDraft,
  PlanPlaceSearchParams,
  RecommendationRequest,
  TravelPlan,
} from './types'

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

/**
 * STEP4 추천·검색 탭 — 전역/앵커 추천. 서버가 이전 결과를 기억하지 않는 stateless API라,
 * request(특히 excludedPlaceIds/excludeContentIds 누적분)가 바뀌면 그 자체가 새 쿼리키가 되어
 * 자동으로 다시 요청한다. "새로고침"은 그 누적 배열을 늘리기만 하면 된다.
 */
export function useRecommendationsQuery(request: RecommendationRequest, enabled: boolean) {
  return useQuery({
    queryKey: ['plans', 'recommendations', request],
    queryFn: () => fetchRecommendations(request),
    enabled,
    staleTime: 0,
  })
}

export function useSearchPlanPlacesQuery(params: PlanPlaceSearchParams, enabled: boolean) {
  return useQuery({
    queryKey: ['plans', 'placeSearch', params],
    queryFn: () => searchPlanPlaces(params),
    enabled,
  })
}
