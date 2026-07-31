import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const chipStyle = style({
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
  minWidth: '148px',
  padding: `${vars.space[3]} ${vars.space[4]}`,
  borderRadius: vars.radius.md,
  border: `1px solid ${colors.border[1]}`,
  backgroundColor: colors.primary[100],
  textAlign: 'left',
  cursor: 'pointer',
})

export const titleStyle = style({
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.bold,
  color: colors.text[1],
})

export const metaStyle = style({
  fontSize: vars.fontSize.xs,
  color: colors.primary[700],
})
