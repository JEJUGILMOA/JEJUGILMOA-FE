import { useEffect, useId, useMemo, useState, type ChangeEvent } from 'react'
import { Check, Plus, X } from 'lucide-react'
import type { CompletedTrip, PlaceMemo } from '@/features/records/types'
import {
  addTileStyle,
  checkBadgeStyle,
  emptyHintStyle,
  gridStyle,
  hiddenInput,
  imageButtonStyle,
  photoImageStyle,
  removeButtonStyle,
  tileRecipe,
} from './CoverPhotoPicker.css.ts'

type Candidate = {
  key: string
  file: File
  /** true면 STEP 03에서 직접 업로드한 사진 (삭제 가능) */
  removable: boolean
}

export type CoverPhotoPickerProps = {
  trip: CompletedTrip
  placeMemos: Record<string, PlaceMemo>
  extraPhotos: File[]
  coverPhoto: File | null
  onAddExtraPhotos: (files: File[]) => void
  onRemoveExtraPhoto: (file: File) => void
  onSelectCover: (file: File | null) => void
}

/** STEP 03: 장소별 첨부 사진 + 추가 업로드 사진 중에서 대표(썸네일) 사진 1장을 고른다 */
export function CoverPhotoPicker({
  trip,
  placeMemos,
  extraPhotos,
  coverPhoto,
  onAddExtraPhotos,
  onRemoveExtraPhoto,
  onSelectCover,
}: CoverPhotoPickerProps) {
  const inputId = useId()

  const candidates = useMemo<Candidate[]>(() => {
    const placePhotos = trip.places.flatMap((place) =>
      (placeMemos[place.id]?.photos ?? [])
        // 대표 사진 후보는 새로 첨부한 File만 다룬다 (기존 URL 문자열은 기록 수정 전용 데이터)
        .filter((photo): photo is File => photo instanceof File)
        .map((file, index) => ({
          key: `${place.id}-${index}`,
          file,
          removable: false,
        })),
    )
    const uploaded = extraPhotos.map((file, index) => ({
      key: `extra-${index}`,
      file,
      removable: true,
    }))
    return [...placePhotos, ...uploaded]
  }, [trip.places, placeMemos, extraPhotos])

  // blob URL 생성과 해제를 같은 effect 안에서 짝지어야 한다. 생성을 useMemo로,
  // 해제를 별도 useEffect로 나누면 StrictMode의 마운트 시 setup→cleanup→setup
  // 재실행에서 cleanup이 방금 만든 URL을 즉시 revoke해버려 이미지가 깨진다.
  // (blob URL은 브라우저의 외부 리소스 레지스트리와 동기화하는 것이라 useMemo로
  // 순수하게 파생시킬 수 없다 — effect가 맞는 위치다.)
  const [previewUrls, setPreviewUrls] = useState<Map<File, string>>(new Map())

  useEffect(() => {
    const map = new Map<File, string>()
    candidates.forEach((candidate) => {
      if (!map.has(candidate.file)) map.set(candidate.file, URL.createObjectURL(candidate.file))
    })
    // eslint-disable-next-line react-hooks/set-state-in-effect -- blob URL은 렌더 중 순수하게 파생시킬 수 없는 외부 리소스라, 생성 직후 이 effect 안에서 커밋해야 한다
    setPreviewUrls(map)
    return () => {
      map.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [candidates])

  const handleAdd = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : []
    if (files.length > 0) onAddExtraPhotos(files)
    event.target.value = ''
  }

  const handleRemove = (candidate: Candidate) => {
    if (coverPhoto === candidate.file) onSelectCover(null)
    onRemoveExtraPhoto(candidate.file)
  }

  return (
    <div className={gridStyle}>
      {candidates.length === 0 ? (
        <p className={emptyHintStyle}>아직 첨부된 장소 사진이 없어요. 새로 추가해보세요.</p>
      ) : null}

      {candidates.map((candidate) => {
        const selected = coverPhoto === candidate.file
        return (
          <div key={candidate.key} className={tileRecipe({ selected })}>
            <button
              type="button"
              className={imageButtonStyle}
              aria-pressed={selected}
              aria-label="대표 사진으로 선택"
              onClick={() => onSelectCover(candidate.file)}
            >
              <img className={photoImageStyle} src={previewUrls.get(candidate.file)} alt="" />
            </button>

            {selected ? (
              <span className={checkBadgeStyle}>
                <Check size={12} aria-hidden />
              </span>
            ) : null}

            {candidate.removable ? (
              <button
                type="button"
                className={removeButtonStyle}
                aria-label="사진 삭제"
                onClick={(event) => {
                  event.stopPropagation()
                  handleRemove(candidate)
                }}
              >
                <X size={12} aria-hidden />
              </button>
            ) : null}
          </div>
        )
      })}

      <label htmlFor={inputId} className={addTileStyle} aria-label="사진 추가">
        <input
          id={inputId}
          type="file"
          accept="image/*"
          multiple
          className={hiddenInput}
          onChange={handleAdd}
        />
        <Plus size={20} aria-hidden />
      </label>
    </div>
  )
}
