import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const fabStyle = style({
  position: 'fixed',
  right: vars.space[4],
  bottom: `calc(${vars.size.bottomNav} + env(safe-area-inset-bottom) + ${vars.space[4]})`,
  zIndex: vars.zIndex.sticky,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '52px',
  height: '52px',
  borderRadius: vars.radius.full,
  border: 'none',
  backgroundColor: colors.primary[500],
  color: colors.text[5],
  boxShadow: vars.shadow.lg,
  cursor: 'pointer',
  transition: `background-color ${vars.duration.fast}`,
  selectors: {
    '&:hover': {
      backgroundColor: colors.primary[600],
    },
    '&:active': {
      backgroundColor: colors.primary[700],
    },
  },
})
