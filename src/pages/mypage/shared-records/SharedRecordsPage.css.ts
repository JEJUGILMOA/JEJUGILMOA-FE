import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'
import { captionSm, titleMedium } from '@/styles/typography.css.ts'

export const pageStyle = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  gap: vars.space[4],
  padding: vars.space[4],
  paddingTop: 0,
  backgroundColor: colors.surface[1],
})

export const statsRowStyle = style({
  display: 'flex',
  justifyContent: 'center',
  gap: vars.space[6],
  paddingBlock: vars.space[2],
})

export const statsItemStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 2,
})

export const statsValueStyle = style([
  titleMedium,
  {
    color: colors.text[1],
  },
])

export const statsLabelStyle = style([
  captionSm,
  {
    color: colors.text[4],
  },
])

export const listStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
})
