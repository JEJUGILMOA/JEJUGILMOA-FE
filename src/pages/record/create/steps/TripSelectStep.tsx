import { Button } from '@/components/ui/Button/Button'
import { Loading } from '@/components/ui/Loading/Loading'
import { Empty } from '@/components/ui/Empty/Empty'
import { ErrorState } from '@/components/ui/ErrorState/ErrorState'
import type { CompletedTrip } from '@/features/records/types'
import { SelectableOption } from '../components/SelectableOption'
import {
  optionListStyle,
  stepDescriptionStyle,
  stepFooterStyle,
  stepHeaderStyle,
  stepScrollStyle,
  stepShellStyle,
  stepTitleStyle,
} from '../RecordCreatePage.css.ts'

export type TripSelectStepProps = {
  trips: CompletedTrip[]
  isLoading: boolean
  isError?: boolean
  onRetry?: () => void
  /** 이미 기록이 있는 여행 id — 하나당 기록 하나만 남길 수 있어서 선택 못 하게 막는다 */
  recordedTripIds?: Set<string>
  selectedTripId: string | null
  onSelect: (tripId: string) => void
  onNext: () => void
}

/** STEP 01: 기록으로 남길 완료 여행 선택 */
export function TripSelectStep({
  trips,
  isLoading,
  isError = false,
  onRetry,
  recordedTripIds,
  selectedTripId,
  onSelect,
  onNext,
}: TripSelectStepProps) {
  return (
    <div className={stepShellStyle}>
      <div className={stepScrollStyle}>
        <div className={stepHeaderStyle}>
          <h2 className={stepTitleStyle}>{'기록으로 남길\n여행을 선택하세요'}</h2>
          <p className={stepDescriptionStyle}>완료된 여행만 기록으로 남길 수 있어요.</p>
        </div>

        {isLoading ? (
          <Loading label="완료된 여행을 불러오는 중…" />
        ) : isError ? (
          <ErrorState onRetry={onRetry} />
        ) : trips.length === 0 ? (
          <Empty title="완료된 여행이 없어요" description="여행을 마치면 기록을 남길 수 있어요." />
        ) : (
          <div className={optionListStyle} role="radiogroup" aria-label="완료된 여행">
            {trips.map((trip) => {
              const alreadyRecorded = recordedTripIds?.has(trip.id) ?? false
              return (
                <SelectableOption
                  key={trip.id}
                  title={trip.title}
                  description={alreadyRecorded ? '이미 기록을 남겼어요' : trip.dateRangeLabel}
                  selected={trip.id === selectedTripId}
                  onSelect={() => onSelect(trip.id)}
                  disabled={alreadyRecorded}
                />
              )
            })}
          </div>
        )}
      </div>

      <div className={stepFooterStyle}>
        <Button fullWidth size="lg" disabled={!selectedTripId} onClick={onNext}>
          다음
        </Button>
      </div>
    </div>
  )
}
