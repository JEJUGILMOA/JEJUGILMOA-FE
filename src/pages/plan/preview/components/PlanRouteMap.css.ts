import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const dayTabRowStyle = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space[2],
  marginBottom: vars.space[3],
})

export const mapBoxStyle = style({
  position: 'relative',
  height: '200px',
  borderRadius: vars.radius.md,
  backgroundColor: colors.surface[4],
  overflow: 'hidden',
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
    width: '22px',
    height: '22px',
    padding: 0,
    border: 'none',
    borderRadius: '50%',
    backgroundColor: colors.primary[500],
    color: colors.text[5],
    fontSize: vars.fontSize.xs,
    fontWeight: vars.fontWeight.bold,
    transform: 'translate(-50%, -50%)',
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
