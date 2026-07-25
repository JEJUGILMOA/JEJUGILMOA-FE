import { Button } from '@/components/ui/Button/Button'
import type { RecordVisibility } from '@/features/records/types'
import { SelectableOption } from '../components/SelectableOption'
import { optionListStyle, stepHeaderStyle, stepTitleStyle } from '../RecordCreatePage.css.ts'

const VISIBILITY_OPTIONS: { value: RecordVisibility; title: string; description: string }[] = [
  { value: 'public', title: '전체 공개', description: '모든 사용자에게 노출됩니다' },
  { value: 'private', title: '비공개', description: '나만 볼 수 있습니다' },
]

export type VisibilityStepProps = {
  visibility: RecordVisibility
  onChange: (visibility: RecordVisibility) => void
  onComplete: () => void
  isSubmitting: boolean
}

/** STEP 04: 공개 범위 설정 및 기록 생성 완료 */
export function VisibilityStep({ visibility, onChange, onComplete, isSubmitting }: VisibilityStepProps) {
  return (
    <>
      <div className={stepHeaderStyle}>
        <h2 className={stepTitleStyle}>{'기록을 공개할 범위를\n선택하세요'}</h2>
      </div>

      <div className={optionListStyle} role="radiogroup" aria-label="공개 범위">
        {VISIBILITY_OPTIONS.map((option) => (
          <SelectableOption
            key={option.value}
            title={option.title}
            description={option.description}
            selected={option.value === visibility}
            onSelect={() => onChange(option.value)}
          />
        ))}
      </div>

      <Button fullWidth size="lg" onClick={onComplete} isLoading={isSubmitting}>
        기록 완료
      </Button>
    </>
  )
}
