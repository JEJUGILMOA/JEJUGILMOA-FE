import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/utils/cn'
import {
  checkBadgeStyle,
  gridStyle,
  hintStyle,
  imageButtonStyle,
  photoImageStyle,
  tileSelectedStyle,
  tileStyle,
} from './CoverPhotoSelector.css.ts'

// blob URL 생성·해제를 같은 effect 안에서 짝짓는다 (PhotoGrid의 usePhotoPreviewUrls와 동일한 이유 —
// StrictMode 재실행 시 cleanup이 방금 만든 URL을 revoke해버리는 걸 막기 위해 effect 안에서 커밋)
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

export type CoverPhotoSelectorProps = {
  /** "사진" 섹션에 지금 보이는 모든 사진(새로 첨부한 File + 기존 사진 URL) */
  candidates: (File | string)[]
  selected: File | string | null
  onSelect: (photo: File | string | null) => void
}

/** 기록 수정 화면에서 대표(썸네일) 사진을 바꾼다. 새 사진·기존 사진 둘 다 고를 수 있다 */
export function CoverPhotoSelector({ candidates, selected, onSelect }: CoverPhotoSelectorProps) {
  const previewUrls = usePhotoPreviewUrls(candidates)

  if (candidates.length === 0) return null

  return (
    <div>
      <div className={gridStyle}>
        {candidates.map((photo, index) => {
          const isSelected = selected === photo
          return (
            <div key={photoKey(photo, index)} className={cn(tileStyle, isSelected && tileSelectedStyle)}>
              <button
                type="button"
                className={imageButtonStyle}
                aria-pressed={isSelected}
                aria-label="대표 사진으로 선택"
                onClick={() => onSelect(isSelected ? null : photo)}
              >
                <img className={photoImageStyle} src={previewUrls[index]} alt="" />
              </button>
              {isSelected ? (
                <span className={checkBadgeStyle}>
                  <Check size={12} aria-hidden />
                </span>
              ) : null}
            </div>
          )
        })}
      </div>
      <p className={hintStyle}>탭해서 대표 사진을 바꿀 수 있어요</p>
    </div>
  )
}
