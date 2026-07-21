import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

/** 필드 공통 크롬 (테두리·포커스·에러) — TextField / SearchBar / DateField / TextArea */
export const fieldChromeState = {
  base: {
    borderRadius: vars.radius.sm,
    border: `1px solid ${colors.border[1]}`,
    backgroundColor: colors.surface[1],
    transition: `border-color ${vars.duration.fast}, box-shadow ${vars.duration.fast}`,
  },
  focused: {
    borderColor: colors.secondary[500],
    boxShadow: `0 0 0 3px ${colors.secondary[100]}`,
  },
  error: {
    borderColor: colors.error[100],
    boxShadow: '0 0 0 3px rgba(255, 76, 76, 0.12)',
  },
} as const

export const fieldChromeRecipe = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: vars.space[2],
    height: '44px',
    padding: `0 ${vars.space[3]}`,
    ...fieldChromeState.base,
  },
  variants: {
    focused: {
      true: fieldChromeState.focused,
      false: {},
    },
    error: {
      true: fieldChromeState.error,
      false: {},
    },
  },
  compoundVariants: [
    {
      variants: { focused: true, error: true },
      style: fieldChromeState.error,
    },
  ],
  defaultVariants: {
    focused: false,
    error: false,
  },
})

export const fieldInputReset = style({
  flex: 1,
  minWidth: 0,
  height: '100%',
  border: 'none',
  backgroundColor: 'transparent',
  color: colors.text[1],
  fontFamily: vars.fontFamily.sans,
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.regular,
  outline: 'none',
  selectors: {
    '&::placeholder': {
      color: colors.text[4],
    },
  },
})
