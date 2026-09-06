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

export type CoverPhotoSelectorProps = {
  /** 이번 수정에서 새로 첨부한 사진들 (objectKey를 새로 발급받을 수 있는 File만 후보가 됨) */
  candidates: File[]
  selected: File | null
  onSelect: (file: File | null) => void
}

/**
 * 기록 수정 화면에서 대표(썸네일) 사진을 바꾼다. 서버가 기존 사진의 objectKey를 안 돌려줘서
 * 이번에 새로 첨부한 사진 중에서만 고를 수 있다 — 후보가 없으면 렌더링하지 않는다.
 */
export function CoverPhotoSelector({ candidates, selected, onSelect }: CoverPhotoSelectorProps) {
  const [previewUrls, setPreviewUrls] = useState<Map<File, string>>(new Map())

  useEffect(() => {
    const map = new Map<File, string>()
    candidates.forEach((file) => {
      if (!map.has(file)) map.set(file, URL.createObjectURL(file))
    })
    // eslint-disable-next-line react-hooks/set-state-in-effect -- blob URL은 렌더 중 순수하게 파생시킬 수 없는 외부 리소스라, 생성 직후 이 effect 안에서 커밋해야 한다
    setPreviewUrls(map)
    return () => {
      map.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [candidates])

  if (candidates.length === 0) return null

  return (
    <div>
      <div className={gridStyle}>
        {candidates.map((file, index) => {
          const isSelected = selected === file
          return (
            <div key={`${file.name}-${index}`} className={cn(tileStyle, isSelected && tileSelectedStyle)}>
              <button
                type="button"
                className={imageButtonStyle}
                aria-pressed={isSelected}
                aria-label="대표 사진으로 선택"
                onClick={() => onSelect(isSelected ? null : file)}
              >
                <img className={photoImageStyle} src={previewUrls.get(file)} alt="" />
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
      <p className={hintStyle}>새로 추가한 사진 중에서만 대표 사진으로 바꿀 수 있어요</p>
    </div>
  )
}
