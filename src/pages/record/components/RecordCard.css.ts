import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const cardStyle = style({
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: colors.surface[1],
  border: `1px solid ${colors.border[1]}`,
  borderRadius: vars.radius.lg,
  boxShadow: vars.shadow.sm,
})

export const thumbnailWrapStyle = style({
  position: 'relative',
  width: '100%',
  aspectRatio: '6 / 3',
  backgroundColor: colors.surface[4],
})

export const thumbnailImageStyle = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
})

export const thumbnailPlaceholderStyle = style({
  display: 'flex',
  width: '100%',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  color: colors.text[4],
})

export const badgeWrapStyle = style({
  position: 'absolute',
  top: vars.space[3],
  left: vars.space[3],
})

export const bodyStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
  padding: vars.space[4],
})

export const titleStyle = style({
  fontSize: vars.fontSize.md,
  fontWeight: vars.fontWeight.semibold,
  color: colors.text[1],
})

export const summaryStyle = style({
  fontSize: vars.fontSize.sm,
  color: colors.text[3],
})

export const metaStyle = style({
  marginTop: vars.space[2],
  fontSize: vars.fontSize.xs,
  color: colors.text[4],
})

export const reactionStyle = style({
  marginTop: vars.space[2],
  paddingTop: vars.space[2],
  borderTop: `1px solid ${colors.border[1]}`,
  fontSize: vars.fontSize.xs,
  color: colors.text[4],
})
