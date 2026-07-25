import { useState } from 'react'
import { Button } from '@/components/ui/Button/Button'
import { TextArea } from '@/components/ui/TextArea/TextArea'
import type { PlaceMemo } from '@/features/records/types'
import { PhotoGrid } from './PhotoGrid'
import { placeNameStyle, sheetBody } from './PlaceMemoSheet.css.ts'

export type PlaceMemoSheetProps = {
  placeName: string
  initialMemo: PlaceMemo
  onSave: (memo: PlaceMemo) => void
}

/** STEP 02b: 장소별 감상·팁·사진을 작성하는 바텀시트 본문 */
export function PlaceMemoSheet({ placeName, initialMemo, onSave }: PlaceMemoSheetProps) {
  const [note, setNote] = useState(initialMemo.note)
  const [photos, setPhotos] = useState(initialMemo.photos)

  return (
    <div className={sheetBody}>
      <p className={placeNameStyle}>{placeName}</p>
      <TextArea
        value={note}
        onChange={setNote}
        maxLength={300}
        placeholder="이 장소에서의 감상과 팁을 남겨보세요"
      />
      <PhotoGrid
        photos={photos}
        addLabel="사진 첨부"
        onAdd={(files) => setPhotos((prev) => [...prev, ...files])}
        onRemove={(index) => setPhotos((prev) => prev.filter((_, i) => i !== index))}
      />
      <Button fullWidth onClick={() => onSave({ note, photos })}>
        저장
      </Button>
    </div>
  )
}
