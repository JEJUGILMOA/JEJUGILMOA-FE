import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { createPortal } from 'react-dom'
import { SafeImage } from '@/components/ui/ImagePlaceholder/ImagePlaceholder'
import { useDragCarousel } from './useDragCarousel'
import {
  addressTextStyle,
  closeButtonStyle,
  counterStyle,
  infoBarStyle,
  infoTopRowStyle,
  navButtonNextStyle,
  navButtonPrevStyle,
  noteTextStyle,
  overlayStyle,
  placeNameTextStyle,
  slideImageStyle,
  trackStyle,
  wrapStyle,
} from './PlacePhotoModal.css.ts'

export type PlacePhotoModalProps = {
  photoUrls: string[]
  placeName: string
  onClose: () => void
  /** 팝업을 열 때 시작할 사진 인덱스. 기본값 0 */
  initialIndex?: number
  /** 장소 주소. 있으면 하단 정보 바에 같이 보여준다 */
  address?: string
  /** 이 장소에 남긴 메모. 있으면 하단 정보 바에 같이 보여준다 */
  note?: string
}

/** 방문 장소 썸네일 클릭 시 그 장소의 사진과 상세 정보(이름·주소·메모)를 함께 보여주는 전체화면 팝업 */
export function PlacePhotoModal({
  photoUrls,
  placeName,
  onClose,
  initialIndex = 0,
  address,
  note,
}: PlacePhotoModalProps) {
  const [index, setIndex] = useState(initialIndex)
  const total = photoUrls.length
  const { dragOffset, isDragging, trackHandlers } = useDragCarousel({
    total,
    index,
    onIndexChange: setIndex,
    onTap: onClose,
  })

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  if (total === 0) return null

  return createPortal(
    <div className={overlayStyle} role="dialog" aria-modal="true" aria-label={`${placeName} 사진`}>
      <div className={wrapStyle}>
        <div
          className={trackStyle}
          style={{
            transform: `translateX(calc(${-index * 100}% + ${dragOffset}px))`,
            transition: isDragging ? 'none' : undefined,
          }}
          {...trackHandlers}
        >
          {photoUrls.map((url, i) => (
            <SafeImage
              key={`${url}-${i}`}
              src={url}
              className={slideImageStyle}
              placeholderSize="lg"
              fit="contain"
              draggable={false}
            />
          ))}
        </div>

        <button type="button" className={closeButtonStyle} aria-label="닫기" onClick={onClose}>
          <X size={18} aria-hidden />
        </button>

        <div className={infoBarStyle}>
          <div className={infoTopRowStyle}>
            <p className={placeNameTextStyle}>{placeName}</p>
            <span className={counterStyle}>
              {index + 1} / {total}
            </span>
          </div>
          {address ? <p className={addressTextStyle}>{address}</p> : null}
          {note ? <p className={noteTextStyle}>{note}</p> : null}
        </div>

        {index > 0 ? (
          <button
            type="button"
            className={navButtonPrevStyle}
            aria-label="이전 사진"
            onClick={() => setIndex((prev) => prev - 1)}
          >
            <ChevronLeft size={18} aria-hidden />
          </button>
        ) : null}

        {index < total - 1 ? (
          <button
            type="button"
            className={navButtonNextStyle}
            aria-label="다음 사진"
            onClick={() => setIndex((prev) => prev + 1)}
          >
            <ChevronRight size={18} aria-hidden />
          </button>
        ) : null}
      </div>
    </div>,
    document.body,
  )
}
