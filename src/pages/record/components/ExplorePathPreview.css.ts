import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const cardStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
  padding: vars.space[4],
  backgroundColor: colors.surface[1],
  border: `1px solid ${colors.border[1]}`,
  borderRadius: vars.radius.lg,
  boxShadow: vars.shadow.sm,
})

export const titleStyle = style({
  fontSize: vars.fontSize.md,
  fontWeight: vars.fontWeight.semibold,
  color: colors.text[1],
})

export const mapAreaStyle = style({
  width: '100%',
  aspectRatio: '16 / 9',
  backgroundColor: colors.surface[3],
  borderRadius: vars.radius.md,
})

export const pathLineStyle = style({
  fill: 'none',
  stroke: colors.primary[500],
  strokeWidth: 1.5,
  strokeDasharray: '3 3',
})

export const pathDotStyle = style({
  fill: colors.primary[500],
})
