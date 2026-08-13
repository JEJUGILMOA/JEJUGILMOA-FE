import { differenceInCalendarDays, parse } from 'date-fns'
import { Button } from '@/components/ui/Button/Button'
import { ARRIVAL_POINT_BY_TRANSPORT_MODE } from '@/features/plans/transportMode'
import type { BudgetTier, CompanionType, PlanDraft } from '@/features/plans/types'
import {
  checkCircleStyle,
  ctaGroupStyle,
  secondaryLinkButtonStyle,
  summaryCardStyle,
  summaryCenterStyle,
  summaryDescStyle,
  summaryRowLabelStyle,
  summaryRowStyle,
  summaryRowValueStyle,
  summaryTitleStyle,
} from '../PlanCreatePage.css.ts'

const DATE_FORMAT = 'yyyy.MM.dd'

const COMPANION_LABELS: Record<CompanionType, string> = {
  solo: '혼자',
  couple: '연인과',
  family: '가족과',
  friends: '친구와',
  colleague: '동료와',
}

const BUDGET_LABELS: Record<BudgetTier, string> = {
  low: '~30만원',
  mid: '30~60만원',
  high: '60~100만원',
  premium: '100만원~',
}

export type SummaryStepProps = {
  draft: PlanDraft
  isSubmitting: boolean
  onComplete: () => void
  onReset: () => void
  /** 'edit'면 계획 미리보기에서 들어온 정보 수정 흐름 — 문구·보조 버튼 동작이 달라진다 */
  mode?: 'create' | 'edit'
}

/** STEP 01-7: 입력 완료 요약 (계획 미리보기에서의 정보 수정 흐름도 함께 담당) */
export function SummaryStep({ draft, isSubmitting, onComplete, onReset, mode = 'create' }: SummaryStepProps) {
  const dateLabel =
    draft.startDate && draft.endDate
      ? (() => {
          const start = parse(draft.startDate!, DATE_FORMAT, new Date())
          const end = parse(draft.endDate!, DATE_FORMAT, new Date())
          const nights = differenceInCalendarDays(end, start)
          return `${draft.startDate} - ${draft.endDate} (${nights}박 ${nights + 1}일)`
        })()
      : '-'

  const companionLabel = draft.companionType
    ? draft.companionType === 'solo'
      ? COMPANION_LABELS.solo
      : `${COMPANION_LABELS[draft.companionType]} · ${draft.travelerCount}명`
    : '-'

  const rows = [
    {
      label: '교통편',
      value: `${draft.transportMode} · ${ARRIVAL_POINT_BY_TRANSPORT_MODE[draft.transportMode]} ${draft.arrivalTime} 도착 / ${draft.departureTime} 출발`,
    },
    { label: '여행지', value: '제주도' },
    { label: '여행 날짜', value: dateLabel },
    { label: '동행', value: companionLabel },
    { label: '예산', value: BUDGET_LABELS[draft.budgetTier] },
    { label: '관심사', value: draft.interests.join(', ') },
  ]

  return (
    <div className={summaryCenterStyle}>
      <span className={checkCircleStyle} aria-hidden>
        ✓
      </span>
      <h2 className={summaryTitleStyle}>
        {mode === 'edit' ? '수정할 내용을 확인해주세요' : '여행 정보 입력이 끝났어요!'}
      </h2>
      <p className={summaryDescStyle}>
        {mode === 'edit'
          ? '아래 내용으로 여행 정보를 업데이트할게요.'
          : '입력하신 내용으로 맞춤 일정을 추천해드릴게요.'}
      </p>

      <div className={summaryCardStyle}>
        {rows.map((row) => (
          <div key={row.label} className={summaryRowStyle}>
            <span className={summaryRowLabelStyle}>{row.label}</span>
            <span className={summaryRowValueStyle}>{row.value}</span>
          </div>
        ))}
      </div>

      <div className={ctaGroupStyle}>
        <Button fullWidth size="lg" isLoading={isSubmitting} onClick={onComplete}>
          {mode === 'edit' ? '이 조건으로 수정하기' : '이 조건으로 계획 만들기'}
        </Button>
        <button type="button" className={secondaryLinkButtonStyle} onClick={onReset} disabled={isSubmitting}>
          {mode === 'edit' ? '취소' : '처음부터 다시 계획하기'}
        </button>
      </div>
    </div>
  )
}
