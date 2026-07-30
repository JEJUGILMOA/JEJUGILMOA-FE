import { Button } from '@/components/ui/Button/Button'
import { InlineRangeCalendar } from '../components/InlineRangeCalendar'
import { stepDescriptionStyle, stepHeaderStyle, stepTitleStyle } from '../PlanCreatePage.css.ts'

export type DatesStepProps = {
  startDate: string | null
  endDate: string | null
  onChange: (startDate: string, endDate: string | null) => void
  onNext: () => void
}

/** STEP 01-2: 여행 날짜 선택 (범위) */
export function DatesStep({ startDate, endDate, onChange, onNext }: DatesStepProps) {
  return (
    <>
      <div className={stepHeaderStyle}>
        <h2 className={stepTitleStyle}>언제 제주도로 떠나시나요?</h2>
        <p className={stepDescriptionStyle}>여행 날짜를 선택해주세요.</p>
      </div>

      <InlineRangeCalendar startDate={startDate} endDate={endDate} onChange={onChange} />

      <Button fullWidth size="lg" disabled={!startDate || !endDate} onClick={onNext}>
        다음
      </Button>
    </>
  )
}
