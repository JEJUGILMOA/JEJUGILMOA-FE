import { style } from '@vanilla-extract/css'
import { vars } from '@/styles/theme.css.ts'

export const overlayStyle = style({
  position: 'fixed',
  inset: 0,
  zIndex: vars.zIndex.overlay,
  backgroundColor: vars.color.overlay,
})

export const contentStyle = style({
  position: 'fixed',
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: vars.zIndex.modal,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
  maxHeight: '85dvh',
  padding: vars.space[4],
  paddingBottom: `calc(${vars.space[6]} + env(safe-area-inset-bottom))`,
  borderTopLeftRadius: vars.radius.xl,
  borderTopRightRadius: vars.radius.xl,
  backgroundColor: vars.color.surface,
  outline: 'none',
})

export const handleStyle = style({
  width: '40px',
  height: '4px',
  marginInline: 'auto',
  borderRadius: vars.radius.full,
  backgroundColor: vars.color.border,
})

export const titleStyle = style({
  fontSize: vars.fontSize.lg,
  fontWeight: vars.fontWeight.semibold,
})
