import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const pageStyle = style({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100%',
  backgroundColor: colors.surface[1],
  fontFamily: vars.fontFamily.sans,
  color: colors.text[1],
})

export const topBarStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[3],
  padding: `${vars.space[3]} ${vars.space[4]}`,
  paddingTop: `calc(${vars.space[3]} + env(safe-area-inset-top))`,
  backgroundColor: colors.surface[1],
})

export const searchFieldWrapStyle = style({
  flex: 1,
  minWidth: 0,
})

export const cancelButtonStyle = style({
  flexShrink: 0,
  margin: 0,
  padding: `${vars.space[2]} ${vars.space[1]}`,
  border: 'none',
  background: 'none',
  fontFamily: vars.fontFamily.sans,
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.medium,
  color: colors.text[2],
  cursor: 'pointer',
  whiteSpace: 'nowrap',
})

export const bodyStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[6],
  flex: 1,
  padding: `${vars.space[2]} ${vars.space[4]} ${vars.space[6]}`,
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
  fontFamily: vars.fontFamily.sans,
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.regular,
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
    '&:hover': {
      color: colors.text[2],
      backgroundColor: colors.surface[4],
    },
  },
})

export const chipWrapStyle = style({
  display: 'flex',
  gap: vars.space[2],
  overflowX: 'auto',
  WebkitOverflowScrolling: 'touch',
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  selectors: {
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
})

export const resultListStyle = style({
  display: 'flex',
  flexDirection: 'column',
  margin: 0,
  padding: 0,
  listStyle: 'none',
})

export const resultItemStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[3],
  width: '100%',
  margin: 0,
  padding: `${vars.space[3]} 0`,
  border: 'none',
  borderBottom: `1px solid ${colors.border[1]}`,
  background: 'none',
  fontFamily: vars.fontFamily.sans,
  textAlign: 'left',
  cursor: 'pointer',
  selectors: {
    '&:last-child': {
      borderBottom: 'none',
    },
  },
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

export const resultContentStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  flex: 1,
  minWidth: 0,
})

export const resultTitleStyle = style({
  margin: 0,
  fontSize: vars.fontSize.md,
  fontWeight: vars.fontWeight.semibold,
  letterSpacing: '-0.02em',
  color: colors.text[1],
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const matchStyle = style({
  color: colors.primary[500],
  fontWeight: vars.fontWeight.bold,
})

export const resultMetaStyle = style({
  margin: 0,
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.regular,
  color: colors.text[4],
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const resultDistanceStyle = style({
  flexShrink: 0,
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.medium,
  color: colors.text[4],
  whiteSpace: 'nowrap',
})
