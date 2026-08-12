import { Button } from '@/components/ui/Button/Button'
import { Chip } from '@/components/ui/Chip/Chip'
import type { TransportMode } from '@/features/plans/types'
import {
  chipWrapStyle,
  stepDescriptionStyle,
  stepHeaderStyle,
  stepTitleStyle,
  timeFieldGroupStyle,
  timeRowLabelStyle,
  timeRowStyle,
} from '../PlanCreatePage.css.ts'
import { TimeField } from '@/pages/plan/itinerary/components/TimeField'

const TRANSPORT_MODES: TransportMode[] = ['배', '비행기']

export type TransportStepProps = {
  transportMode: TransportMode
  arrivalTime: string
  departureTime: string
  onChangeTransportMode: (mode: TransportMode) => void
  onChangeArrivalTime: (time: string) => void
  onChangeDepartureTime: (time: string) => void
  onNext: () => void
}

/** STEP 01-1: 제주도까지 이용할 교통편과 도착·출발 시각 선택 */
export function TransportStep({
  transportMode,
  arrivalTime,
  departureTime,
  onChangeTransportMode,
  onChangeArrivalTime,
  onChangeDepartureTime,
  onNext,
}: TransportStepProps) {
  return (
    <>
      <div className={stepHeaderStyle}>
        <h2 className={stepTitleStyle}>제주도까지 어떻게 오세요?</h2>
        <p className={stepDescriptionStyle}>이용하실 교통편과 시각을 알려주세요.</p>
      </div>

      <div className={chipWrapStyle} role="radiogroup" aria-label="교통편">
        {TRANSPORT_MODES.map((mode) => (
          <Chip
            key={mode}
            colorScheme="primary"
            isSelected={mode === transportMode}
            onClick={() => onChangeTransportMode(mode)}
          >
            {mode}
          </Chip>
        ))}
      </div>

      <div className={timeFieldGroupStyle}>
        <div className={timeRowStyle}>
          <span className={timeRowLabelStyle}>도착 시각</span>
          <TimeField value={arrivalTime} onChange={onChangeArrivalTime} label="도착 시각" />
        </div>
        <div className={timeRowStyle}>
          <span className={timeRowLabelStyle}>출발(귀항) 시각</span>
          <TimeField value={departureTime} onChange={onChangeDepartureTime} label="출발 시각" />
        </div>
      </div>

      <Button fullWidth size="lg" onClick={onNext}>
        다음
      </Button>
    </>
  )
}
