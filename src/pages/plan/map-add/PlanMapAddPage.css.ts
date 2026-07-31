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

export const mapAreaStyle = style({
  position: 'relative',
  width: '100%',
  height: '140px',
  borderRadius: vars.radius.md,
  backgroundColor: colors.surface[4],
  overflow: 'hidden',
})

export const pinButtonRecipe = recipe({
  base: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    padding: 0,
    border: 'none',
    borderRadius: '50%',
    backgroundColor: colors.primary[200],
    transform: 'translate(-50%, -50%)',
    cursor: 'pointer',
  },
  variants: {
    selected: {
      true: { backgroundColor: colors.primary[300] },
      false: {},
    },
  },
  defaultVariants: {
    selected: false,
  },
})

export const pinDotStyle = style({
  width: '10px',
  height: '10px',
  borderRadius: '50%',
  backgroundColor: colors.primary[500],
})

export const emptyMapStateStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  fontSize: vars.fontSize.sm,
  color: colors.text[4],
})

export const detailCardStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
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

export const dayRowStyle = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space[2],
})

export const emptyStateStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.space[3],
  padding: `${vars.space[8]} 0`,
  textAlign: 'center',
})

export const emptyStateTextStyle = style({
  fontSize: vars.fontSize.sm,
  color: colors.text[4],
})
