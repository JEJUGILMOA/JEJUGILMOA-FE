import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const toastRoot = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[3],
  width: 'min(100vw - 32px, 360px)',
  height: '54px',
  padding: `${vars.space[2]} ${vars.space[4]}`,
  backgroundColor: colors.surface[1],
  borderRadius: vars.radius.lg,
  boxShadow: vars.shadow.md,
})

export const toastIcon = recipe({
  base: {
    display: 'inline-flex',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  variants: {
    type: {
      success: {
        color: colors.primary[500],
      },
      error: {
        color: colors.error[100],
      },
      info: {
        color: colors.secondary[500],
      },
    },
  },
  defaultVariants: {
    type: 'info',
  },
})

export const toastMessage = style({
  flex: 1,
  minWidth: 0,
  fontFamily: vars.fontFamily.sans,
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.medium,
  lineHeight: vars.lineHeight.normal,
  color: colors.text[1],
})

export const toastActions = style({
  display: 'flex',
  flexShrink: 0,
  alignItems: 'center',
  gap: vars.space[2],
})

export const toastActionRecipe = recipe({
  base: {
    border: 'none',
    backgroundColor: 'transparent',
    padding: `${vars.space[2]} ${vars.space[3]}`,
    borderRadius: vars.radius.sm,
    fontFamily: vars.fontFamily.sans,
    fontSize: vars.fontSize.sm,
    fontWeight: vars.fontWeight.medium,
    lineHeight: vars.lineHeight.tight,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: `color ${vars.duration.fast}, background-color ${vars.duration.fast}`,
    '@media': {
      '(prefers-reduced-motion: reduce)': {
        transition: 'none',
      },
    },
  },
  variants: {
    tone: {
      default: {
        color: colors.text[3],
        selectors: {
          '&:hover': {
            backgroundColor: colors.surface[4],
            color: colors.text[2],
          },
        },
      },
      primary: {
        color: colors.primary[500],
        selectors: {
          '&:hover': {
            backgroundColor: colors.primary[100],
          },
        },
      },
      danger: {
        color: colors.error[100],
        selectors: {
          '&:hover': {
            backgroundColor: colors.surface[4],
          },
        },
      },
    },
  },
  defaultVariants: {
    tone: 'default',
  },
})
