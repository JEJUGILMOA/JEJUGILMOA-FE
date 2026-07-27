import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'
import { titleMedium } from '@/styles/typography.css.ts'

export const menuItemStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[4],
  width: '100%',
  minHeight: 56,
  padding: `${vars.space[3]} ${vars.space[1]}`,
  border: 'none',
  borderBottom: `1px solid ${colors.border[1]}`,
  backgroundColor: 'transparent',
  color: colors.text[1],
  cursor: 'pointer',
  textAlign: 'left',
  selectors: {
    '&:active': {
      backgroundColor: colors.surface[3],
    },
  },
})

export const iconWrapStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 42,
  height: 42,
  borderRadius: 10,
  backgroundColor: colors.primary[100],
  color: colors.primary[700],
  flexShrink: 0,
})

export const labelStyle = style([
  titleMedium,
  {
    flex: 1,
    minWidth: 0,
  },
])

export const chevronStyle = style({
  flexShrink: 0,
  color: colors.text[4],
})
