import { type ReactNode } from 'react'
import { Button, type ButtonProps, type ButtonSize } from '@/components/ui/Button/Button'
import { buttonIconClass, buttonIconStyle } from '@/components/ui/Button/Button.css.ts'
import { cn } from '@/utils/cn'

export type IconButtonProps = ButtonProps & {
  leftIcon?: ReactNode
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
