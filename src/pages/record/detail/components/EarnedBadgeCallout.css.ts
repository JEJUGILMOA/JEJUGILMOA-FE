import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const wrapStyle = style({
  marginTop: vars.space[4],
  paddingTop: vars.space[3],
  borderTop: `1px solid ${colors.border[1]}`,
})

export const rowStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space[1],
  border: 'none',
  padding: 0,
  backgroundColor: 'transparent',
  cursor: 'pointer',
})

export const starIconStyle = style({
  color: colors.warning[700],
})

export const badgeTextStyle = style({
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.semibold,
  color: colors.text[3],
})

export const viewAllStyle = style({
  fontSize: vars.fontSize.xs,
  color: colors.text[4],
})
