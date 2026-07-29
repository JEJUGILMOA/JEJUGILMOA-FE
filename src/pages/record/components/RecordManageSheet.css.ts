import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const triggerWrapStyle = style({
  position: 'absolute',
  top: vars.space[3],
  right: vars.space[3],
})

export const manageButtonStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '28px',
  height: '28px',
  border: 'none',
  borderRadius: vars.radius.full,
  backgroundColor: 'rgba(37, 37, 45, 0.48)',
  color: colors.text[5],
  cursor: 'pointer',
})

export const menuListStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  minWidth: '148px',
})

export const menuItemStyle = style({
  padding: `${vars.space[2]} ${vars.space[3]}`,
  borderRadius: vars.radius.sm,
  textAlign: 'left',
  fontSize: vars.fontSize.sm,
  color: colors.text[1],
  backgroundColor: 'transparent',
  border: 'none',
  cursor: 'pointer',
  selectors: {
    '&:hover': {
      backgroundColor: colors.surface[3],
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
