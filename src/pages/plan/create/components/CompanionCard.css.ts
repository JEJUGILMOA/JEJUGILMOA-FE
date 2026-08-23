import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const gridStyle = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: vars.space[2],
})

export const cardRecipe = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: vars.space[2],
    padding: vars.space[3],
    borderRadius: vars.radius.md,
    border: `1px solid ${colors.border[1]}`,
    backgroundColor: colors.surface[1],
    textAlign: 'left',
    cursor: 'pointer',
    transition: `border-color ${vars.duration.fast}, background-color ${vars.duration.fast}`,
  },
  variants: {
    selected: {
      true: { borderColor: colors.primary[500] },
      false: {},
    },
    fullWidth: {
      true: { gridColumn: '1 / -1' },
      false: {},
    },
  },
  defaultVariants: {
    selected: false,
    fullWidth: false,
  },
})

export const badgeRecipe = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    borderRadius: vars.radius.sm,
    fontSize: vars.fontSize.xs,
    fontWeight: vars.fontWeight.bold,
  },
  variants: {
    selected: {
      true: { backgroundColor: colors.primary[500], color: colors.text[5] },
      false: { backgroundColor: colors.surface[4], color: colors.text[1] },
    },
  },
  defaultVariants: {
    selected: false,
  },
})

export const labelStyle = style({
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.semibold,
  color: colors.text[1],
})

export const descStyle = style({
  fontSize: vars.fontSize.xs,
  color: colors.text[4],
})
