import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const trackStyle = style({
  display: 'flex',
  gap: vars.space[1],
})

export const segmentRecipe = recipe({
  base: {
    flex: 1,
    height: '4px',
    borderRadius: vars.radius.full,
    backgroundColor: colors.border[1],
    transition: `background-color ${vars.duration.fast}`,
  },
  variants: {
    active: {
      true: { backgroundColor: colors.primary[500] },
      false: {},
    },
  },
  defaultVariants: {
    active: false,
  },
})
