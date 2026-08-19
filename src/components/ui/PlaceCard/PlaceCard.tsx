import { Star } from 'lucide-react'
import { type KeyboardEvent } from 'react'
import { Badge, type BadgeProps } from '@/components/ui/Badge/Badge'
import { cn } from '@/utils/cn'
import {
  badgesRow,
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

export type PlaceCardBadge = {
  /** 뱃지 텍스트 */
  label: string
  /** Badge status. 기본값 success */
  status?: BadgeProps['status']
  /** Badge variant. 기본값 filled */
  variant?: BadgeProps['variant']
}

export type PlaceCardProps = {
  /** 레이아웃. 기본값 vertical */
  variant?: PlaceCardVariant
  /** 장소명 */
  title: string
  /** 썸네일 이미지 URL */
  imageUrl?: string
  /** 평점 (소수 1자리로 표시) */
  rating?: number
  /** 부가 설명 (카테고리·주소 등) */
  meta?: string
  /** 단일 뱃지 텍스트 (하위 호환). `badges`가 있으면 무시 */
  badge?: string
  /** Badge 컴포넌트로 렌더되는 뱃지 목록 */
  badges?: PlaceCardBadge[]
  /** 거리 표시 (compact에서 우선) */
  distance?: string
  /** 숫자면 px, 문자열은 CSS 값 (`100%`, `12rem` 등) */
  width?: SizeValue
  /** 숫자면 px, 문자열은 CSS 값. `aspectRatio`와 함께 쓰면 한쪽만 지정해도 됨 */
  height?: SizeValue
  /** CSS aspect-ratio (`16/10`, `1`, `"4 / 3"` 등) */
  aspectRatio?: SizeValue
  /** 클릭 핸들러. 있으면 키보드로도 활성화 */
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

/**
 * 장소 썸네일·평점·메타 정보를 보여주는 카드.
 *
 * @example
 * <PlaceCard variant="vertical" title="성산일출봉" rating={4.8} onClick={openDetail} />
 * <PlaceCard
 *   variant="horizontal"
 *   title="협재 해수욕장"
 *   meta="제주 한림읍 · 도보 10분"
 *   badges={[{ label: '무료' }, { label: '4.8', status: 'neutral' }]}
 * />
 */
export function PlaceCard({
  variant = 'vertical',
  title,
  imageUrl,
  rating,
  meta,
  badge,
  badges,
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
  const badgesEl =
    badges && badges.length > 0 ? (
      <div className={badgesRow}>
        {badges.map((item) => (
          <Badge
            key={item.label}
            size="sm"
            status={item.status ?? 'success'}
            variant={item.variant ?? 'filled'}
          >
            {item.label}
          </Badge>
        ))}
      </div>
    ) : badge ? (
      <span className={badgeStyle}>{badge}</span>
    ) : null
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
          {badgesEl}
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
