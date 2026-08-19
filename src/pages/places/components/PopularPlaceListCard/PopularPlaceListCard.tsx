import { MoreVertical } from 'lucide-react'
import { type KeyboardEvent } from 'react'
import { cn } from '@/utils/cn'
import {
  cardStyle,
  categoryStyle,
  headerRowStyle,
  imagePlaceholderStyle,
  imageRowStyle,
  imageStyle,
  metaStyle,
  moreButtonStyle,
  titleBlockStyle,
  titleRowStyle,
  titleStyle,
} from './PopularPlaceListCard.css.ts'

export type PopularPlaceListCardProps = {
  title: string
  category: string
  distance?: string
  address: string
  imageUrls?: string[]
  onClick?: () => void
  onMoreClick?: () => void
  className?: string
}

/**
 * 인기 관광지 목록용 카드.
 * 장소명·카테고리·거리/주소 + 가로 3장 썸네일.
 */
export function PopularPlaceListCard({
  title,
  category,
  distance,
  address,
  imageUrls = [],
  onClick,
  onMoreClick,
  className,
}: PopularPlaceListCardProps) {
  const isClickable = Boolean(onClick)
  const thumbs = Array.from({ length: 3 }, (_, index) => imageUrls[index])

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!onClick) return
    if (event.key !== 'Enter' && event.key !== ' ') return

    const target = event.target
    if (target instanceof Element) {
      const interactive = target.closest('button, a, input, select, textarea')
      if (interactive && interactive !== event.currentTarget) return
    }

    event.preventDefault()
    onClick()
  }

  const metaText = [distance, address].filter(Boolean).join(' · ')

  return (
    <article
      className={cn(cardStyle, className)}
      data-clickable={isClickable}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      <div className={headerRowStyle}>
        <div className={titleBlockStyle}>
          <div className={titleRowStyle}>
            <h3 className={titleStyle}>{title}</h3>
            <span className={categoryStyle}>{category}</span>
          </div>
          {metaText ? <p className={metaStyle}>{metaText}</p> : null}
        </div>
        <button
          type="button"
          className={moreButtonStyle}
          aria-label="더보기"
          onClick={(event) => {
            event.stopPropagation()
            onMoreClick?.()
          }}
        >
          <MoreVertical size={18} strokeWidth={2} aria-hidden />
        </button>
      </div>

      <div className={imageRowStyle}>
        {thumbs.map((url, index) =>
          url ? (
            <img
              key={`${title}-${index}`}
              src={url}
              alt=""
              className={imageStyle}
            />
          ) : (
            <div
              key={`${title}-placeholder-${index}`}
              className={imagePlaceholderStyle}
              aria-hidden
            />
          ),
        )}
      </div>
    </article>
  )
}
