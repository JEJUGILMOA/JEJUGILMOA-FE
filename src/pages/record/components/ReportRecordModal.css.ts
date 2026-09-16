import { globalStyle, style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const formStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[4],
  paddingTop: vars.space[2],
  height: '50dvh',
  overflowY: 'auto',
})

export const fieldGroupStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
})

export const fieldLabelStyle = style({
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.medium,
  color: colors.text[2],
})

export const dropdownRootStyle = style({
  position: 'relative',
  width: '100%',
})

globalStyle(`${dropdownRootStyle} > div`, {
  display: 'block',
  width: '100%',
})

export const dropdownTriggerStyle = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: vars.space[2],
    width: '100%',
    height: '44px',
    padding: `0 ${vars.space[3]}`,
    borderRadius: vars.radius.sm,
    border: `1px solid ${colors.border[1]}`,
    backgroundColor: colors.surface[1],
    fontSize: vars.fontSize.sm,
    fontWeight: vars.fontWeight.regular,
    cursor: 'pointer',
    textAlign: 'left',
    transition: `border-color ${vars.duration.fast}, box-shadow ${vars.duration.fast}`,
  },
  variants: {
    open: {
      true: {
        borderColor: colors.secondary[500],
        boxShadow: `0 0 0 3px ${colors.secondary[100]}`,
      },
      false: {},
    },
    placeholder: {
      true: {
        color: colors.text[4],
      },
      false: {
        color: colors.text[1],
      },
    },
  },
  defaultVariants: {
    open: false,
    placeholder: true,
  },
})

export const dropdownPanelStyle = style({
  left: 0,
  right: 0,
  width: '100%',
  border: `1px solid ${colors.border[1]}`,
  minWidth: '100%',
})

export const dropdownMenuListStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
})

export const dropdownMenuItemStyle = recipe({
  base: {
    width: '100%',
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
  },
  variants: {
    selected: {
      true: {
        color: colors.primary[600],
        fontWeight: vars.fontWeight.medium,
        backgroundColor: colors.primary[100],
      },
      false: {},
    },
  },
  defaultVariants: {
    selected: false,
  },
})
