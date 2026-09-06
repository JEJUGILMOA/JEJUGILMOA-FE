import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const gridStyle = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: vars.space[2],
})

export const tileStyle = style({
  position: 'relative',
  aspectRatio: '1 / 1',
  borderRadius: vars.radius.sm,
  overflow: 'hidden',
  backgroundColor: colors.surface[4],
})

export const tileSelectedStyle = style({
  boxShadow: `0 0 0 2px ${colors.primary[500]}`,
})

export const imageButtonStyle = style({
  display: 'block',
  width: '100%',
  height: '100%',
  padding: 0,
  border: 'none',
  backgroundColor: 'transparent',
  cursor: 'pointer',
})

export const photoImageStyle = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
})

export const checkBadgeStyle = style({
  position: 'absolute',
  top: vars.space[1],
  left: vars.space[1],
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '18px',
  height: '18px',
  borderRadius: vars.radius.full,
  backgroundColor: colors.primary[500],
  color: colors.text[5],
  pointerEvents: 'none',
})

export const hintStyle = style({
  fontSize: vars.fontSize.xs,
  color: colors.text[4],
})
