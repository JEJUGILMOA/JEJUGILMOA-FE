import { useState } from 'react'
import { Bookmark, ChevronLeft, ChevronRight, Image } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useDragCarousel } from './useDragCarousel'
import {
  bookmarkActiveStyle,
  bookmarkButtonStyle,
  counterStyle,
  navButtonNextStyle,
  navButtonPrevStyle,
  placeholderStyle,
  slideImageStyle,
  trackStyle,
  wrapStyle,
} from './PhotoCarousel.css.ts'

export type PhotoCarouselProps = {
  photoUrls: string[]
  isBookmarked: boolean
  onToggleBookmark: () => void
}

/** STEP 08.3~4: 대표 사진 캐러셀 + 북마크. 드래그(스와이프)로 사진을 넘길 수 있다 */
export function PhotoCarousel({ photoUrls, isBookmarked, onToggleBookmark }: PhotoCarouselProps) {
  const [index, setIndex] = useState(0)
  const total = photoUrls.length
  const { dragOffset, isDragging, trackHandlers } = useDragCarousel({ total, index, onIndexChange: setIndex })

  return (
    <div className={wrapStyle}>
      {total > 0 ? (
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
      ) : (
        <div className={placeholderStyle}>
          <Image size={28} aria-hidden />
          <span>등록된 사진이 없어요</span>
        </div>
      )}

      <button
        type="button"
        className={cn(bookmarkButtonStyle, isBookmarked && bookmarkActiveStyle)}
        aria-label={isBookmarked ? '저장 취소' : '기록 저장'}
        aria-pressed={isBookmarked}
        onClick={onToggleBookmark}
      >
        <Bookmark size={18} aria-hidden fill={isBookmarked ? 'currentColor' : 'none'} />
      </button>

      {total > 0 ? (
        <span className={counterStyle}>
          {index + 1} / {total}
        </span>
      ) : null}

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
  )
}
