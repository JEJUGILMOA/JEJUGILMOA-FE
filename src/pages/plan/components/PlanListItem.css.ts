import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const clickableCardStyle = style({
  cursor: 'pointer',
  transition: `border-color ${vars.duration.fast}`,
  selectors: {
    '&:hover': { borderColor: colors.primary[300] },
  },
})

export const dateRangeStyle = style({
  fontSize: vars.fontSize.sm,
  color: colors.text[3],
})

export const metaStyle = style({
  fontSize: vars.fontSize.xs,
  color: colors.text[4],
  marginTop: vars.space[1],
})
