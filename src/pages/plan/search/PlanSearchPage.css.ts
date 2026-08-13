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

export const sectionStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
})

export const sectionTitleStyle = style({
  margin: 0,
  fontSize: vars.fontSize.md,
  fontWeight: vars.fontWeight.bold,
  letterSpacing: '-0.02em',
  color: colors.text[1],
})

export const chipWrapStyle = style({
  display: 'flex',
  gap: vars.space[2],
  overflowX: 'auto',
  WebkitOverflowScrolling: 'touch',
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  selectors: {
    '&::-webkit-scrollbar': { display: 'none' },
  },
})

export const recentListStyle = style({
  display: 'flex',
  flexDirection: 'column',
  margin: 0,
  padding: 0,
  listStyle: 'none',
})

export const recentItemStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
  minHeight: '44px',
})

export const recentButtonStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[3],
  flex: 1,
  minWidth: 0,
  margin: 0,
  padding: `${vars.space[2]} 0`,
  border: 'none',
  background: 'none',
  fontSize: vars.fontSize.sm,
  color: colors.text[1],
  textAlign: 'left',
  cursor: 'pointer',
})

export const recentIconStyle = style({
  display: 'inline-flex',
  flexShrink: 0,
  color: colors.text[4],
})

export const recentLabelStyle = style({
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const removeButtonStyle = style({
  display: 'inline-flex',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  margin: 0,
  padding: 0,
  border: 'none',
  borderRadius: vars.radius.sm,
  background: 'none',
  color: colors.text[4],
  cursor: 'pointer',
  selectors: {
    '&:hover': { color: colors.text[2], backgroundColor: colors.surface[4] },
  },
})

export const matchStyle = style({
  color: colors.primary[500],
  fontWeight: vars.fontWeight.bold,
})

export const resultIconStyle = style({
  display: 'inline-flex',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
  borderRadius: vars.radius.md,
  backgroundColor: colors.primary[100],
  color: colors.primary[600],
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
