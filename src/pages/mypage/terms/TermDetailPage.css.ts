import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'
import { bodyLarge, heading3 } from '@/styles/typography.css.ts'

export const pageStyle = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  gap: vars.space[3],
  padding: vars.space[4],
  paddingTop: 0,
  backgroundColor: colors.surface[1],
})

export const titleStyle = style([
  heading3,
  {
    margin: 0,
    color: colors.text[1],
  },
])

export const bodyStyle = style([
  bodyLarge,
  {
    margin: 0,
    color: colors.text[2],
    lineHeight: 1.7,
    whiteSpace: 'pre-wrap',
  },
])
