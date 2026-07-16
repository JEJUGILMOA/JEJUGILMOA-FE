import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { vars } from '@/styles/theme.css.ts'

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
  backgroundColor: vars.color.surface,
  borderTop: `1px solid ${vars.color.border}`,
})

export const linkStyle = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: vars.space[1],
    minHeight: vars.size.touch,
    color: vars.color.textMuted,
    fontSize: vars.fontSize.xs,
    fontWeight: vars.fontWeight.medium,
  },
  variants: {
    active: {
      true: {
        color: vars.color.brand,
      },
    },
  },
})

export const labelStyle = style({
  lineHeight: 1,
})
