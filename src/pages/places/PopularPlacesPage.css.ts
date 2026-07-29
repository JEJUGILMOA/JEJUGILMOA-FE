import { style, globalStyle } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const pageStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[4],
  minHeight: '100%',
  padding: vars.space[4],
  backgroundColor: colors.background[1],
  fontFamily: vars.fontFamily.sans,
})

export const chipRowStyle = style({
  display: 'flex',
  gap: vars.space[2],
})

globalStyle(`${chipRowStyle} > *`, {
  flexShrink: 0,
})

export const listStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
  width: '100%',
})
