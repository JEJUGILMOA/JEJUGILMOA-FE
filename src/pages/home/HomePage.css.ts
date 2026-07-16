import { style } from '@vanilla-extract/css'
import { vars } from '@/styles/theme.css.ts'

export const pageStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[5],
})

export const heroStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
  padding: vars.space[5],
  borderRadius: vars.radius.xl,
  background: `linear-gradient(160deg, ${vars.color.brandSoft}, ${vars.color.surface})`,
  border: `1px solid ${vars.color.border}`,
})

export const sectionStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
})
