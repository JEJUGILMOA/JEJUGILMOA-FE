import { Button } from '@/components/ui/Button/Button'
import { Chip } from '@/components/ui/Chip/Chip'
import type { InterestTheme } from '@/features/plans/types'
import { chipWrapStyle, stepDescriptionStyle, stepHeaderStyle, stepTitleStyle } from '../PlanCreatePage.css.ts'

const INTEREST_THEMES: InterestTheme[] = [
  '맛집 탐방',
  '자연/힐링',
  '액티비티',
  '핫플/카페',
  '문화/역사',
  '쇼핑',
  '사진 명소',
  '축제/이벤트',
]

export type InterestsStepProps = {
  interests: InterestTheme[]
  onToggle: (theme: InterestTheme) => void
  onNext: () => void
  /** 관심사가 마지막 입력 항목이라 '다음'을 누르면 바로 계획을 생성/수정한다 */
  isSubmitting?: boolean
}

/** STEP 01-6: 관심사 다중 선택 (마지막 단계 — 다음을 누르면 바로 계획을 완성한다) */
export function InterestsStep({ interests, onToggle, onNext, isSubmitting }: InterestsStepProps) {
  return (
    <>
      <div className={stepHeaderStyle}>
        <h2 className={stepTitleStyle}>어떤 여행을 원하시나요?</h2>
        <p className={stepDescriptionStyle}>관심 있는 테마를 모두 골라주세요. (중복 가능)</p>
      </div>

      <div className={chipWrapStyle}>
        {INTEREST_THEMES.map((theme) => (
          <Chip
            key={theme}
            colorScheme="primary"
            isSelected={interests.includes(theme)}
            onClick={() => onToggle(theme)}
          >
            {theme}
          </Chip>
        ))}
      </div>

      <Button
        fullWidth
        size="lg"
        disabled={interests.length === 0}
        isLoading={isSubmitting}
        onClick={onNext}
      >
        다음
      </Button>
    </>
  )
}
