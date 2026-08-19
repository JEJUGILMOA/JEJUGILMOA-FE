import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const pageStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[6],
  paddingBottom: vars.space[8],
})

export const fieldGroupStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[5],
})

export const sectionStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
})

export const sectionHeaderStyle = style({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
})

export const sectionLabelStyle = style({
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.medium,
  color: colors.text[2],
})

export const sectionCountStyle = style({
  fontSize: vars.fontSize.xs,
  color: colors.text[4],
})

export const placeMemoListStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[4],
})

export const divider = style({
  height: '1px',
  backgroundColor: colors.border[1],
})

export const optionListStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
})
