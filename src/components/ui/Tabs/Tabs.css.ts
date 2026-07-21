import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const tabsRoot = style({
  display: 'flex',
  width: '100%',
  borderBottom: `1px solid ${colors.border[1]}`,
})

export const tabRecipe = recipe({
  base: {
    position: 'relative',
    flex: 1,
    padding: `${vars.space[3]} ${vars.space[2]}`,
    border: 'none',
    backgroundColor: 'transparent',
    fontFamily: vars.fontFamily.sans,
    fontSize: vars.fontSize.sm,
    fontWeight: vars.fontWeight.medium,
    lineHeight: vars.lineHeight.tight,
    letterSpacing: '-0.005em',
    color: colors.text[3],
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: `color ${vars.duration.fast}`,
    selectors: {
      '&::after': {
        content: '',
        position: 'absolute',
        right: 0,
        bottom: '-1px',
        left: 0,
        height: '2px',
        backgroundColor: 'transparent',
        transition: `background-color ${vars.duration.fast}`,
      },
    },
    '@media': {
      '(prefers-reduced-motion: reduce)': {
        transition: 'none',
        selectors: {
          '&::after': {
            transition: 'none',
          },
        },
      },
    },
  },
  variants: {
    active: {
      true: {
        color: colors.text[1],
        selectors: {
          '&::after': {
            backgroundColor: colors.primary[500],
          },
        },
      },
      false: {},
    },
  },
  defaultVariants: {
    active: false,
  },
})

export const tabPanelStyle = style({
  paddingTop: vars.space[4],
  color: colors.text[2],
  fontFamily: vars.fontFamily.sans,
  fontSize: vars.fontSize.sm,
  lineHeight: vars.lineHeight.normal,
})
