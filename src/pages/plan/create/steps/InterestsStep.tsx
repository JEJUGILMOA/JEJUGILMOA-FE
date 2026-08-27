import { Button } from '@/components/ui/Button/Button'
import { Chip } from '@/components/ui/Chip/Chip'
import type { TravelTheme } from '@/features/plans/types'
import { chipWrapStyle, stepDescriptionStyle, stepHeaderStyle, stepTitleStyle } from '../PlanCreatePage.css.ts'

const TRAVEL_THEME_LABELS: Record<TravelTheme, string> = {
  FOOD: '맛집 탐방',
  NATURE: '자연/힐링',
  ACTIVITY: '액티비티',
  CAFE: '핫플/카페',
  CULTURE: '문화/역사',
  SHOPPING: '쇼핑',
  FESTIVAL: '축제/이벤트',
}

const TRAVEL_THEMES = Object.keys(TRAVEL_THEME_LABELS) as TravelTheme[]

export type InterestsStepProps = {
  interests: TravelTheme[]
  onToggle: (theme: TravelTheme) => void
  onNext: () => void
}

/** STEP 01-6: 관심사(여행 테마) 다중 선택 */
export function InterestsStep({ interests, onToggle, onNext }: InterestsStepProps) {
  return (
    <>
      <div className={stepHeaderStyle}>
        <h2 className={stepTitleStyle}>어떤 여행을 원하시나요?</h2>
        <p className={stepDescriptionStyle}>관심 있는 테마를 모두 골라주세요. (중복 가능)</p>
      </div>

      <div className={chipWrapStyle}>
        {TRAVEL_THEMES.map((theme) => (
          <Chip
            key={theme}
            colorScheme="primary"
            isSelected={interests.includes(theme)}
            onClick={() => onToggle(theme)}
          >
            {TRAVEL_THEME_LABELS[theme]}
          </Chip>
        ))}
      </div>

      <Button
        fullWidth
        size="lg"
        disabled={interests.length === 0}
        onClick={onNext}
      >
        다음
      </Button>
    </>
  )
}
