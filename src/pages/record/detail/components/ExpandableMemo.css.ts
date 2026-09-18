import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const memoRecipe = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: vars.space[1],
    width: '100%',
    boxSizing: 'border-box',
    padding: `${vars.space[3]} ${vars.space[4]}`,
    borderRadius: vars.radius.sm,
    backgroundColor: colors.surface[4],
  },
})

export const memoBodyRecipe = recipe({
  base: {
    margin: 0,
    fontSize: vars.fontSize.md,
    fontWeight: vars.fontWeight.regular,
    lineHeight: vars.lineHeight.relaxed,
    color: colors.text[2],
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  variants: {
    collapsed: {
      true: {
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: 3,
        overflow: 'hidden',
      },
      false: {},
    },
  },
  defaultVariants: {
    collapsed: true,
  },
})

export const memoToggleStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  alignSelf: 'flex-start',
  gap: '2px',
  margin: 0,
  padding: 0,
  border: 'none',
  background: 'none',
  fontFamily: vars.fontFamily.sans,
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.semibold,
  color: colors.primary[500],
  cursor: 'pointer',
})
