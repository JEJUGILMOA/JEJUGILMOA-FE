import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const viewportStyle = style({
  position: 'relative',
  width: '100%',
  height: '190px',
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

export const routeSvgStyle = style({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
})

export const stopPinRecipe = recipe({
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
    backgroundColor: colors.primary[500],
    color: colors.text[5],
    fontSize: vars.fontSize.xs,
    fontWeight: vars.fontWeight.bold,
    cursor: 'default',
  },
})

export const unassignedPinStyle = style({
  position: 'absolute',
  width: '16px',
  height: '16px',
  borderRadius: '50%',
  backgroundColor: colors.text[6],
  opacity: 0.7,
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

export const emptyStateStyle = style({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: vars.fontSize.sm,
  color: colors.text[4],
})
