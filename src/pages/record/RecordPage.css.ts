import { style } from '@vanilla-extract/css'
import { vars } from '@/styles/vars.css.ts'

export const pageStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[5],
})

export const headerStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
})

export const listStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[4],
})
