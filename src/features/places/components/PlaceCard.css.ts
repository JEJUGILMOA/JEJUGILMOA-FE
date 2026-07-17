import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const cardStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
  padding: vars.space[4],
  borderRadius: vars.radius.lg,
  border: `1px solid ${colors.border[1]}`,
  backgroundColor: colors.surface[1],
  minHeight: vars.size.touch,
})

export const nameStyle = style({
  fontSize: vars.fontSize.md,
  fontWeight: vars.fontWeight.semibold,
  color: colors.text[1],
})

export const metaStyle = style({
  fontSize: vars.fontSize.sm,
  color: colors.text[3],
})
