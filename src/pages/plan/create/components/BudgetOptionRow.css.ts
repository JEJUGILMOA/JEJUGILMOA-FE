import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const listStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
})

export const rowRecipe = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: vars.space[3],
    borderRadius: vars.radius.md,
    border: `1px solid ${colors.border[1]}`,
    backgroundColor: colors.surface[1],
    textAlign: 'left',
    cursor: 'pointer',
    transition: `border-color ${vars.duration.fast}`,
  },
  variants: {
    selected: {
      true: { borderColor: colors.primary[500] },
      false: {},
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
  marginTop: '2px',
})

export const radioRecipe = recipe({
  base: {
    flexShrink: 0,
    width: '16px',
    height: '16px',
    borderRadius: vars.radius.full,
    boxSizing: 'border-box',
    backgroundColor: colors.surface[1],
  },
  variants: {
    selected: {
      true: { border: `5px solid ${colors.primary[500]}` },
      false: { border: `1.5px solid ${colors.border[1]}` },
    },
  },
  defaultVariants: {
    selected: false,
  },
})
