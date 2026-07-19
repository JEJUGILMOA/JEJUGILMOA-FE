import { style } from '@vanilla-extract/css'
import { vars } from '@/styles/vars.css.ts'
import { colors } from '@/styles/colors.css.ts'

export const pageStyle = style({
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
  fontWeight: vars.fontWeight.semibold,
  color: colors.text[1],
})

export const rowStyle = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: vars.space[2],
})

export const labelStyle = style({
  width: '72px',
  flexShrink: 0,
  fontSize: vars.fontSize.xs,
  color: colors.text[4],
})
