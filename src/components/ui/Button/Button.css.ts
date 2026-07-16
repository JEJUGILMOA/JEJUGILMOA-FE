import { recipe } from '@vanilla-extract/recipes'
import { vars } from '@/styles/theme.css.ts'

export const buttonRecipe = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: vars.space[2],
    minHeight: vars.size.touch,
    borderRadius: vars.radius.md,
    fontWeight: vars.fontWeight.semibold,
    transition: `opacity ${vars.duration.fast}, background-color ${vars.duration.fast}`,
    userSelect: 'none',
    selectors: {
      '&:disabled': {
        opacity: 0.48,
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
        backgroundColor: vars.color.brand,
        color: vars.color.textInverse,
      },
      secondary: {
        backgroundColor: vars.color.brandSoft,
        color: vars.color.brand,
      },
      ghost: {
        backgroundColor: 'transparent',
        color: vars.color.text,
        border: `1px solid ${vars.color.border}`,
      },
      danger: {
        backgroundColor: vars.color.danger,
        color: vars.color.textInverse,
      },
    },
    size: {
      sm: {
        padding: `${vars.space[2]} ${vars.space[3]}`,
        fontSize: vars.fontSize.sm,
        minHeight: '40px',
      },
      md: {
        padding: `${vars.space[3]} ${vars.space[4]}`,
        fontSize: vars.fontSize.md,
      },
      lg: {
        padding: `${vars.space[4]} ${vars.space[6]}`,
        fontSize: vars.fontSize.lg,
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
