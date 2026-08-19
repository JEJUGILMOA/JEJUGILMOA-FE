import { style, globalStyle } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const buttonRecipe = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: vars.space[2],
    border: '1px solid transparent',
    fontFamily: vars.fontFamily.sans,
    lineHeight: '1',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    userSelect: 'none',
    transition: `background-color ${vars.duration.fast}, border-color ${vars.duration.fast}, color ${vars.duration.fast}`,
    selectors: {
      '&:disabled': {
        cursor: 'not-allowed',
      },
    },
    '@media': {
      '(prefers-reduced-motion: reduce)': {
        transition: 'none',
      },
    },
  },
  variants: {
    variant: {
      primary: {
        backgroundColor: colors.primary[500],
        color: colors.text[5],
        selectors: {
          '&:hover:not(:disabled)': {
            backgroundColor: colors.primary[600],
          },
          '&:active:not(:disabled)': {
            backgroundColor: colors.primary[700],
          },
          '&:disabled': {
            backgroundColor: colors.surface[5],
            color: colors.text[4],
          },
        },
      },
      secondary: {
        backgroundColor: colors.surface[1],
        color: colors.text[3],
        selectors: {
          '&:hover:not(:disabled)': {
            backgroundColor: colors.surface[3],
          },
          '&:active:not(:disabled)': {
            backgroundColor: colors.surface[4],
          },
          '&:disabled': {
            backgroundColor: colors.surface[5],
            color: colors.text[4],
          },
        },
      },
      outline: {
        backgroundColor: colors.surface[1],
        borderColor: colors.primary[500],
        color: colors.text[3],
        selectors: {
          '&:hover:not(:disabled)': {
            backgroundColor: colors.surface[2],
          },
          '&:active:not(:disabled)': {
            backgroundColor: colors.surface[3],
          },
          '&:disabled': {
            backgroundColor: colors.surface[5],
            borderColor: colors.border[1],
            color: colors.text[4],
          },
        },
      },
      ghost: {
        backgroundColor: 'transparent',
        color: colors.text[3],
        selectors: {
          '&:hover:not(:disabled)': {
            backgroundColor: colors.stone[200],
          },
          '&:active:not(:disabled)': {
            backgroundColor: colors.stone[300],
            color: colors.text[2],
          },
          '&:disabled': {
            backgroundColor: 'transparent',
            color: colors.text[4],
          },
        },
      },
      danger: {
        backgroundColor: colors.error[100],
        color: colors.text[5],
        selectors: {
          '&:hover:not(:disabled)': {
            backgroundColor: colors.error[300],
          },
          '&:active:not(:disabled)': {
            backgroundColor: colors.error[500],
          },
          '&:disabled': {
            backgroundColor: colors.surface[5],
            color: colors.text[4],
          },
        },
      },
    },
    size: {
      sm: {
        padding: '6px 12px',
        borderRadius: vars.radius.sm,
        fontSize: vars.fontSize.xs,
        fontWeight: vars.fontWeight.medium,
        letterSpacing: '-0.005em',
      },
      md: {
        padding: '10px 16px',
        borderRadius: vars.radius.sm,
        fontSize: vars.fontSize.sm,
        fontWeight: vars.fontWeight.medium,
        letterSpacing: '-0.005em',
      },
      lg: {
        padding: '14px 20px',
        borderRadius: vars.radius.buttonLg,
        fontSize: vars.fontSize.md,
        fontWeight: vars.fontWeight.semibold,
        letterSpacing: '-0.01em',
      },
    },
    fullWidth: {
      true: {
        width: '100%',
      },
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
    fullWidth: false,
  },
})

export const buttonIconStyle = recipe({
  base: {
    display: 'inline-flex',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  variants: {
    size: {
      sm: { width: '14px', height: '14px' },
      md: { width: '16px', height: '16px' },
      lg: { width: '18px', height: '18px' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

const iconSlot = style({})

globalStyle(`${iconSlot} svg`, {
  width: '100%',
  height: '100%',
})

export const buttonIconClass = iconSlot
