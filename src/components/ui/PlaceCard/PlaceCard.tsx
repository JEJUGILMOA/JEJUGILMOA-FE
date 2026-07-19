import { Star } from 'lucide-react'
import { type KeyboardEvent } from 'react'
import { cn } from '@/utils/cn'
import {
  badgeStyle,
  contentRecipe,
  distanceStyle,
  imageRecipe,
  infoColumn,
  metaText,
  placeCardRecipe,
  ratingIcon,
  ratingStyle,
  titleRecipe,
  trailingColumn,
} from './PlaceCard.css.ts'

export type PlaceCardVariant = 'vertical' | 'horizontal' | 'compact'

type SizeValue = number | string

export type PlaceCardProps = {
  variant?: PlaceCardVariant
  title: string
  imageUrl?: string
  rating?: number
  meta?: string
  badge?: string
  distance?: string
  /** 숫자면 px, 문자열은 CSS 값 (`100%`, `12rem` 등) */
  width?: SizeValue
  /** 숫자면 px, 문자열은 CSS 값. `aspectRatio`와 함께 쓰면 한쪽만 지정해도 됨 */
  height?: SizeValue
  /** CSS aspect-ratio (`16/10`, `1`, `"4 / 3"` 등) */
  aspectRatio?: SizeValue
  onClick?: () => void
  className?: string
}

function toCssSize(value: SizeValue | undefined) {
  if (value === undefined) return undefined
  return typeof value === 'number' ? `${value}px` : value
}

function Rating({ value }: { value: number }) {
  return (
    <span className={ratingStyle}>
      <Star size={14} className={ratingIcon} fill="currentColor" strokeWidth={0} />
      {value.toFixed(1)}
    </span>
  )
}

export function PlaceCard({
  variant = 'vertical',
  title,
  imageUrl,
  rating,
  meta,
  badge,
  distance,
  width,
  height,
  aspectRatio,
  onClick,
  className,
}: PlaceCardProps) {
  const isClickable = Boolean(onClick)
  const imageStyle = imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined
  const sizeStyle = {
    width: toCssSize(width),
    height: toCssSize(height),
    aspectRatio: aspectRatio !== undefined ? String(aspectRatio) : undefined,
  }
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!onClick) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onClick()
    }
  }

  const image = (
    <div
      className={imageRecipe({ variant, hasImage: Boolean(imageUrl) })}
      style={imageStyle}
      aria-hidden
    />
  )

  const titleEl = title ? <h3 className={titleRecipe({ variant })}>{title}</h3> : null
  const metaEl = meta ? <span className={metaText}>{meta}</span> : null
  const badgeEl = badge ? <span className={badgeStyle}>{badge}</span> : null
  const ratingEl = rating !== undefined ? <Rating value={rating} /> : null
  const distanceEl = distance ? <span className={distanceStyle}>{distance}</span> : null

  const content =
    variant === 'compact' ? (
      <div className={contentRecipe({ variant })}>
        <div className={infoColumn}>{titleEl}</div>
        {distanceEl || ratingEl ? (
          <div className={trailingColumn}>
            {distanceEl}
            {!distanceEl ? ratingEl : null}
          </div>
        ) : null}
      </div>
    ) : (
      <div className={contentRecipe({ variant })}>
        <div className={infoColumn}>
          {titleEl}
          {metaEl}
          {badgeEl}
        </div>
        {ratingEl}
      </div>
    )

  return (
    <article
      className={cn(placeCardRecipe({ variant }), className)}
      style={sizeStyle}
      data-clickable={isClickable}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      {image}
      {content}
    </article>
  )
}
