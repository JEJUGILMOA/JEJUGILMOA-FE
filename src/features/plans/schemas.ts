import { z } from 'zod'

/** 숫자 필드 — 문자열/null도 허용 */
const optionalNumber = z.coerce
  .number()
  .nullish()
  .transform((value) => (value == null || Number.isNaN(value) ? undefined : value))

/** Swagger `getMyPlans` status — CANCELLED 포함 (전체 탭에서 반환될 수 있음) */
export const planApiStatusSchema = z.enum([
  'DRAFT',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
])

/** 목록 응답 — status가 없거나 null/빈 문자열/미지 값이면 DRAFT로 본다 */
export const planSummaryStatusSchema = z.preprocess((value) => {
  if (value == null || value === '') return 'DRAFT'
  if (
    value === 'DRAFT' ||
    value === 'IN_PROGRESS' ||
    value === 'COMPLETED' ||
    value === 'CANCELLED'
  ) {
    return value
  }
  return 'DRAFT'
}, planApiStatusSchema)

const optionalDateString = z
  .union([z.string(), z.number(), z.null(), z.undefined()])
  .transform((value) => {
    if (value == null || value === '') return ''
    return String(value)
  })

export const planSummarySchema = z.object({
  planId: z.coerce.string(),
  title: z.union([z.string(), z.null(), z.undefined()]).transform((value) => value ?? ''),
  startDate: optionalDateString,
  endDate: optionalDateString,
  status: planSummaryStatusSchema,
  waypointCount: optionalNumber,
  nights: optionalNumber,
  days: optionalNumber,
  dDay: optionalNumber,
})

export type PlanApiStatus = z.infer<typeof planApiStatusSchema>
export type PlanSummary = z.infer<typeof planSummarySchema>
