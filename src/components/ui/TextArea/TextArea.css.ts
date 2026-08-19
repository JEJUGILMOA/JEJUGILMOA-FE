import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'
import { fieldChromeState } from '@/styles/fieldChrome.css.ts'

export const textAreaRoot = style({
  position: 'relative',
  width: '100%',
})

export const textAreaRecipe = recipe({
  base: {
    display: 'block',
    width: '100%',
    minHeight: '120px',
    padding: `${vars.space[3]} ${vars.space[3]} ${vars.space[8]}`,
    ...fieldChromeState.base,
    color: colors.text[1],
    fontFamily: vars.fontFamily.sans,
    fontSize: vars.fontSize.sm,
    fontWeight: vars.fontWeight.regular,
    lineHeight: vars.lineHeight.normal,
    resize: 'vertical',
    outline: 'none',
    selectors: {
      '&::placeholder': {
        color: colors.text[4],
      },
    },
  },
  variants: {
    focused: {
      true: fieldChromeState.focused,
      false: {},
    },
  },
  defaultVariants: {
    focused: false,
  },
})

export const countStyle = style({
  position: 'absolute',
  right: vars.space[3],
  bottom: vars.space[3],
  color: colors.text[4],
  fontFamily: vars.fontFamily.sans,
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.regular,
  pointerEvents: 'none',
})
