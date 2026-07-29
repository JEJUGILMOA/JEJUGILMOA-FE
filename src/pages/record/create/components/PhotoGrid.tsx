import { useEffect, useId, useState, type ChangeEvent } from 'react'
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

// blob URL 생성과 해제를 같은 effect 안에서 짝지어야 한다. 생성을 useMemo로,
// 해제를 별도 useEffect로 나누면 StrictMode의 마운트 시 setup→cleanup→setup
// 재실행에서 cleanup이 방금 만든 URL을 즉시 revoke해버려 이미지가 깨진다.
// photos에는 새로 첨부한 File 외에 기록 수정에서 프리필한 기존 사진 URL(string)도
// 섞여 들어올 수 있는데, 이 훅이 만들지 않은 URL을 revoke하면 그 URL을 쓰는 다른
// 화면(기록 상세 등)의 이미지가 깨지므로 File에서 새로 만든 URL만 해제한다.
function usePhotoPreviewUrls(photos: (File | string)[]) {
  const [urls, setUrls] = useState<string[]>([])

  useEffect(() => {
    const createdUrls: string[] = []
    const nextUrls = photos.map((photo) => {
      if (typeof photo === 'string') return photo
      const url = URL.createObjectURL(photo)
      createdUrls.push(url)
      return url
    })
    // eslint-disable-next-line react-hooks/set-state-in-effect -- blob URL은 렌더 중 순수하게 파생시킬 수 없는 외부 리소스라, 생성 직후 이 effect 안에서 커밋해야 한다
    setUrls(nextUrls)
    return () => {
      createdUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [photos])

  return urls
}

function photoKey(photo: File | string, index: number) {
  return `${typeof photo === 'string' ? photo : photo.name}-${index}`
}

export type PhotoGridProps = {
  /** File은 새로 첨부한 사진, string은 이미 저장된 사진의 URL (기록 수정 프리필용) */
  photos: (File | string)[]
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
              <div key={photoKey(photo, index)} className={compactPhotoTileStyle}>
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
        <div key={photoKey(photo, index)} className={photoTileStyle}>
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
