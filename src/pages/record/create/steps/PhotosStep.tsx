import { Button } from '@/components/ui/Button/Button'
import type { CompletedTrip, PlaceMemo } from '@/features/records/types'
import { CoverPhotoPicker } from '../components/CoverPhotoPicker'
import { stepDescriptionStyle, stepHeaderStyle, stepTitleStyle } from '../RecordCreatePage.css.ts'

export type PhotosStepProps = {
  trip: CompletedTrip
  placeMemos: Record<string, PlaceMemo>
  extraPhotos: File[]
  coverPhoto: File | null
  onAddExtraPhotos: (files: File[]) => void
  onRemoveExtraPhoto: (file: File) => void
  onSelectCover: (file: File | null) => void
  onNext: () => void
}

/** STEP 03: 장소별 사진 중에서 대표(썸네일) 사진 선택. 부족하면 그때 추가 업로드 */
export function PhotosStep({
  trip,
  placeMemos,
  extraPhotos,
  coverPhoto,
  onAddExtraPhotos,
  onRemoveExtraPhoto,
  onSelectCover,
  onNext,
}: PhotosStepProps) {
  return (
    <>
      <div className={stepHeaderStyle}>
        <h2 className={stepTitleStyle}>대표 사진을 선택하세요</h2>
        <p className={stepDescriptionStyle}>
          이미 첨부한 장소 사진 중에서 골라보세요. 마음에 드는 사진이 없다면 새로 추가할 수 있어요.
        </p>
      </div>

      <CoverPhotoPicker
        trip={trip}
        placeMemos={placeMemos}
        extraPhotos={extraPhotos}
        coverPhoto={coverPhoto}
        onAddExtraPhotos={onAddExtraPhotos}
        onRemoveExtraPhoto={onRemoveExtraPhoto}
        onSelectCover={onSelectCover}
      />

      <Button fullWidth size="lg" disabled={!coverPhoto} onClick={onNext}>
        다음
      </Button>
    </>
  )
}
