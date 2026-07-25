import { Check, ChevronRight } from 'lucide-react'
import { placeNameStyle, rowStyle, statusRecipe } from './PlaceMemoRow.css.ts'

export type PlaceMemoRowProps = {
  placeName: string
  done: boolean
  onClick: () => void
}

/** STEP 02의 방문 장소별 메모 목록 한 행. 작성 여부에 따라 상태 표시가 바뀐다. */
export function PlaceMemoRow({ placeName, done, onClick }: PlaceMemoRowProps) {
  return (
    <button type="button" className={rowStyle} onClick={onClick}>
      <span className={placeNameStyle}>{placeName}</span>
      <span className={statusRecipe({ done })}>
        {done ? (
          <>
            작성완료 <Check size={14} aria-hidden />
          </>
        ) : (
          <>
            메모 작성 <ChevronRight size={14} aria-hidden />
          </>
        )}
      </span>
    </button>
  )
}
