import { Button } from '@/components/ui/Button/Button'
import { PhotoGrid } from '../components/PhotoGrid'
import { stepDescriptionStyle, stepHeaderStyle, stepTitleStyle } from '../RecordCreatePage.css.ts'

export type PhotosStepProps = {
  photos: File[]
  onAdd: (files: File[]) => void
  onRemove: (index: number) => void
  onNext: () => void
}

/** STEP 03: 여행 대표 사진 업로드 */
export function PhotosStep({ photos, onAdd, onRemove, onNext }: PhotosStepProps) {
  return (
    <>
      <div className={stepHeaderStyle}>
        <h2 className={stepTitleStyle}>여행 사진을 업로드하세요</h2>
        <p className={stepDescriptionStyle}>첫 번째 사진은 기록 카드의 썸네일로 사용돼요.</p>
      </div>

      <PhotoGrid photos={photos} onAdd={onAdd} onRemove={onRemove} addLabel="여행 사진 추가" />

      <Button fullWidth size="lg" disabled={photos.length === 0} onClick={onNext}>
        다음
      </Button>
    </>
  )
}
