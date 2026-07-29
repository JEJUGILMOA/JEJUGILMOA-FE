import { useEffect, useId, useMemo, type ChangeEvent } from 'react'
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
      (placeMemos[place.id]?.photos ?? []).map((file, index) => ({
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

  const previewUrls = useMemo(() => {
    const map = new Map<File, string>()
    candidates.forEach((candidate) => {
      if (!map.has(candidate.file)) map.set(candidate.file, URL.createObjectURL(candidate.file))
    })
    return map
  }, [candidates])

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [previewUrls])

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
