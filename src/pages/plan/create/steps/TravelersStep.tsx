import { Button } from '@/components/ui/Button/Button'
import {
  stepDescriptionStyle,
  stepHeaderStyle,
  stepperButtonStyle,
  stepperCountStyle,
  stepperRowStyle,
  stepTitleStyle,
} from '../PlanCreatePage.css.ts'

const MIN_TRAVELERS = 1
const MAX_TRAVELERS = 10

export type TravelersStepProps = {
  travelerCount: number
  onChange: (count: number) => void
  onNext: () => void
}

/** STEP 01-4: 인원수 입력 (동행유형이 '혼자'가 아닐 때만 노출) */
export function TravelersStep({ travelerCount, onChange, onNext }: TravelersStepProps) {
  return (
    <>
      <div className={stepHeaderStyle}>
        <h2 className={stepTitleStyle}>몇 분이서 함께 가시나요?</h2>
        <p className={stepDescriptionStyle}>본인을 포함한 인원을 알려주세요.</p>
      </div>

      <div className={stepperRowStyle}>
        <button
          type="button"
          className={stepperButtonStyle}
          disabled={travelerCount <= MIN_TRAVELERS}
          onClick={() => onChange(Math.max(MIN_TRAVELERS, travelerCount - 1))}
          aria-label="인원 줄이기"
        >
          −
        </button>
        <span className={stepperCountStyle}>{travelerCount}명</span>
        <button
          type="button"
          className={stepperButtonStyle}
          disabled={travelerCount >= MAX_TRAVELERS}
          onClick={() => onChange(Math.min(MAX_TRAVELERS, travelerCount + 1))}
          aria-label="인원 늘리기"
        >
          +
        </button>
      </div>

      <Button fullWidth size="lg" onClick={onNext}>
        다음
      </Button>
    </>
  )
}
