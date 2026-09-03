import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { createPortal } from 'react-dom'
import { useDragCarousel } from './useDragCarousel'
import {
  closeButtonStyle,
  counterStyle,
  navButtonNextStyle,
  navButtonPrevStyle,
  overlayStyle,
  slideImageStyle,
  trackStyle,
  wrapStyle,
} from './PlacePhotoModal.css.ts'

export type PlacePhotoModalProps = {
  photoUrls: string[]
  placeName: string
  onClose: () => void
}

/** 방문 장소 썸네일 클릭 시 그 장소의 사진 전체를 드래그로 넘겨보는 전체화면 팝업 */
export function PlacePhotoModal({ photoUrls, placeName, onClose }: PlacePhotoModalProps) {
  const [index, setIndex] = useState(0)
  const total = photoUrls.length
  const { dragOffset, isDragging, trackHandlers } = useDragCarousel({ total, index, onIndexChange: setIndex })

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
            <img key={`${url}-${i}`} className={slideImageStyle} src={url} alt="" draggable={false} />
          ))}
        </div>

        <button type="button" className={closeButtonStyle} aria-label="닫기" onClick={onClose}>
          <X size={18} aria-hidden />
        </button>

        <span className={counterStyle}>
          {index + 1} / {total}
        </span>

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
