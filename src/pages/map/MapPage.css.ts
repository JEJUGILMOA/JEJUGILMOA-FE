import { style } from '@vanilla-extract/css'
import { vars } from '@/styles/theme.css.ts'

export const pageStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[4],
})
