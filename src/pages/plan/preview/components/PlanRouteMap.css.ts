import { style } from '@vanilla-extract/css'
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
  height: '240px',
  borderRadius: vars.radius.md,
  backgroundColor: colors.surface[4],
  overflow: 'hidden',
})

export const mapCanvasStyle = style({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  zIndex: 0,
})

export const emptyStateStyle = style({
  position: 'absolute',
  inset: 0,
  zIndex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: vars.fontSize.sm,
  color: colors.text[4],
  pointerEvents: 'none',
  backgroundColor: 'rgba(243, 244, 246, 0.72)',
})
