import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const pageStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[5],
  paddingBottom: vars.space[8],
})

export const headerBlockStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
})

export const titleStyle = style({
  fontSize: vars.fontSize['2xl'],
  fontWeight: vars.fontWeight.bold,
  color: colors.text[1],
  letterSpacing: '-0.03em',
})

export const descriptionStyle = style({
  fontSize: vars.fontSize.sm,
  color: colors.text[4],
})

export const suggestionHintStyle = style({
  fontSize: vars.fontSize.xs,
  color: colors.primary[700],
  backgroundColor: colors.primary[100],
  borderRadius: vars.radius.sm,
  padding: `${vars.space[2]} ${vars.space[3]}`,
})

export const feeHintStyle = style({
  fontSize: vars.fontSize.xs,
  color: colors.text[2],
  backgroundColor: colors.surface[4],
  borderRadius: vars.radius.sm,
  padding: `${vars.space[2]} ${vars.space[3]}`,
})

export const skipButtonStyle = style({
  border: 'none',
  background: 'transparent',
  padding: 0,
  fontSize: vars.fontSize.sm,
  color: colors.text[4],
  cursor: 'pointer',
})

export const formStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
})

export const totalCardStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
  padding: vars.space[4],
  borderRadius: vars.radius.lg,
  backgroundColor: colors.primary[100],
})

export const totalCardRowStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

export const totalLabelStyle = style({
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.semibold,
  color: colors.text[2],
})

export const totalValueStyle = style({
  fontSize: vars.fontSize.xl,
  fontWeight: vars.fontWeight.bold,
  color: colors.primary[700],
})

export const perPersonStyle = style({
  alignSelf: 'flex-end',
  fontSize: vars.fontSize.xs,
  color: colors.text[3],
})
