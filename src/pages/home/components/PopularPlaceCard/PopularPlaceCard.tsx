import { Star } from 'lucide-react'
import { type KeyboardEvent } from 'react'
import { cn } from '@/utils/cn'
import {
  cardStyle,
  contentStyle,
  imageImgStyle,
  imageStyle,
  ratingIconStyle,
  ratingStyle,
  titleStyle,
} from './PopularPlaceCard.css.ts'

export type PopularPlaceCardProps = {
  title: string
  rating: number
  imageUrl?: string
  onClick?: () => void
  className?: string
}

/**
 * 홈 인기 관광지용 카드.
 * 1:1 썸네일 + 장소명 + 평점.
 */
export function PopularPlaceCard({
  title,
  rating,
  imageUrl,
  onClick,
  className,
}: PopularPlaceCardProps) {
  const isClickable = Boolean(onClick)

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!onClick) return
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    onClick()
  }

  return (
    <article
      className={cn(cardStyle, className)}
      data-clickable={isClickable}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      <div className={imageStyle} aria-hidden>
        {imageUrl ? <img src={imageUrl} alt="" className={imageImgStyle} /> : null}
      </div>
      <div className={contentStyle}>
        <h3 className={titleStyle}>{title}</h3>
        <span className={ratingStyle}>
          <Star size={14} className={ratingIconStyle} fill="currentColor" strokeWidth={0} />
          {rating.toFixed(1)}
        </span>
      </div>
    </article>
  )
}
