import { Image, Pencil } from 'lucide-react'
import {
  bodyStyle,
  editButtonStyle,
  noteStyle,
  placeNameStyle,
  rowStyle,
  thumbnailImageStyle,
  thumbnailStyle,
} from './EditPlaceMemoRow.css.ts'

export type EditPlaceMemoRowProps = {
  placeName: string
  note: string
  thumbnailUrl: string | null
  onEdit: () => void
}

/** STEP 10.3: 방문 장소별 메모 한 행. 썸네일 + 메모 미리보기 + 연필 아이콘으로 STEP 02b 수정 시트를 연다 */
export function EditPlaceMemoRow({ placeName, note, thumbnailUrl, onEdit }: EditPlaceMemoRowProps) {
  return (
    <div className={rowStyle}>
      <div className={thumbnailStyle}>
        {thumbnailUrl ? (
          <img className={thumbnailImageStyle} src={thumbnailUrl} alt="" />
        ) : (
          <Image size={20} aria-hidden />
        )}
      </div>
      <div className={bodyStyle}>
        <p className={placeNameStyle}>{placeName}</p>
        {note ? <p className={noteStyle}>{note}</p> : null}
      </div>
      <button
        type="button"
        className={editButtonStyle}
        aria-label={`${placeName} 메모 수정`}
        onClick={onEdit}
      >
        <Pencil size={16} aria-hidden />
      </button>
    </div>
  )
}
