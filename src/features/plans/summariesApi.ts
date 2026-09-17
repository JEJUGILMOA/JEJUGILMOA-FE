import { apiGet } from '@/api/http'
import { planSummarySchema, type PlanApiStatus, type PlanSummary } from './schemas'

export type FetchPlanSummariesParams = {
  status?: PlanApiStatus
}

export async function fetchPlanSummaries(params?: FetchPlanSummariesParams): Promise<PlanSummary[]> {
  const data = await apiGet<unknown>('/plans', { params })
  const parsed = planSummarySchema.array().safeParse(data)
  if (parsed.success) return parsed.data

  // 일부 항목만 깨진 경우 전체 실패 대신 유효 항목만 반환
  if (!Array.isArray(data)) {
    throw parsed.error
  }
  return data.flatMap((item) => {
    const one = planSummarySchema.safeParse(item)
    return one.success ? [one.data] : []
  })
}
