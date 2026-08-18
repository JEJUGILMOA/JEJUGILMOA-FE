import { style } from '@vanilla-extract/css'
import { vars } from '@/styles/vars.css.ts'

export const pageStyle = style({
  padding: vars.space[2],
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[4],
})

export const listStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
})
