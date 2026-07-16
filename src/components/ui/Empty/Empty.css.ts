import { style } from '@vanilla-extract/css'
import { vars } from '@/styles/theme.css.ts'

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
  color: vars.color.text,
})

export const emptyDescriptionStyle = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.textMuted,
  marginBottom: vars.space[3],
})
