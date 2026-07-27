import { useEffect, useId, useMemo, type ChangeEvent } from 'react'
import { Plus, X } from 'lucide-react'
import {
  addRowStyle,
  addTileStyle,
  compactPhotoRowStyle,
  compactPhotoTileStyle,
  compactWrapStyle,
  gridStyle,
  hiddenInput,
  photoImageStyle,
  photoTileStyle,
  removeButtonStyle,
} from './PhotoGrid.css.ts'

function usePhotoPreviewUrls(photos: File[]) {
  const urls = useMemo(() => photos.map((file) => URL.createObjectURL(file)), [photos])

  useEffect(() => {
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [urls])

  return urls
}

export type PhotoGridProps = {
  photos: File[]
  onAdd: (files: File[]) => void
  onRemove: (index: number) => void
  /** "+" 타일에 표시할 안내 문구 */
  addLabel?: string
  /** true면 정사각형 그리드 대신 가로로 넓은 한 줄 추가 버튼으로 표시 */
  compact?: boolean
}

/** 사진 추가 타일 + 선택된 사진 썸네일 그리드 (STEP 03 여행 사진, STEP 02b 장소별 사진 첨부에서 공용) */
export function PhotoGrid({ photos, onAdd, onRemove, addLabel, compact = false }: PhotoGridProps) {
  const inputId = useId()
  const previewUrls = usePhotoPreviewUrls(photos)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : []
    if (files.length > 0) onAdd(files)
    event.target.value = ''
  }

  const fileInput = (
    <input
      id={inputId}
      type="file"
      accept="image/*"
      multiple
      className={hiddenInput}
      onChange={handleChange}
    />
  )

  if (compact) {
    return (
      <div className={compactWrapStyle}>
        <label htmlFor={inputId} className={addRowStyle}>
          {fileInput}
          <Plus size={16} aria-hidden />
          <span>{addLabel ?? '사진 추가'}</span>
        </label>

        {photos.length > 0 ? (
          <div className={compactPhotoRowStyle}>
            {photos.map((photo, index) => (
              <div key={`${photo.name}-${index}`} className={compactPhotoTileStyle}>
                <img className={photoImageStyle} src={previewUrls[index]} alt="" />
                <button
                  type="button"
                  className={removeButtonStyle}
                  aria-label="사진 삭제"
                  onClick={() => onRemove(index)}
                >
                  <X size={12} aria-hidden />
                </button>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <div className={gridStyle}>
      <label htmlFor={inputId} className={addTileStyle} aria-label={addLabel ?? '사진 추가'}>
        {fileInput}
        <Plus size={20} aria-hidden />
      </label>

      {photos.map((photo, index) => (
        <div key={`${photo.name}-${index}`} className={photoTileStyle}>
          <img className={photoImageStyle} src={previewUrls[index]} alt="" />
          <button
            type="button"
            className={removeButtonStyle}
            aria-label="사진 삭제"
            onClick={() => onRemove(index)}
          >
            <X size={12} aria-hidden />
          </button>
        </div>
      ))}
    </div>
  )
}
