import React from 'react'
import { chipRecipe, iconStyle, removeBtnStyle } from './Chip.css'

interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'SM' | 'MD' | 'LG'
  /**
   * 칩의 테마 색상 (기본값: 'neutral')
   * - primary: 선택 시 초록색 배경
   * - neutral: 선택 시 연회색 배경
   */
  colorScheme?: 'primary' | 'primaryLight' | 'neutral'
  /**
   * 칩의 선택 여부
   */
  isSelected?: boolean
  icon?: React.ReactNode
  onRemove?: () => void
  children: React.ReactNode
}

export const Chip = ({
  size = 'MD',
  colorScheme = 'neutral',
  isSelected = false,
  icon,
  onRemove,
  children,
  className,
  ...props
}: ChipProps) => {
  const isRemovable = !!onRemove

  return (
    <button
      type="button"
      className={`${chipRecipe({
        size,
        colorScheme,
        isSelected,
        removable: isRemovable,
      })} ${className || ''}`}
      {...props}
    >
      {icon && <span className={iconStyle}>{icon}</span>}
      <span>{children}</span>
      {isRemovable && (
        <button
          type="button"
          className={removeBtnStyle}
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          aria-label="Remove"
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </button>
  )
}
