import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const clickableCardStyle = style({
  position: 'relative',
  cursor: 'pointer',
  transition: `border-color ${vars.duration.fast}`,
  selectors: {
    '&:hover': { borderColor: colors.primary[300] },
  },
})

export const titleRowStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space[2],
  marginBottom: vars.space[2],
  paddingRight: vars.space[8],
})

export const titleTextStyle = style({
  margin: 0,
  fontSize: vars.fontSize.lg,
  fontWeight: vars.fontWeight.semibold,
  color: colors.text[1],
})

export const dateRangeStyle = style({
  fontSize: vars.fontSize.sm,
  color: colors.text[3],
})

export const metaStyle = style({
  fontSize: vars.fontSize.xs,
  color: colors.text[4],
  marginTop: vars.space[1],
})

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
  backgroundColor: colors.surface[4],
  color: colors.text[3],
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
