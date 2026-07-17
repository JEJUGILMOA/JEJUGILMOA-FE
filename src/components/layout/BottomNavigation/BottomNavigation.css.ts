import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const navStyle = style({
  position: 'fixed',
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: vars.zIndex.sticky,
  display: 'grid',
  gridTemplateColumns: 'repeat(5, 1fr)',
  minHeight: vars.size.bottomNav,
  paddingBottom: 'env(safe-area-inset-bottom)',
  backgroundColor: colors.surface[1],
  borderTop: `1px solid ${colors.border[1]}`,
})

export const linkStyle = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: vars.space[1],
    minHeight: vars.size.touch,
    color: colors.text[3],
    fontSize: vars.fontSize.xs,
    fontWeight: vars.fontWeight.medium,
  },
  variants: {
    active: {
      true: {
        color: colors.primary[500],
      },
    },
  },
})

export const labelStyle = style({
  lineHeight: 1,
})
