import { type ReactNode } from 'react'
import { Button, type ButtonProps, type ButtonSize } from '@/components/ui/Button/Button'
import { buttonIconClass, buttonIconStyle } from '@/components/ui/Button/Button.css.ts'
import { cn } from '@/utils/cn'

export type IconButtonProps = ButtonProps & {
  /** 버튼 텍스트 왼쪽 아이콘 */
  leftIcon?: ReactNode
  /** 버튼 텍스트 오른쪽 아이콘 */
  rightIcon?: ReactNode
}

function IconSlot({
  children,
  size,
}: {
  children: ReactNode
  size: ButtonSize
}) {
  return (
    <span className={cn(buttonIconStyle({ size }), buttonIconClass)}>{children}</span>
  )
}

/**
 * 좌·우 아이콘을 붙일 수 있는 버튼. Button props를 그대로 받습니다.
 *
 * @example
 * <IconButton leftIcon={<Search />} onClick={openSearch}>검색</IconButton>
 */
export function IconButton({
  leftIcon,
  rightIcon,
  children,
  size = 'md',
  className,
  ...props
}: IconButtonProps) {
  return (
    <Button size={size} className={cn(className)} {...props}>
      {leftIcon ? <IconSlot size={size}>{leftIcon}</IconSlot> : null}
      {children}
      {rightIcon ? <IconSlot size={size}>{rightIcon}</IconSlot> : null}
    </Button>
  )
}
