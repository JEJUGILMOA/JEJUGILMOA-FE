import { style } from '@vanilla-extract/css'
import { vars } from '@/styles/theme.css.ts'

export const cardStyle = style({
  backgroundColor: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  boxShadow: vars.shadow.sm,
  padding: vars.space[4],
})

export const cardTitleStyle = style({
  fontSize: vars.fontSize.lg,
  fontWeight: vars.fontWeight.semibold,
  marginBottom: vars.space[2],
})

export const cardBodyStyle = style({
  color: vars.color.textMuted,
  fontSize: vars.fontSize.sm,
  lineHeight: vars.lineHeight.normal,
})
