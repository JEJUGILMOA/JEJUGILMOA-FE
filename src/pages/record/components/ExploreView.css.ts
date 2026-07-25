import { style } from '@vanilla-extract/css'
import { vars } from '@/styles/vars.css.ts'

export const wrapStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[4],
})

export const viewToggleStyle = style({
  alignSelf: 'flex-start',
})

export const listStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[4],
})
