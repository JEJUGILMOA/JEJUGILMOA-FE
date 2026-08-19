import { skeletonStyle } from './Skeleton.css.ts'
import { cn } from '@/utils/cn'

type SkeletonProps = {
  /** 너비 (px 숫자 또는 CSS 문자열). 기본값 100% */
  width?: string | number
  /** 높이 (px 숫자 또는 CSS 문자열). 기본값 16 */
  height?: string | number
  className?: string
}

/**
 * 콘텐츠 로딩 자리를 표시하는 스켈레톤 플레이스홀더.
 *
 * @example
 * <Skeleton width="100%" height={24} />
 */
export function Skeleton({ width = '100%', height = 16, className }: SkeletonProps) {
  return (
    <div
      className={cn(skeletonStyle, className)}
      style={{ width, height }}
      aria-hidden
    />
  )
}
