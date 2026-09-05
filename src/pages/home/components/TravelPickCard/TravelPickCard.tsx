import { Bookmark, Image } from 'lucide-react'
import { type KeyboardEvent, useEffect, useState } from 'react'
import { cn } from '@/utils/cn'
import {
  addressStyle,
  badgeStyle,
  bookmarkStyle,
  cardStyle,
  contentStyle,
  heroImageStyle,
  heroPlaceholderIconStyle,
  heroPlaceholderStyle,
  heroStyle,
  regionStyle,
  titleStyle,
} from './TravelPickCard.css.ts'

export type TravelPickCardProps = {
  title: string
  /** 이미지 좌상단 카테고리 뱃지 */
  category?: string
  /** 짧은 지역 (예: 서귀포시 중문관광로) */
  region?: string
  /** 상세 주소 */
  address?: string
  imageUrl?: string
  onClick?: () => void
  className?: string
}

/**
 * 홈 피드용 관광지 추천 카드.
 */
export function TravelPickCard({
  title,
  category,
  region,
  address,
  imageUrl,
  onClick,
  className,
}: TravelPickCardProps) {
  const [bookmarked, setBookmarked] = useState(false)
  const [imageError, setImageError] = useState(false)
  const isClickable = Boolean(onClick)
  const showPlaceholder = !imageUrl || imageError

  useEffect(() => {
    setImageError(false)
  }, [imageUrl])

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
        {showPlaceholder ? (
          <div className={heroPlaceholderStyle} aria-hidden>
            <Image size={28} className={heroPlaceholderIconStyle} strokeWidth={1.5} />
          </div>
        ) : (
          <img
            src={imageUrl}
            alt=""
            className={heroImageStyle}
            onError={() => setImageError(true)}
          />
        )}
        {category ? <span className={badgeStyle}>{category}</span> : null}
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
            size={16}
            strokeWidth={1.75}
            fill={bookmarked ? 'currentColor' : 'none'}
          />
        </button>
      </div>

      <div className={contentStyle}>
        <h3 className={titleStyle}>{title}</h3>
        {region ? <p className={regionStyle}>{region}</p> : null}
        {address ? <p className={addressStyle}>{address}</p> : null}
      </div>
    </article>
  )
}
