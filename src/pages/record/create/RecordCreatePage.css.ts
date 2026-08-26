import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const pageStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[6],
  paddingInline: vars.space[2],
  paddingBottom: vars.space[8],
})

export const stepHeaderStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
})

export const stepTitleStyle = style({
  fontSize: vars.fontSize['2xl'],
  fontWeight: vars.fontWeight.bold,
  color: colors.text[1],
  letterSpacing: '-0.03em',
  whiteSpace: 'pre-line',
})

export const stepDescriptionStyle = style({
  fontSize: vars.fontSize.sm,
  color: colors.text[4],
})

export const stepIndicatorStyle = style({
  fontSize: vars.fontSize.xs,
  color: colors.text[4],
})

export const optionListStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
})

export const fieldGroupStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[5],
})

export const sectionLabelStyle = style({
  display: 'block',
  marginBottom: vars.space[2],
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.medium,
  color: colors.text[2],
})

export const placeMemoListStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
})
