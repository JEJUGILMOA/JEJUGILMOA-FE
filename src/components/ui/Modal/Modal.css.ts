import { style } from '@vanilla-extract/css'
import { vars } from '@/styles/theme.css.ts'

export const overlayStyle = style({
  position: 'fixed',
  inset: 0,
  zIndex: vars.zIndex.modal,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: vars.space[4],
  backgroundColor: vars.color.overlay,
})

export const panelStyle = style({
  width: '100%',
  maxWidth: '400px',
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
  padding: vars.space[5],
  borderRadius: vars.radius.xl,
  backgroundColor: vars.color.surface,
  boxShadow: vars.shadow.lg,
})

export const titleStyle = style({
  fontSize: vars.fontSize.xl,
  fontWeight: vars.fontWeight.semibold,
})
