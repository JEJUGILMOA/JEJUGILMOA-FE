import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const menuListStyle = style({
  display: 'flex',
  flexDirection: 'column',
})

export const menuItemStyle = style({
  padding: `${vars.space[4]} 0`,
  textAlign: 'left',
  fontSize: vars.fontSize.md,
  color: colors.text[1],
  borderBottom: `1px solid ${colors.border[1]}`,
  selectors: {
    '&:last-child': {
      borderBottom: 'none',
    },
  },
})

export const menuItemDangerStyle = style([
  menuItemStyle,
  {
    color: colors.error[100],
  },
])

export const fieldGroupStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[4],
})

export const optionListStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
})
