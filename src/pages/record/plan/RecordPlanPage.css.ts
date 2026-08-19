import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const pageStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[6],
  paddingBottom: vars.space[8],
})

export const coverPlaceholderStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space[2],
  aspectRatio: '4 / 3',
  marginTop: `calc(-1 * ${vars.space[4]})`,
  marginInline: `calc(-1 * ${vars.space[4]})`,
  backgroundColor: colors.surface[4],
  color: colors.text[4],
  fontSize: vars.fontSize.sm,
})

export const infoStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: vars.space[2],
})

export const titleGroupStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
})

export const titleStyle = style({
  fontSize: vars.fontSize['2xl'],
  fontWeight: vars.fontWeight.bold,
  color: colors.text[1],
  letterSpacing: '-0.03em',
})

export const dateRangeStyle = style({
  fontSize: vars.fontSize.sm,
  color: colors.text[3],
})

export const divider = style({
  height: '1px',
  backgroundColor: colors.border[1],
})

export const sectionTitleStyle = style({
  marginBottom: vars.space[3],
  fontSize: vars.fontSize.lg,
  fontWeight: vars.fontWeight.semibold,
  color: colors.text[1],
})
