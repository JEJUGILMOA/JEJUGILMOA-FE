import type { PlanSummary } from './schemas'
import type { PlanTripCardModel, PlanTripCardStatus } from './types'

function parseDateOnly(value: string) {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function formatApiDate(value: string) {
  return value.replace(/-/g, '.')
}

/** `2026.07.15 - 07.18` / 동일일이면 `2026.08.02` */
function formatDateRangeDisplay(startDate: string, endDate: string) {
  if (startDate === endDate) return formatApiDate(startDate)

  const start = formatApiDate(startDate)
  const [, endMonth, endDay] = endDate.split('-')
  return `${start} - ${endMonth}.${endDay}`
}

function formatDDay(value?: number) {
  if (value == null) return undefined
  if (value === 0) return 'D-Day'
  return value > 0 ? `D-${value}` : `D+${Math.abs(value)}`
}

function formatStayLabel(nights?: number, days?: number) {
  if (nights != null && days != null) {
    if (nights === 0 && days === 1) return '당일'
    return `${nights}박${days}일`
  }
  if (nights != null) return nights === 0 ? '당일' : `${nights}박`
  if (days != null) return `${days}일`
  return undefined
}

function formatDateLine(plan: PlanSummary) {
  const range = formatDateRangeDisplay(plan.startDate, plan.endDate)
  const stay = formatStayLabel(plan.nights, plan.days)
  return stay ? `${range} · ${stay}` : range
}

function resolveTotalDays(plan: PlanSummary) {
  if (plan.days != null && plan.days > 0) return plan.days
  const start = parseDateOnly(plan.startDate)
  const end = parseDateOnly(plan.endDate)
  const diff = Math.round((end.getTime() - start.getTime()) / 86_400_000)
  return Math.max(1, diff + 1)
}

/** 오늘 기준 일차·진행률 (목록 DTO에 방문 진척이 없어 일정 날짜로 추정) */
function resolveDayProgress(plan: PlanSummary) {
  const totalDays = resolveTotalDays(plan)
  const start = parseDateOnly(plan.startDate)
  const end = parseDateOnly(plan.endDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let currentDay = 1
  if (today < start) currentDay = 1
  else if (today > end) currentDay = totalDays
  else {
    currentDay = Math.round((today.getTime() - start.getTime()) / 86_400_000) + 1
    currentDay = Math.min(totalDays, Math.max(1, currentDay))
  }

  return {
    dayProgressLabel: `${currentDay}일차 / ${totalDays}일`,
    progress: currentDay / totalDays,
  }
}

function toCardStatus(status: PlanSummary['status']): PlanTripCardStatus {
  if (status === 'IN_PROGRESS') return 'ongoing'
  if (status === 'DRAFT') return 'planned'
  return 'completed'
}

export function mapPlanSummaryToTrip(plan: PlanSummary): PlanTripCardModel {
  const status = toCardStatus(plan.status)
  const dateLine = formatDateLine(plan)
  const waypointLabel = `경유지 ${plan.waypointCount ?? 0}곳`

  if (status === 'ongoing') {
    const { dayProgressLabel, progress } = resolveDayProgress(plan)
    return {
      id: plan.planId,
      title: plan.title,
      status,
      statusBadge: '진행중',
      dayProgressLabel,
      dateLine,
      waypointLabel,
      progress,
    }
  }

  if (status === 'planned') {
    return {
      id: plan.planId,
      title: plan.title,
      status,
      statusBadge: '계획중',
      dDayBadge: formatDDay(plan.dDay),
      dateLine,
      waypointLabel,
    }
  }

  return {
    id: plan.planId,
    title: plan.title,
    status,
    statusBadge: '완료',
    dateLine,
    waypointLabel,
  }
}
