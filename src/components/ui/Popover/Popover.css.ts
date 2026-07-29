import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const rootStyle = style({
  position: 'relative',
  display: 'inline-flex',
})

export const panelRecipe = recipe({
  base: {
    position: 'absolute',
    top: 'calc(100% + 4px)',
    zIndex: vars.zIndex.dropdown,
    minWidth: '160px',
    padding: vars.space[1],
    borderRadius: vars.radius.sm,
    backgroundColor: colors.surface[1],
    boxShadow: vars.shadow.lg,
  },
  variants: {
    align: {
      start: { left: 0 },
      end: { right: 0 },
    },
  },
  defaultVariants: {
    align: 'end',
  },
})
