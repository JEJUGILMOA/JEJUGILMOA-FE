import {
  Car,
  ChevronRight,
  Clock,
  Heart,
  MapPin,
  Navigation,
  Waves,
} from 'lucide-react'
import type { CourseImageTag } from '@/data/mockExplore'
import { cn } from '@/utils/cn'
import {
  cardStyle,
  contentStyle,
  ctaButtonStyle,
  descStyle,
  distanceStyle,
  dividerStyle,
  footerStyle,
  imageTagListStyle,
  imageTagRecipe,
  infoStyle,
  locationStyle,
  mainRowStyle,
  mediaImageStyle,
  mediaStyle,
  metaDotStyle,
  metaItemStyle,
  metaRowStyle,
  previewItemStyle,
  previewLabelStyle,
  previewMoreStyle,
  previewRowStyle,
  previewSectionStyle,
  previewThumbStyle,
  previewTitleStyle,
  stepNameStyle,
  stepNumStyle,
  titleStyle,
} from './CourseListCard.css.ts'

const VISIBLE_PREVIEWS = 3

export type CourseListPreviewStep = {
  title: string
  thumbnailUrl: string
}

export type CourseListCardProps = {
  title: string
  description: string
  imageUrl: string
  imageTags: CourseImageTag[]
  locationLabel: string
  duration: string
  placeCount: number
  transport: string
  distanceFromMe: string
  previewSteps: CourseListPreviewStep[]
  onViewClick?: () => void
  className?: string
}

function ImageTagIcon({ tone }: { tone: CourseImageTag['tone'] }) {
  if (tone === 'pink') return <Heart size={11} strokeWidth={2.5} aria-hidden />
  return <Waves size={11} strokeWidth={2.5} aria-hidden />
}

/**
 * 추천 코스 목록(`/courses`)용 가로형 카드.
 * 좌측 이미지 : 우측 텍스트 ≈ 1:2
 */
export function CourseListCard({
  title,
  description,
  imageUrl,
  imageTags,
  locationLabel,
  duration,
  placeCount,
  transport,
  distanceFromMe,
  previewSteps,
  onViewClick,
  className,
}: CourseListCardProps) {
  const visiblePreviews = previewSteps.slice(0, VISIBLE_PREVIEWS)
  const extraCount = Math.max(0, previewSteps.length - VISIBLE_PREVIEWS)

  return (
    <article className={cn(cardStyle, className)}>
      <div className={mainRowStyle}>
        <div className={mediaStyle}>
          <img src={imageUrl} alt="" className={mediaImageStyle} />
          <div className={imageTagListStyle}>
            {imageTags.map((tag) => (
              <span key={tag.label} className={imageTagRecipe({ tone: tag.tone })}>
                <ImageTagIcon tone={tag.tone} />
                {tag.label}
              </span>
            ))}
          </div>
        </div>

        <div className={contentStyle}>
          <div className={infoStyle}>
            <p className={locationStyle}>
              <MapPin size={12} strokeWidth={2.5} aria-hidden />
              {locationLabel}
            </p>
            <h3 className={titleStyle}>{title}</h3>
            <p className={descStyle}>{description}</p>

            <div className={metaRowStyle}>
              <span className={metaItemStyle}>
                <Clock size={12} strokeWidth={2} aria-hidden />
                {duration}
              </span>
              <span className={metaDotStyle} aria-hidden />
              <span className={metaItemStyle}>
                <MapPin size={12} strokeWidth={2} aria-hidden />
                {placeCount}곳
              </span>
              <span className={metaDotStyle} aria-hidden />
              <span className={metaItemStyle}>
                <Car size={12} strokeWidth={2} aria-hidden />
                {transport}
              </span>
            </div>
          </div>

          <div className={dividerStyle} />

          <div className={previewSectionStyle}>
            <h4 className={previewTitleStyle}>코스 미리보기</h4>
            <div className={previewRowStyle}>
              {visiblePreviews.map((step, index) => (
                <div key={`${step.title}-${index}`} className={previewItemStyle}>
                  <img
                    src={step.thumbnailUrl}
                    alt=""
                    className={previewThumbStyle}
                  />
                  <div className={previewLabelStyle}>
                    <span className={stepNumStyle}>{index + 1}</span>
                    <span className={stepNameStyle}>{step.title}</span>
                  </div>
                </div>
              ))}
              {extraCount > 0 ? (
                <div className={previewMoreStyle}>
                  +{extraCount}
                  <br />
                  더보기
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className={footerStyle}>
        <span className={distanceStyle}>
          <Navigation size={14} strokeWidth={2} aria-hidden />
          내 위치에서 {distanceFromMe}
        </span>
        <button type="button" className={ctaButtonStyle} onClick={onViewClick}>
          코스 보기
          <ChevronRight size={14} strokeWidth={2.5} aria-hidden />
        </button>
      </div>
    </article>
  )
}
