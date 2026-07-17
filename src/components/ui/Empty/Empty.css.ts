import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const emptyStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space[2],
  padding: vars.space[8],
  textAlign: 'center',
  minHeight: '200px',
})

export const emptyTitleStyle = style({
  fontSize: vars.fontSize.lg,
  fontWeight: vars.fontWeight.semibold,
  color: colors.text[1],
})

export const emptyDescriptionStyle = style({
  fontSize: vars.fontSize.sm,
  color: colors.text[3],
  marginBottom: vars.space[3],
})
