import { Button } from '@/components/ui/Button/Button'
import { InlineRangeCalendar } from '../components/InlineRangeCalendar'
import { stepDescriptionStyle, stepHeaderStyle, stepTitleStyle, datesNextButtonStyle } from '../PlanCreatePage.css.ts'

export type DatesStepProps = {
  startDate: string | null
  endDate: string | null
  onChange: (startDate: string, endDate: string | null) => void
  onNext: () => void
  /** true면 이미 저장된 계획이라 날짜를 바꿀 수 없다 — 일정이 날짜 기준으로 이미 짜여 있어서다 */
  readOnly?: boolean
}

/** STEP 01-2: 여행 날짜 선택 (범위) */
export function DatesStep({ startDate, endDate, onChange, onNext, readOnly = false }: DatesStepProps) {
  return (
    <>
      <div className={stepHeaderStyle}>
        <h2 className={stepTitleStyle}>언제 제주도로 떠나시나요?</h2>
        <p className={stepDescriptionStyle}>
          {readOnly
            ? '이미 저장된 계획은 날짜를 바꿀 수 없어요. 날짜를 바꾸려면 계획을 삭제하고 새로 만들어 주세요.'
            : '여행 날짜를 선택해주세요.'}
        </p>
      </div>

      <InlineRangeCalendar
        startDate={startDate}
        endDate={endDate}
        onChange={onChange}
        readOnly={readOnly}
      />

      <Button fullWidth size="lg" className={datesNextButtonStyle} disabled={!startDate || !endDate} onClick={onNext}>
        다음
      </Button>
    </>
  )
}
