import { skeletonStyle } from './Skeleton.css.ts'
import { cn } from '@/utils/cn'

type SkeletonProps = {
  width?: string | number
  height?: string | number
  className?: string
}

export function Skeleton({ width = '100%', height = 16, className }: SkeletonProps) {
  return (
    <div
      className={cn(skeletonStyle, className)}
      style={{ width, height }}
      aria-hidden
    />
  )
}
