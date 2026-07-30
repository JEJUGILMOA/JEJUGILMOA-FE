import { Button } from '@/components/ui/Button/Button'
import { Chip } from '@/components/ui/Chip/Chip'
import type { DepartureCity } from '@/features/plans/types'
import { chipWrapStyle, stepDescriptionStyle, stepHeaderStyle, stepTitleStyle } from '../PlanCreatePage.css.ts'

const DEPARTURE_CITIES: DepartureCity[] = ['서울', '부산', '대구', '광주', '대전', '청주']

export type DepartureStepProps = {
  departureCity: DepartureCity
  onChange: (city: DepartureCity) => void
  onNext: () => void
}

/** STEP 01-1: 출발지 선택 */
export function DepartureStep({ departureCity, onChange, onNext }: DepartureStepProps) {
  return (
    <>
      <div className={stepHeaderStyle}>
        <h2 className={stepTitleStyle}>어디서 출발하시나요?</h2>
        <p className={stepDescriptionStyle}>제주도까지 가는 출발지를 알려주세요.</p>
      </div>

      <div className={chipWrapStyle} role="radiogroup" aria-label="출발지">
        {DEPARTURE_CITIES.map((city) => (
          <Chip
            key={city}
            colorScheme="primary"
            isSelected={city === departureCity}
            onClick={() => onChange(city)}
          >
            {city}
          </Chip>
        ))}
      </div>

      <Button fullWidth size="lg" onClick={onNext}>
        다음
      </Button>
    </>
  )
}
