import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const pageStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[5],
  paddingBottom: vars.space[8],
})

export const doneLinkStyle = style({
  flexShrink: 0,
  border: 'none',
  background: 'transparent',
  padding: 0,
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.semibold,
  color: colors.primary[500],
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  selectors: {
    '&:disabled': { color: colors.text[6], cursor: 'not-allowed' },
  },
})

export const headerBlockStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
})

export const titleStyle = style({
  fontSize: vars.fontSize['2xl'],
  fontWeight: vars.fontWeight.bold,
  color: colors.text[1],
  letterSpacing: '-0.03em',
})

export const descriptionStyle = style({
  fontSize: vars.fontSize.sm,
  color: colors.text[4],
})

export const sectionStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
})

export const sectionLabelStyle = style({
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.bold,
  color: colors.text[3],
})

export const courseRowStyle = style({
  display: 'flex',
  gap: vars.space[2],
})

export const categoryRowStyle = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space[2],
})

export const listStyle = style({
  display: 'flex',
  flexDirection: 'column',
})

export const emptyListStyle = style({
  padding: `${vars.space[8]} 0`,
  textAlign: 'center',
  fontSize: vars.fontSize.sm,
  color: colors.text[4],
})
