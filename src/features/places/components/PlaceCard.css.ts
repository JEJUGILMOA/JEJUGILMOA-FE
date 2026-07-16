import { style } from '@vanilla-extract/css'
import { vars } from '@/styles/theme.css.ts'

export const cardStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
  padding: vars.space[4],
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.border}`,
  backgroundColor: vars.color.surface,
  minHeight: vars.size.touch,
})

export const nameStyle = style({
  fontSize: vars.fontSize.md,
  fontWeight: vars.fontWeight.semibold,
  color: vars.color.text,
})

export const metaStyle = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.textMuted,
})
