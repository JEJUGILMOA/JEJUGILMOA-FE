import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const sectionTitleStyle = style({
  marginBottom: vars.space[3],
  fontSize: vars.fontSize.lg,
  fontWeight: vars.fontWeight.semibold,
  color: colors.text[1],
})

export const listStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[4],
})

export const rowStyle = style({
  display: 'flex',
  gap: vars.space[3],
})

export const thumbnailStyle = style({
  display: 'flex',
  flexShrink: 0,
  width: '64px',
  height: '64px',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: vars.radius.sm,
  overflow: 'hidden',
  backgroundColor: colors.surface[4],
  color: colors.text[4],
})

export const thumbnailImageStyle = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
})

export const placeNameStyle = style({
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.semibold,
  color: colors.text[1],
})

export const noteStyle = style({
  marginTop: vars.space[1],
  fontSize: vars.fontSize.sm,
  color: colors.text[3],
})
