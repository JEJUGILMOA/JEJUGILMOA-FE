import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const pageStyle = style({
  padding: vars.space[2],
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[4],
})

export const listStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[6],
})

export const sectionStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
})

export const sectionTitleStyle = style({
  fontSize: vars.fontSize.md,
  fontWeight: vars.fontWeight.bold,
  color: colors.text[1],
})

export const sectionHintStyle = style({
  fontSize: vars.fontSize.sm,
  color: colors.text[3],
})
