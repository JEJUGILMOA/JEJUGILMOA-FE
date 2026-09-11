import { Bookmark } from 'lucide-react'
import { type KeyboardEvent } from 'react'
import { SafeImage } from '@/components/ui/ImagePlaceholder/ImagePlaceholder'
import { cn } from '@/utils/cn'
import {
  addressStyle,
  badgeStyle,
  bookmarkStyle,
  cardStyle,
  contentStyle,
  heroImageStyle,
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
  /** 즐겨찾기 여부 */
  bookmarked?: boolean
  /** 즐겨찾기 토글 중 */
  isBookmarkPending?: boolean
  onToggleBookmark?: () => void
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
  bookmarked = false,
  isBookmarkPending = false,
  onToggleBookmark,
  onClick,
  className,
}: TravelPickCardProps) {
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
        <SafeImage src={imageUrl} className={heroImageStyle} placeholderSize="lg" />
        {category ? <span className={badgeStyle}>{category}</span> : null}
        <button
          type="button"
          className={bookmarkStyle}
          aria-label={bookmarked ? '즐겨찾기 해제' : '즐겨찾기 추가'}
          aria-pressed={bookmarked}
          disabled={isBookmarkPending || !onToggleBookmark}
          onClick={(event) => {
            event.stopPropagation()
            onToggleBookmark?.()
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
