import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const segmentedRoot = style({
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space[1],
  padding: vars.space[1],
  backgroundColor: colors.surface[4],
  borderRadius: vars.radius.sm,
})

export const segmentedRootFullWidth = style({
  display: 'flex',
  width: '100%',
})

export const indicatorStyle = style({
  position: 'absolute',
  top: vars.space[1],
  left: 0,
  zIndex: 0,
  height: `calc(100% - ${vars.space[1]} * 2)`,
  borderRadius: vars.radius.sm,
  backgroundColor: colors.surface[1],
  boxShadow: vars.shadow.sm,
  pointerEvents: 'none',
  transition: `transform ${vars.duration.normal} ease, width ${vars.duration.normal} ease`,
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
})

export const segmentRecipe = recipe({
  base: {
    position: 'relative',
    zIndex: 1,
    border: 'none',
    borderRadius: vars.radius.sm,
    padding: `${vars.space[2]} ${vars.space[4]}`,
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
    '@media': {
      '(prefers-reduced-motion: reduce)': {
        transition: 'none',
      },
    },
  },
  variants: {
    active: {
      true: {
        color: colors.text[1],
      },
      false: {},
    },
    fullWidth: {
      true: {
        flex: 1,
        textAlign: 'center',
      },
      false: {},
    },
  },
  defaultVariants: {
    active: false,
    fullWidth: false,
  },
})
