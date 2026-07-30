import { Button } from '@/components/ui/Button/Button'
import type { CompanionType } from '@/features/plans/types'
import { CompanionCardGrid, type CompanionOption } from '../components/CompanionCard'
import { stepDescriptionStyle, stepHeaderStyle, stepTitleStyle } from '../PlanCreatePage.css.ts'

const COMPANION_OPTIONS: (CompanionOption & { key: CompanionType })[] = [
  { key: 'solo', label: '혼자', description: '나만의 힐링 여행' },
  { key: 'couple', label: '연인과', description: '둘만의 특별한 시간' },
  { key: 'family', label: '가족과', description: '온 가족이 함께' },
  { key: 'friends', label: '친구와', description: '즐거운 우정 여행' },
  { key: 'colleague', label: '동료와', description: '워크샵 & 회식' },
]

export type CompanionStepProps = {
  companionType: CompanionType | null
  onChange: (companionType: CompanionType) => void
  onNext: () => void
}

/** STEP 01-3: 동행 유형 선택 */
export function CompanionStep({ companionType, onChange, onNext }: CompanionStepProps) {
  return (
    <>
      <div className={stepHeaderStyle}>
        <h2 className={stepTitleStyle}>누구와 함께 가시나요?</h2>
        <p className={stepDescriptionStyle}>동행에 맞는 일정을 추천해드릴게요.</p>
      </div>

      <CompanionCardGrid
        options={COMPANION_OPTIONS}
        selectedKey={companionType}
        onSelect={(key) => onChange(key as CompanionType)}
      />

      <Button fullWidth size="lg" disabled={!companionType} onClick={onNext}>
        다음
      </Button>
    </>
  )
}
