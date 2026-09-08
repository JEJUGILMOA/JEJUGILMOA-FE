import { Clock, Heart, MapPin, Waves } from 'lucide-react'
import { type KeyboardEvent } from 'react'
import type { CourseImageTag } from '@/data/mockExplore'
import { cn } from '@/utils/cn'
import {
  bodyStyle,
  cardStyle,
  descStyle,
  imageTagListStyle,
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
  onClick,
  className,
}: CourseRecommendCardProps) {
  const isClickable = Boolean(onClick)
  const visiblePreviews = previewSteps.slice(0, VISIBLE_PREVIEWS)
  const extraCount = Math.max(0, previewSteps.length - VISIBLE_PREVIEWS)

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
      <div className={mediaStyle}>
        {imageUrl ? <img src={imageUrl} alt="" className={mediaImageStyle} /> : null}
        {imageTags.length > 0 ? (
          <div className={imageTagListStyle}>
            {imageTags.map((tag) => (
              <span key={tag.label} className={imageTagRecipe({ tone: tag.tone })}>
                <ImageTagIcon tone={tag.tone} />
                {tag.label}
              </span>
            ))}
          </div>
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
              {visiblePreviews.map((step, index) =>
                step.thumbnailUrl ? (
                  <img
                    key={`${step.title}-${index}`}
                    src={step.thumbnailUrl}
                    alt=""
                    className={previewThumbStyle}
                  />
                ) : (
                  <div key={`${step.title}-${index}`} className={previewThumbStyle} aria-hidden />
                ),
              )}
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
