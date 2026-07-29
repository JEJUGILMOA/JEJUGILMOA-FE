import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const rowStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[3],
})

export const thumbnailStyle = style({
  display: 'flex',
  flexShrink: 0,
  width: '56px',
  height: '56px',
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

export const bodyStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
  minWidth: 0,
  flex: 1,
})

export const placeNameStyle = style({
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.semibold,
  color: colors.text[1],
})

export const noteStyle = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontSize: vars.fontSize.sm,
  color: colors.text[3],
})

export const editButtonStyle = style({
  display: 'inline-flex',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  width: vars.size.touch,
  height: vars.size.touch,
  border: 'none',
  borderRadius: vars.radius.sm,
  backgroundColor: 'transparent',
  color: colors.text[3],
  cursor: 'pointer',
  selectors: {
    '&:hover': {
      backgroundColor: colors.surface[4],
    },
  },
})
