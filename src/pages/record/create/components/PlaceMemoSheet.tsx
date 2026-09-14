import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/Button/Button'
import { TextArea } from '@/components/ui/TextArea/TextArea'
import type { PlaceMemo } from '@/features/records/types'
import { PhotoGrid } from './PhotoGrid'
import { footerStyle, placeNameStyle, scrollArea, sheetBody } from './PlaceMemoSheet.css.ts'

export type PlaceMemoSheetProps = {
  placeName: string
  initialMemo: PlaceMemo
  onSave: (memo: PlaceMemo) => void
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  return target.tagName === 'TEXTAREA' || target.tagName === 'INPUT' || target.isContentEditable
}

/** STEP 02b: 장소별 감상·팁·사진을 작성하는 바텀시트 본문 */
export function PlaceMemoSheet({ placeName, initialMemo, onSave }: PlaceMemoSheetProps) {
  const [note, setNote] = useState(initialMemo.note)
  const [photos, setPhotos] = useState(initialMemo.photos)
  const rootRef = useRef<HTMLDivElement>(null)

  // 입력 포커스 중일 때만 키보드 inset 적용 (브라우저 크롬 차이로 버튼이 사라지는 것 방지)
  useEffect(() => {
    const root = rootRef.current
    const vv = window.visualViewport
    if (!root || !vv) return

    const clearInset = () => {
      root.style.setProperty('--sheet-keyboard-inset', '0px')
    }

    const updateInset = () => {
      if (!root.contains(document.activeElement) || !isEditableTarget(document.activeElement)) {
        clearInset()
        return
      }
      const inset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop)
      root.style.setProperty('--sheet-keyboard-inset', `${inset}px`)
    }

    clearInset()
    vv.addEventListener('resize', updateInset)
    vv.addEventListener('scroll', updateInset)
    root.addEventListener('focusin', updateInset)
    root.addEventListener('focusout', clearInset)
    return () => {
      vv.removeEventListener('resize', updateInset)
      vv.removeEventListener('scroll', updateInset)
      root.removeEventListener('focusin', updateInset)
      root.removeEventListener('focusout', clearInset)
      root.style.removeProperty('--sheet-keyboard-inset')
    }
  }, [])

  return (
    <div ref={rootRef} className={sheetBody}>
      <div className={scrollArea}>
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
          compact
          onAdd={(files) => setPhotos((prev) => [...prev, ...files])}
          onRemove={(index) => setPhotos((prev) => prev.filter((_, i) => i !== index))}
        />
      </div>
      <div className={footerStyle}>
        <Button fullWidth onClick={() => onSave({ note, photos })}>
          저장
        </Button>
      </div>
    </div>
  )
}
