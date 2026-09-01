import { z } from 'zod'

const optionalNumber = z.number().nullish().transform((value) => value ?? undefined)

export const planApiStatusSchema = z.enum(['DRAFT', 'IN_PROGRESS', 'COMPLETED'])

export const planSummarySchema = z.object({
  planId: z.coerce.string(),
  title: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  status: planApiStatusSchema,
  waypointCount: optionalNumber,
  nights: optionalNumber,
  days: optionalNumber,
  dDay: optionalNumber,
})

export type PlanApiStatus = z.infer<typeof planApiStatusSchema>
export type PlanSummary = z.infer<typeof planSummarySchema>
