import React from 'react'
import { chipRecipe, iconStyle, removeBtnStyle } from './Chip.css'

interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'SM' | 'MD' | 'LG'
  variant?: 'selected' | 'outline' | 'filled' | 'primaryLight'
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
  const isRemovable = !!onRemove
  return (
    <button
      className={`${chipRecipe({ size, variant, removable: isRemovable })} ${className || ''}`}
      {...props}
    >
      {/* WITH ICON 대응 */}
      {icon && <span className={iconStyle}>{icon}</span>}

      <span>{children}</span>

      {/* *** [수정] Removable 대응: 회색 동그라미 X 버튼 *** */}
      {isRemovable && (
        <button
          type="button"
          className={removeBtnStyle}
          onClick={(e) => {
            e.stopPropagation() // 칩 클릭 이벤트와 분리
            onRemove()
          }}
          aria-label="Remove"
        >
          {/* 간결한 고정형 X SVG 아이콘 */}
          <svg
            width="14" // 아이콘 자체 크기 (원 배경보다 작게)
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor" // removeBtnStyle의 color 적용
            strokeWidth="2"
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
