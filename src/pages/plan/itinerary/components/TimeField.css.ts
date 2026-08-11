import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const timeFieldStyle = style({
  flexShrink: 0,
  minWidth: '52px',
  border: 'none',
  padding: `${vars.space[1]} ${vars.space[2]}`,
  margin: 0,
  borderRadius: vars.radius.sm,
  backgroundColor: colors.primary[100],
  color: colors.primary[700],
  fontSize: '11px',
  fontWeight: vars.fontWeight.bold,
  fontFamily: 'inherit',
  textAlign: 'center',
  cursor: 'pointer',
  selectors: {
    '&[aria-expanded="true"]': {
      backgroundColor: colors.primary[200],
    },
  },
})
