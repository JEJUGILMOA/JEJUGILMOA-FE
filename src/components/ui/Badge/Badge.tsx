import React from 'react'
import { badgeRecipe } from './Badge.css'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: 'Xsmall' | 'small' | 'Medium'
  status?: 'success' | 'info' | 'error' | 'neutral'
  variant?: 'filled' | 'outline'
  children?: React.ReactNode
}

export const Badge = ({
  size = 'small',
  status = 'success',
  variant = 'filled',
  children,
  className,
  ...props
}: BadgeProps) => {
  const isDot = size === 'Xsmall'

  return (
    <span className={`${badgeRecipe({ size, status, variant })} ${className || ''}`} {...props}>
      {!isDot && children}
    </span>
  )
}
