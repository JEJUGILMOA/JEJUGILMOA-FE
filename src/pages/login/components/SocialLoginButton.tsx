import type { ReactNode } from 'react'
import { buttonStyle, contentStyle, iconSlotStyle, labelStyle } from './SocialLoginButton.css.ts'

type Props = {
  label: string
  backgroundColor: string
  textColor: string
  borderColor?: string
  icon: ReactNode
  onClick: () => void
  loading?: boolean
  disabled?: boolean
}

export function SocialLoginButton({
  label,
  backgroundColor,
  textColor,
  borderColor,
  icon,
  onClick,
  loading = false,
  disabled = false,
}: Props) {
  return (
    <button
      type="button"
      className={buttonStyle}
      style={{
        backgroundColor,
        borderColor: borderColor ?? backgroundColor,
        color: textColor,
      }}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading}
    >
      <span className={contentStyle}>
        {loading ? (
          <span>연결 중…</span>
        ) : (
          <>
            <span className={iconSlotStyle}>{icon}</span>
            <span className={labelStyle}>{label}</span>
          </>
        )}
      </span>
    </button>
  )
}
