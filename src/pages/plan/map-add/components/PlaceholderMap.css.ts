import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const viewportStyle = style({
  position: 'relative',
  width: '100%',
  height: '220px',
  borderRadius: vars.radius.md,
  backgroundColor: colors.surface[4],
  overflow: 'hidden',
  touchAction: 'none',
})

export const canvasStyle = style({
  position: 'absolute',
  inset: 0,
  transformOrigin: 'center center',
  cursor: 'grab',
  selectors: {
    '&:active': { cursor: 'grabbing' },
  },
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
    cursor: 'pointer',
  },
  variants: {
    collected: {
      true: { backgroundColor: colors.text[6] },
      false: { backgroundColor: colors.primary[200] },
    },
    focused: {
      true: { boxShadow: ` 0 0 0 2px ${colors.text[2]}` },
      false: {},
    },
  },
  defaultVariants: {
    collected: false,
    focused: false,
  },
})

export const pinDotRecipe = recipe({
  base: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
  },
  variants: {
    collected: {
      true: { backgroundColor: colors.text[4] },
      false: { backgroundColor: colors.primary[500] },
    },
  },
  defaultVariants: {
    collected: false,
  },
})

export const zoomControlsStyle = style({
  position: 'absolute',
  right: vars.space[2],
  bottom: vars.space[2],
  display: 'flex',
  flexDirection: 'column',
  borderRadius: vars.radius.sm,
  overflow: 'hidden',
  boxShadow: vars.shadow.sm,
})

export const zoomButtonStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '28px',
  height: '28px',
  border: 'none',
  borderBottom: `1px solid ${colors.border[1]}`,
  backgroundColor: colors.surface[1],
  color: colors.text[2],
  cursor: 'pointer',
  selectors: {
    '&:last-child': { borderBottom: 'none' },
    '&:disabled': { color: colors.text[6], cursor: 'not-allowed' },
  },
})
