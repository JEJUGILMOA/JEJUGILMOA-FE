import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const cardStyle = style({
  backgroundColor: colors.surface[1],
  border: `1px solid ${colors.border[1]}`,
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
  color: colors.text[3],
  fontSize: vars.fontSize.sm,
  lineHeight: vars.lineHeight.normal,
})
