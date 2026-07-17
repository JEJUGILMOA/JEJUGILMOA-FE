import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const overlayStyle = style({
  position: 'fixed',
  inset: 0,
  zIndex: vars.zIndex.modal,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: vars.space[4],
  backgroundColor: vars.overlay,
})

export const panelStyle = style({
  width: '100%',
  maxWidth: '400px',
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
  padding: vars.space[5],
  borderRadius: vars.radius.xl,
  backgroundColor: colors.surface[1],
  boxShadow: vars.shadow.lg,
})

export const titleStyle = style({
  fontSize: vars.fontSize.xl,
  fontWeight: vars.fontWeight.semibold,
})
