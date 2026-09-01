import { Bookmark, Star } from 'lucide-react'
import { type KeyboardEvent, useState } from 'react'
import { cn } from '@/utils/cn'
import {
  badgeStyle,
  bookmarkStyle,
  cardStyle,
  contentStyle,
  descStyle,
  eyebrowStyle,
  heroGradientStyle,
  heroImageStyle,
  heroRatingStyle,
  heroRatingValueStyle,
  heroStyle,
  regionStyle,
  tagStyle,
  tagsStyle,
  titleRowStyle,
  titleStyle,
} from './TravelPickCard.css.ts'

export type TravelPickCardProps = {
  title: string
  eyebrow?: string
  region?: string
  description?: string
  tags?: string[]
  rating?: number
  duration?: string
  badge?: string
  imageUrl?: string
  /** 강조색(태그·eyebrow). 기본 primary */
  accent?: string
  /** 별 아이콘 색 */
  starColor?: string
  onClick?: () => void
  className?: string
}

/**
 * 홈 피드용 관광지 추천 카드.
 * 히어로는 CSS 일러스트 대신 사진 이미지를 사용한다.
 */
export function TravelPickCard({
  title,
  eyebrow,
  region,
  description,
  tags = [],
  rating,
  duration,
  badge,
  imageUrl,
  accent = '#24B95C',
  starColor = '#FFB721',
  onClick,
  className,
}: TravelPickCardProps) {
  const [bookmarked, setBookmarked] = useState(false)
  const isClickable = Boolean(onClick)

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!onClick) return
    if (event.key !== 'Enter' && event.key !== ' ') return

    const target = event.target
    if (target instanceof Element) {
      const interactive = target.closest(
        'a, button, input, select, textarea, [role="button"]',
      )
      if (interactive && interactive !== event.currentTarget) {
        return
      }
    }

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
      <div className={heroStyle}>
        {imageUrl ? <img src={imageUrl} alt="" className={heroImageStyle} /> : null}
        <div className={heroGradientStyle} />
        {badge ? <span className={badgeStyle}>{badge}</span> : null}
        {rating != null || duration ? (
          <div className={heroRatingStyle}>
            {rating != null ? (
              <>
                <Star size={14} fill={starColor} strokeWidth={0} />
                <b className={heroRatingValueStyle}>{rating.toFixed(1)}</b>
              </>
            ) : null}
            {rating != null && duration ? <span>· {duration}</span> : null}
            {rating == null && duration ? <span>{duration}</span> : null}
          </div>
        ) : null}
        <button
          type="button"
          className={bookmarkStyle}
          aria-label={bookmarked ? '북마크 해제' : '북마크'}
          aria-pressed={bookmarked}
          onClick={(event) => {
            event.stopPropagation()
            setBookmarked((prev) => !prev)
          }}
        >
          <Bookmark
            size={14}
            strokeWidth={2}
            fill={bookmarked ? 'currentColor' : 'none'}
          />
        </button>
      </div>

      <div className={contentStyle}>
        {eyebrow ? (
          <p className={eyebrowStyle} style={{ color: accent }}>
            {eyebrow}
          </p>
        ) : null}
        <div className={titleRowStyle}>
          <h3 className={titleStyle}>{title}</h3>
          {region ? <span className={regionStyle}>{region}</span> : null}
        </div>
        {description ? <p className={descStyle}>{description}</p> : null}
        {tags.length > 0 ? (
          <div className={tagsStyle}>
            {tags.map((tag) => (
              <span
                key={tag}
                className={tagStyle}
                style={{
                  color: accent,
                  backgroundColor: `color-mix(in srgb, ${accent} 10%, white)`,
                  borderColor: `color-mix(in srgb, ${accent} 22%, white)`,
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  )
}
