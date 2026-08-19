import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const pageStyle = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  gap: vars.space[4],
  padding: vars.space[4],
  paddingTop: 0,
  backgroundColor: colors.surface[1],
})

export const listStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
})
