import React from 'react'
import { badgeRecipe } from './Badge.css'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: 'xs' | 'sm' | 'md'
  status?: 'success' | 'info' | 'error' | 'neutral'
  variant?: 'filled' | 'outline'
  children?: React.ReactNode
}

export const Badge = ({
  size = 'sm',
  status = 'success',
  variant = 'filled',
  children,
  className,
  ...props
}: BadgeProps) => {
  const isDot = size === 'xs'

  return (
    <span className={`${badgeRecipe({ size, status, variant })} ${className || ''}`} {...props}>
      {!isDot && children}
    </span>
  )
}
