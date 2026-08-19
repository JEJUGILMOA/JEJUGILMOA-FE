import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const listStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[5],
})

export const dayRowStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
})

export const dayHeaderStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
})

export const dayBadgeStyle = style({
  display: 'inline-flex',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  width: '22px',
  height: '22px',
  borderRadius: vars.radius.full,
  backgroundColor: colors.primary[500],
  color: colors.text[5],
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.semibold,
})

export const dayLabelStyle = style({
  fontSize: vars.fontSize.md,
  fontWeight: vars.fontWeight.semibold,
  color: colors.text[1],
})

export const dayDateStyle = style({
  fontSize: vars.fontSize.sm,
  color: colors.text[4],
})

export const itemListStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
  paddingLeft: vars.space[8],
})

export const itemRowStyle = style({
  display: 'flex',
  gap: vars.space[3],
  fontSize: vars.fontSize.sm,
})

export const itemTimeStyle = style({
  flexShrink: 0,
  width: '44px',
  color: colors.text[4],
})

export const itemActivityStyle = style({
  color: colors.text[2],
})
