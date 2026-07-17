import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

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
  background: `linear-gradient(160deg, ${colors.primary[100]}, ${colors.surface[1]})`,
  border: `1px solid ${colors.border[1]}`,
})

export const sectionStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
})
