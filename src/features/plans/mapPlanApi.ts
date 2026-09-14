import { apiGet } from '@/api/http'
import type { TravelPlanDetailResponse } from '@/features/plans/types'

export type PlanRouteStatus =
  | 'CALCULATING'
  | 'READY'
  | 'FAILED'
  | 'UNSUPPORTED'
  | 'NOT_REQUIRED'

export type PlanRoute = {
  date: string
  status: PlanRouteStatus
  option?: string | null
  distance?: number | null
  duration?: number | null
  /** [longitude, latitude][] */
  path?: [number, number][] | null
  failureCode?: string | null
}

export type TravelPlanRoutesResponse = {
  planId: number
  generation?: { status?: string } | null
  routes: PlanRoute[]
}

/** GET /plans/{planId}/routes */
export async function fetchPlanRoutes(
  planId: string | number,
  date?: string,
): Promise<TravelPlanRoutesResponse> {
  const data = await apiGet<TravelPlanRoutesResponse>(`/plans/${planId}/routes`, {
    params: date ? { date } : undefined,
  })
  return {
    planId: data.planId,
    generation: data.generation,
    routes: data.routes ?? [],
  }
}

/** GET /plans/{planId} — 원본 detail (지도용, 로컬 TravelPlan 변환 없이) */
export async function fetchPlanDetailRaw(
  planId: string | number,
): Promise<TravelPlanDetailResponse> {
  return apiGet<TravelPlanDetailResponse>(`/plans/${planId}`)
}
