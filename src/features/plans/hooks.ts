import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants'
import {
  createPlan,
  deletePlan,
  fetchPlanById,
  fetchPlans,
  fetchRecommendations,
  savePlanEdit,
  searchPlanPlaces,
} from './api'
import { NEW_PLAN_ID, planDraftStore, usePlanDraftStore } from './planDraftStore'
import type { PlanCreateRequest, PlanPlaceSearchParams, RecommendationRequest } from './types'

export function usePlansQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.plans,
    queryFn: () => fetchPlans(),
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

/**
 * STEP4~6 화면(일정·예산·미리보기)이 공통으로 쓰는 조회. `planDraftStore`에 이미 이 planId의
 * draft가 있으면 그걸 그대로 쓰고(서버 요청 없음), 없으면(예: 새로고침으로 draft를 잃어버린
 * 경우, 또는 이미 저장된 DRAFT 계획을 링크로 바로 열었을 때) `GET`으로 한 번 불러와 스토어에
 * 채워 넣는다. 이후 편집은 전부 스토어에서만 이뤄지고 서버로는 안 나간다.
 */
export function usePlanDraft(planId: string) {
  const draft = usePlanDraftStore((state) => state.draft)
  const hasMatchingDraft = draft?.id === planId
  const isNewPlan = planId === NEW_PLAN_ID
  const query = usePlanQuery(hasMatchingDraft || isNewPlan ? '' : planId)

  useEffect(() => {
    if (!hasMatchingDraft && query.data) {
      planDraftStore.getState().setDraft(query.data)
    }
  }, [hasMatchingDraft, query.data])

  if (hasMatchingDraft) {
    return { plan: draft, isPending: false, isError: false, refetch: query.refetch }
  }
  // 새 계획인데 로컬 draft가 없다 — STEP1~3 마법사를 거치지 않고 바로 들어온 경우라 복구할 수 없다.
  if (isNewPlan) {
    return { plan: undefined, isPending: false, isError: true, refetch: query.refetch }
  }
  return { plan: query.data, isPending: query.isPending, isError: query.isError, refetch: query.refetch }
}

/** STEP6 — 신규 계획 저장. STEP1~5는 전부 로컬(`planDraftStore`)에서만 편집하다가 여기서 한 번만 호출한다 */
export function useCreatePlanMutation() {
  return useMutation({
    mutationFn: (payload: PlanCreateRequest) => createPlan(payload),
  })
}

/** STEP6 — 기존 DRAFT 계획 저장(PUT 전체 덮어쓰기) */
export function useSavePlanEditMutation() {
  return useMutation({
    mutationFn: ({ planId, payload }: { planId: string; payload: PlanCreateRequest }) =>
      savePlanEdit(planId, payload),
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
