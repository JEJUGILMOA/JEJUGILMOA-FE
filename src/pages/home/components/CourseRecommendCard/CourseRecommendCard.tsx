import { Bookmark, Clock, Heart, MapPin, Waves } from 'lucide-react'
import { type KeyboardEvent } from 'react'
import { SafeImage } from '@/components/ui/ImagePlaceholder/ImagePlaceholder'
import type { CourseImageTag } from '@/data/mockExplore'
import { cn } from '@/utils/cn'
import {
  bodyStyle,
  bookmarkStyle,
  cardStyle,
  descStyle,
  imageTagListStyle,
  imageTagMoreStyle,
  imageTagRecipe,
  infoStyle,
  locationStyle,
  mediaImageStyle,
  mediaStyle,
  metaDotStyle,
  metaItemStyle,
  metaRowStyle,
  previewMoreStyle,
  previewRowStyle,
  previewSectionStyle,
  previewThumbStyle,
  titleStyle,
} from './CourseRecommendCard.css.ts'

const VISIBLE_PREVIEWS = 3
const VISIBLE_TAGS = 3

export type CoursePreviewStep = {
  title: string
  thumbnailUrl: string
}

export type CourseRecommendCardProps = {
  title: string
  description?: string
  imageUrl?: string
  imageTags?: CourseImageTag[]
  locationLabel?: string
  duration?: string
  placeCount: number
  previewSteps: CoursePreviewStep[]
  /** 즐겨찾기 여부 */
  bookmarked?: boolean
  /** 즐겨찾기 토글 중 */
  isBookmarkPending?: boolean
  onToggleBookmark?: () => void
  onClick?: () => void
  className?: string
}

function ImageTagIcon({ tone }: { tone: CourseImageTag['tone'] }) {
  if (tone === 'pink') return <Heart size={12} strokeWidth={2.5} aria-hidden />
  return <Waves size={12} strokeWidth={2.5} aria-hidden />
}

/**
 * 홈·코스 목록용 추천 코스 카드.
 */
export function CourseRecommendCard({
  title,
  description,
  imageUrl,
  imageTags = [],
  locationLabel,
  duration,
  placeCount,
  previewSteps,
  bookmarked = false,
  isBookmarkPending = false,
  onToggleBookmark,
  onClick,
  className,
}: CourseRecommendCardProps) {
  const isClickable = Boolean(onClick)
  const visiblePreviews = previewSteps.slice(0, VISIBLE_PREVIEWS)
  const extraCount = Math.max(0, previewSteps.length - VISIBLE_PREVIEWS)
  const visibleTags = imageTags.slice(0, VISIBLE_TAGS)
  const extraTagCount = Math.max(0, imageTags.length - VISIBLE_TAGS)

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
      <div className={mediaStyle}>
        <SafeImage src={imageUrl} className={mediaImageStyle} placeholderSize="lg" />
        {visibleTags.length > 0 ? (
          <div className={imageTagListStyle}>
            {visibleTags.map((tag) => (
              <span key={tag.label} className={imageTagRecipe({ tone: tag.tone })}>
                <ImageTagIcon tone={tag.tone} />
                {tag.label}
              </span>
            ))}
            {extraTagCount > 0 ? (
              <span className={imageTagMoreStyle}>+{extraTagCount}개</span>
            ) : null}
          </div>
        ) : null}
        {onToggleBookmark ? (
          <button
            type="button"
            className={bookmarkStyle}
            aria-label={bookmarked ? '즐겨찾기 해제' : '즐겨찾기 추가'}
            aria-pressed={bookmarked}
            disabled={isBookmarkPending}
            onClick={(event) => {
              event.stopPropagation()
              onToggleBookmark()
            }}
          >
            <Bookmark
              size={16}
              strokeWidth={1.75}
              fill={bookmarked ? 'currentColor' : 'none'}
            />
          </button>
        ) : null}
      </div>

      <div className={bodyStyle}>
        <div className={infoStyle}>
          {locationLabel ? (
            <p className={locationStyle}>
              <MapPin size={14} strokeWidth={2.5} aria-hidden />
              {locationLabel}
            </p>
          ) : null}
          <h3 className={titleStyle}>{title}</h3>
          {description ? <p className={descStyle}>{description}</p> : null}

          <div className={metaRowStyle}>
            {duration ? (
              <>
                <span className={metaItemStyle}>
                  <Clock size={14} strokeWidth={2} aria-hidden />
                  {duration}
                </span>
                <span className={metaDotStyle} aria-hidden />
              </>
            ) : null}
            <span className={metaItemStyle}>
              <MapPin size={14} strokeWidth={2} aria-hidden />
              {placeCount}곳
            </span>
          </div>
        </div>

        {visiblePreviews.length > 0 ? (
          <div className={previewSectionStyle}>
            <div className={previewRowStyle}>
              {visiblePreviews.map((step, index) => (
                <SafeImage
                  key={`${step.title}-${index}`}
                  src={step.thumbnailUrl}
                  className={previewThumbStyle}
                  placeholderSize="sm"
                  showPlaceholderLabel={false}
                />
              ))}
              {extraCount > 0 ? (
                <div className={previewMoreStyle}>+{extraCount}</div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </article>
  )
}
