import { recipe } from '@vanilla-extract/recipes'
import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const optionRecipe = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: vars.space[1],
    width: '100%',
    textAlign: 'left',
    padding: vars.space[4],
    borderRadius: vars.radius.md,
    border: `1px solid ${colors.border[1]}`,
    backgroundColor: colors.surface[1],
    cursor: 'pointer',
    transition: `border-color ${vars.duration.fast}, background-color ${vars.duration.fast}`,
  },
  variants: {
    selected: {
      true: {
        borderColor: colors.primary[500],
        backgroundColor: colors.primary[100],
      },
      false: {},
    },
  },
  defaultVariants: {
    selected: false,
  },
})

export const optionTitleStyle = style({
  fontSize: vars.fontSize.md,
  fontWeight: vars.fontWeight.semibold,
  color: colors.text[1],
})

export const optionDescriptionStyle = style({
  fontSize: vars.fontSize.xs,
  color: colors.text[4],
})
