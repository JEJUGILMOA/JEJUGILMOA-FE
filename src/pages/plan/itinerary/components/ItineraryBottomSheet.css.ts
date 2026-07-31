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
  height: '100%',
  maxHeight: '92dvh',
  outline: 'none',
  borderTopLeftRadius: vars.radius.xl,
  borderTopRightRadius: vars.radius.xl,
  backgroundColor: colors.surface[1],
  boxShadow: '0 -8px 24px rgba(0, 0, 0, 0.14)',
})

export const handleStyle = style({
  width: '40px',
  height: '4px',
  flexShrink: 0,
  marginTop: vars.space[3],
  marginBottom: vars.space[2],
  marginInline: 'auto',
  borderRadius: vars.radius.full,
  backgroundColor: colors.border[1],
})

export const titleStyle = style({
  flexShrink: 0,
  paddingInline: vars.space[4],
  fontSize: vars.fontSize.md,
  fontWeight: vars.fontWeight.bold,
  color: colors.text[1],
})

export const bodyStyle = style({
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[4],
  padding: vars.space[4],
  paddingTop: vars.space[3],
  paddingBottom: `calc(${vars.space[6]} + env(safe-area-inset-bottom))`,
})
