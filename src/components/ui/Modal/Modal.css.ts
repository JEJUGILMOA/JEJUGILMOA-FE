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
  maxWidth: '360px',
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[6],
  padding: `${vars.space[4]} ${vars.space[3]}`,
  borderRadius: vars.radius.lg,
  backgroundColor: colors.surface[1],
  boxShadow: vars.shadow.lg,
})

export const bodyStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
  paddingInline: vars.space[2],
})

export const titleStyle = style({
  fontSize: vars.fontSize.lg,
  fontWeight: vars.fontWeight.semibold,
  color: colors.text[1],
  letterSpacing: '-0.03em',
})

export const descriptionStyle = style({
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.regular,
  color: colors.text[3],
  lineHeight: vars.lineHeight.normal,
})

export const actionsStyle = style({
  display: 'flex',
  gap: vars.space[2],
  width: '100%',
})

export const actionGrowStyle = style({
  flex: 1,
})

export const actionFixedStyle = style({
  flex: '0 0 88px',
})
