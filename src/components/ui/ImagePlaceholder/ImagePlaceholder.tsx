import { Image } from 'lucide-react'
import { useEffect, useState, type ImgHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'
import {
  labelRecipe,
  placeholderRecipe,
  safeImageContainStyle,
  safeImageCoverStyle,
  safeImageStyle,
  safeImageWrapStyle,
} from './ImagePlaceholder.css.ts'

export type ImagePlaceholderSize = 'sm' | 'md' | 'lg'

const ICON_SIZE: Record<ImagePlaceholderSize, number> = {
  sm: 18,
  md: 24,
  lg: 28,
}

export type ImagePlaceholderProps = {
  className?: string
  size?: ImagePlaceholderSize
  /** 기본값: 이미지가 없어요 */
  label?: string
  showLabel?: boolean
}

/**
 * 콘텐츠 이미지가 없거나 로드에 실패했을 때 쓰는 공통 플레이스홀더.
 */
export function ImagePlaceholder({
  className,
  size = 'md',
  label = '이미지가 없어요',
  showLabel = true,
}: ImagePlaceholderProps) {
  return (
    <div className={cn(placeholderRecipe({ size }), className)} aria-hidden>
      <Image size={ICON_SIZE[size]} strokeWidth={1.5} />
      {showLabel ? <p className={labelRecipe({ size })}>{label}</p> : null}
    </div>
  )
}

export type SafeImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src?: string | null
  /** 이미지가 채워질 래퍼 클래스 */
  className?: string
  /** img 태그 클래스 */
  imageClassName?: string
  placeholderClassName?: string
  placeholderSize?: ImagePlaceholderSize
  placeholderLabel?: string
  showPlaceholderLabel?: boolean
  /** 기본값 cover */
  fit?: 'cover' | 'contain'
}

/**
 * 이미지 URL이 없거나 로드 에러 시 ImagePlaceholder를 보여준다.
 */
export function SafeImage({
  src,
  alt = '',
  className,
  imageClassName,
  placeholderClassName,
  placeholderSize = 'md',
  placeholderLabel,
  showPlaceholderLabel,
  fit = 'cover',
  onError,
  ...imgProps
}: SafeImageProps) {
  const [failed, setFailed] = useState(false)
  const resolvedSrc = src?.trim() || undefined
  const showPlaceholder = !resolvedSrc || failed

  useEffect(() => {
    setFailed(false)
  }, [resolvedSrc])

  if (showPlaceholder) {
    return (
      <ImagePlaceholder
        className={cn(className, placeholderClassName)}
        size={placeholderSize}
        label={placeholderLabel}
        showLabel={showPlaceholderLabel}
      />
    )
  }

  return (
    <div className={cn(safeImageWrapStyle, className)}>
      <img
        {...imgProps}
        src={resolvedSrc}
        alt={alt}
        className={cn(
          safeImageStyle,
          fit === 'contain' ? safeImageContainStyle : safeImageCoverStyle,
          imageClassName,
        )}
        onError={(event) => {
          setFailed(true)
          onError?.(event)
        }}
      />
    </div>
  )
}
