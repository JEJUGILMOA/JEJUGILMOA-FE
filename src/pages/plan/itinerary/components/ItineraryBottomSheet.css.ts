import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const contentStyle = style({
  position: 'fixed',
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: vars.zIndex.modal,
  display: 'flex',
  flexDirection: 'column',
  outline: 'none',
  borderTopLeftRadius: vars.radius.xl,
  borderTopRightRadius: vars.radius.xl,
  backgroundColor: colors.surface[1],
  boxShadow: '0 -8px 24px rgba(0, 0, 0, 0.14)',
})

export const handleWrapStyle = style({
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.space[2],
  padding: `${vars.space[2]} ${vars.space[4]} ${vars.space[3]}`,
  cursor: 'grab',
  touchAction: 'none',
  userSelect: 'none',
  selectors: {
    '&:active': { cursor: 'grabbing' },
  },
})

export const handleStyle = style({
  width: '40px',
  height: '4px',
  flexShrink: 0,
  borderRadius: vars.radius.full,
  backgroundColor: colors.border[1],
})

export const titleStyle = style({
  alignSelf: 'flex-start',
  fontSize: vars.fontSize.md,
  fontWeight: vars.fontWeight.bold,
  color: colors.text[1],
})

export const bodyStyle = style({
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  WebkitOverflowScrolling: 'touch',
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[4],
  padding: vars.space[4],
  paddingTop: vars.space[2],
  paddingBottom: `calc(${vars.space[6]} + env(safe-area-inset-bottom))`,
})
