import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const pageStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[4],
  paddingBottom: vars.space[8],
})

export const descriptionStyle = style({
  fontSize: vars.fontSize.sm,
  color: colors.text[4],
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
})

export const legendRowStyle = style({
  display: 'flex',
  gap: vars.space[4],
})

export const legendItemStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[1],
  fontSize: vars.fontSize.xs,
  color: colors.text[4],
})

export const legendDotStyle = recipe({
  base: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  variants: {
    collected: {
      true: { backgroundColor: colors.text[4] },
      false: { backgroundColor: colors.primary[500] },
    },
  },
})

export const detailCardStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
  padding: vars.space[4],
  border: `1px solid ${colors.border[1]}`,
  borderRadius: vars.radius.md,
})

export const detailTitleStyle = style({
  fontSize: '13.5px',
  fontWeight: vars.fontWeight.bold,
  color: colors.text[1],
})

export const detailCategoryStyle = style({
  fontSize: '11.5px',
  color: colors.text[4],
})

export const nearestInfoStyle = style({
  fontSize: vars.fontSize.xs,
  color: colors.text[3],
  paddingTop: vars.space[2],
  borderTop: `1px solid ${colors.border[1]}`,
})

export const collectedNoticeStyle = style({
  width: '100%',
  textAlign: 'center',
  padding: vars.space[3],
  borderRadius: vars.radius.md,
  backgroundColor: colors.surface[3],
  fontSize: vars.fontSize.sm,
  color: colors.text[4],
})
