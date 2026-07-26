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
  selectors: {
    '& > *': {
      flexShrink: 0,
    },
  },
})

export const gridStyle = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: vars.space[3],
})

export const cardStyle = style({
  width: '100%',
})

globalStyle(`${cardStyle} > div:first-of-type`, {
  aspectRatio: '4 / 3',
  height: 'auto',
})
