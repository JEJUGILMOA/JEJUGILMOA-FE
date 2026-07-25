import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const rowStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  padding: `${vars.space[3]} ${vars.space[4]}`,
  borderRadius: vars.radius.sm,
  border: `1px solid ${colors.border[1]}`,
  backgroundColor: colors.surface[1],
  cursor: 'pointer',
})

export const placeNameStyle = style({
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.medium,
  color: colors.text[1],
})

export const statusRecipe = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: vars.space[1],
    fontSize: vars.fontSize.xs,
    fontWeight: vars.fontWeight.medium,
  },
  variants: {
    done: {
      true: { color: colors.primary[500] },
      false: { color: colors.text[4] },
    },
  },
  defaultVariants: {
    done: false,
  },
})
