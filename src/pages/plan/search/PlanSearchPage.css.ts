import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const pageStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[4],
  paddingBottom: vars.space[8],
})

export const topBarStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[3],
})

export const searchBarGrowStyle = style({
  flex: 1,
})

export const doneLinkStyle = style({
  flexShrink: 0,
  border: 'none',
  background: 'transparent',
  padding: 0,
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.semibold,
  color: colors.primary[500],
  cursor: 'pointer',
  whiteSpace: 'nowrap',
})

export const listStyle = style({
  display: 'flex',
  flexDirection: 'column',
})

export const rowStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[3],
  padding: `${vars.space[3]} 0`,
  borderBottom: `1px solid ${colors.border[1]}`,
})

export const infoColumnStyle = style({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
})

export const rowTitleStyle = style({
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.bold,
  color: colors.text[1],
})

export const rowAddressStyle = style({
  fontSize: vars.fontSize.xs,
  color: colors.text[4],
})

export const addLinkStyle = style({
  flexShrink: 0,
  border: 'none',
  background: 'transparent',
  padding: 0,
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.semibold,
  color: colors.primary[500],
  cursor: 'pointer',
})

export const addedLinkStyle = style({
  flexShrink: 0,
  border: 'none',
  background: 'transparent',
  padding: 0,
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.semibold,
  color: colors.text[4],
  cursor: 'pointer',
})

export const emptyStateStyle = style({
  padding: `${vars.space[8]} 0`,
  textAlign: 'center',
  fontSize: vars.fontSize.sm,
  color: colors.text[4],
})
