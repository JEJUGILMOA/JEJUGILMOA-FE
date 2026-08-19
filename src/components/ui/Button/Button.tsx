import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import { buttonRecipe } from './Button.css.ts'
import { cn } from '@/utils/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** 버튼 스타일. 기본값 primary */
  variant?: ButtonVariant
  /** 크기. 기본값 md */
  size?: ButtonSize
  /** true면 가로 100% */
  fullWidth?: boolean
  /** 로딩 중 비활성 + "처리 중…" 표시 */
  isLoading?: boolean
  children?: ReactNode
}

/**
 * 주요 액션 버튼.
 *
 * @example
 * <Button variant="primary" size="md" onClick={save}>저장</Button>
 */
export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  className,
  children,
  disabled,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonRecipe({ variant, size, fullWidth }), className)}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading ? '처리 중…' : children}
    </button>
  )
}
