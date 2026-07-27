import { useState } from 'react'
import { Button } from '@/components/ui/Button/Button'
import { TextField } from '@/components/ui/TextField/TextField'
import { BottomSheet } from '@/components/ui/BottomSheet/BottomSheet'
import type { CompletedTrip, PlaceMemo } from '@/features/records/types'
import { PlaceMemoRow } from '../components/PlaceMemoRow'
import { PlaceMemoSheet } from '../components/PlaceMemoSheet'
import { fieldGroupStyle, placeMemoListStyle, sectionLabelStyle } from '../RecordCreatePage.css.ts'

const EMPTY_MEMO: PlaceMemo = { note: '', photos: [] }

export type DetailsStepProps = {
  trip: CompletedTrip
  title: string
  summary: string
  placeMemos: Record<string, PlaceMemo>
  onTitleChange: (value: string) => void
  onSummaryChange: (value: string) => void
  onSaveMemo: (placeId: string, memo: PlaceMemo) => void
  onNext: () => void
}

/** STEP 02: 기록 제목 · 한줄 소개 · 장소별 메모 작성 (STEP 02b는 바텀시트로 연결) */
export function DetailsStep({
  trip,
  title,
  summary,
  placeMemos,
  onTitleChange,
  onSummaryChange,
  onSaveMemo,
  onNext,
}: DetailsStepProps) {
  const [activePlaceId, setActivePlaceId] = useState<string | null>(null)
  const activePlace = trip.places.find((place) => place.id === activePlaceId) ?? null

  // 닫힘 애니메이션 중 시트 내용이 먼저 사라지지 않도록 마지막으로 연 장소를 유지
  const [renderedPlace, setRenderedPlace] = useState(activePlace)
  if (activePlace && activePlace !== renderedPlace) {
    setRenderedPlace(activePlace)
  }

  const canProceed = title.trim().length > 0 && summary.trim().length > 0

  return (
    <>
      <div className={fieldGroupStyle}>
        <TextField label="기록 제목" value={title} onChange={onTitleChange} maxLength={30} showCount />
        <TextField
          label="한줄 소개"
          value={summary}
          onChange={onSummaryChange}
          placeholder="이 여행을 한 줄로 표현해보세요"
          maxLength={50}
          showCount
        />

        <div>
          <span className={sectionLabelStyle}>방문 장소별 메모</span>
          <div className={placeMemoListStyle}>
            {trip.places.map((place) => (
              <PlaceMemoRow
                key={place.id}
                placeName={place.name}
                done={Boolean(placeMemos[place.id]?.note || placeMemos[place.id]?.photos.length)}
                onClick={() => setActivePlaceId(place.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <Button fullWidth size="lg" disabled={!canProceed} onClick={onNext}>
        다음
      </Button>

      <BottomSheet
        open={activePlaceId !== null}
        onOpenChange={(open) => {
          if (!open) setActivePlaceId(null)
        }}
        minHeight={0.75}
        initialHeight={0.75}
        maxHeight={0.75}
      >
        {renderedPlace ? (
          <PlaceMemoSheet
            key={renderedPlace.id}
            placeName={renderedPlace.name}
            initialMemo={placeMemos[renderedPlace.id] ?? EMPTY_MEMO}
            onSave={(memo) => {
              onSaveMemo(renderedPlace.id, memo)
              setActivePlaceId(null)
            }}
          />
        ) : null}
      </BottomSheet>
    </>
  )
}
