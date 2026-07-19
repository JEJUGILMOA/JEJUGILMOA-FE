import React from 'react'
import { chipRecipe, iconStyle, removeBtnStyle } from './Chip.css'

interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'SM' | 'MD' | 'LG'
  variant?: 'selected' | 'outline' | 'filled'
  icon?: React.ReactNode
  onRemove?: () => void
  children: React.ReactNode
}

export const Chip = ({
  size = 'MD',
  variant = 'outline',
  icon,
  onRemove,
  children,
  className,
  ...props
}: ChipProps) => {
  return (
    <button className={`${chipRecipe({ size, variant })} ${className || ''}`} {...props}>
      {/* WITH ICON 대응 */}
      {icon && <span className={iconStyle}>{icon}</span>}

      <span>{children}</span>

      {/* REMOVABLE 대응 */}
      {onRemove && (
        <button
          type="button"
          className={removeBtnStyle}
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
        >
          {/* 간결한 고정형 X SVG 아이콘 */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      )}
    </button>
  )
}
