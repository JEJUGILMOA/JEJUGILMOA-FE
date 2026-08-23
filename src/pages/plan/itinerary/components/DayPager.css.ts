import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const rootStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space[3],
  height: '40px',
  padding: `0 ${vars.space[3]}`,
  borderRadius: vars.radius.full,
  border: `1px solid ${colors.border[1]}`,
  backgroundColor: colors.surface[1],
})

export const arrowButtonStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '28px',
  height: '28px',
  border: 'none',
  background: 'transparent',
  color: colors.text[2],
  cursor: 'pointer',
  borderRadius: '50%',
  selectors: {
    '&:disabled': { color: colors.text[6], cursor: 'not-allowed' },
  },
})

export const labelStyle = style({
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.bold,
  color: colors.text[1],
  whiteSpace: 'nowrap',
})
