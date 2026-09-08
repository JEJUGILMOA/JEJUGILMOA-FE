import { apiGet } from '@/api/http'
import { planSummarySchema, type PlanApiStatus, type PlanSummary } from './schemas'

export type FetchPlanSummariesParams = {
  status?: PlanApiStatus
}

export async function fetchPlanSummaries(params?: FetchPlanSummariesParams): Promise<PlanSummary[]> {
  const data = await apiGet<unknown>('/plans', { params })
  return planSummarySchema.array().parse(data)
}
