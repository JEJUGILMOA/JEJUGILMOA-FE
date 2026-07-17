import { keyframes, style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

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
  color: colors.text[3],
  fontSize: vars.fontSize.sm,
  minHeight: '160px',
})

export const spinnerStyle = style({
  width: '28px',
  height: '28px',
  borderRadius: vars.radius.full,
  border: `3px solid ${colors.border[1]}`,
  borderTopColor: colors.primary[500],
  animation: `${spin} 0.8s linear infinite`,
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
      borderTopColor: colors.primary[500],
    },
  },
})
