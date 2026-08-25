import { Button } from '@/components/ui/Button/Button'
import { TextField } from '@/components/ui/TextField/TextField'
import { datesNextButtonStyle, stepDescriptionStyle, stepHeaderStyle, stepTitleStyle } from '../PlanCreatePage.css.ts'

const TITLE_MAX_LENGTH = 20

export type TitleStepProps = {
  title: string
  onChange: (title: string) => void
  onNext: () => void
  suggestedTitle: string
  isSubmitting?: boolean
}

/** STEP 01 마지막: 여행 제목 입력. 비우면 날짜 기준 자동 제목을 쓴다 */
export function TitleStep({ title, onChange, onNext, suggestedTitle, isSubmitting }: TitleStepProps) {
  return (
    <>
      <div className={stepHeaderStyle}>
        <h2 className={stepTitleStyle}>이번 여행의 이름을 지어볼까요?</h2>
        <p className={stepDescriptionStyle}>비워두면 “{suggestedTitle}”으로 저장돼요.</p>
      </div>

      <TextField
        label="여행 제목"
        value={title}
        onChange={onChange}
        placeholder={suggestedTitle}
        maxLength={TITLE_MAX_LENGTH}
        showCount
      />

      <Button fullWidth size="lg" className={datesNextButtonStyle} isLoading={isSubmitting} onClick={onNext}>
        다음
      </Button>
    </>
  )
}
