import { keyframes, style } from '@vanilla-extract/css'
import { vars } from '@/styles/theme.css.ts'

const spin = keyframes({
  to: { transform: 'rotate(360deg)' },
})

export const loadingStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space[3],
  padding: vars.space[8],
  color: vars.color.textMuted,
  fontSize: vars.fontSize.sm,
  minHeight: '160px',
})

export const spinnerStyle = style({
  width: '28px',
  height: '28px',
  borderRadius: vars.radius.full,
  border: `3px solid ${vars.color.border}`,
  borderTopColor: vars.color.brand,
  animation: `${spin} 0.8s linear infinite`,
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
      borderTopColor: vars.color.brand,
    },
  },
})
