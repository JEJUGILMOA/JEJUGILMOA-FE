import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const pageStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
})

export const headerStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
})

export const listStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[4],
})

export const skeletonCardStyle = style({
  overflow: 'hidden',
  backgroundColor: colors.surface[1],
  border: `1px solid ${colors.border[1]}`,
  borderRadius: vars.radius.lg,
  boxShadow: vars.shadow.sm,
})

export const skeletonThumbWrapStyle = style({
  position: 'relative',
  width: '100%',
  aspectRatio: '6 / 3',
  backgroundColor: colors.surface[4],
})

export const skeletonThumbStyle = style({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  borderRadius: 0,
})

export const skeletonBodyStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
  padding: vars.space[4],
})
