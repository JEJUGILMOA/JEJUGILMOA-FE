import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const gridStyle = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: vars.space[2],
})

export const tileBase = style({
  position: 'relative',
  aspectRatio: '1 / 1',
  borderRadius: vars.radius.sm,
  overflow: 'hidden',
})

export const addTileStyle = style([
  tileBase,
  {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: `1px dashed ${colors.border[1]}`,
    backgroundColor: colors.surface[2],
    color: colors.secondary[500],
    cursor: 'pointer',
    selectors: {
      '&:hover': {
        borderColor: colors.secondary[300],
        backgroundColor: colors.secondary[100],
      },
    },
  },
])

export const hiddenInput = style({
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
})

export const photoTileStyle = style([tileBase, { backgroundColor: colors.surface[4] }])

export const photoImageStyle = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
})

export const removeButtonStyle = style({
  position: 'absolute',
  top: vars.space[1],
  right: vars.space[1],
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '20px',
  height: '20px',
  borderRadius: vars.radius.full,
  border: 'none',
  backgroundColor: 'rgba(37, 37, 45, 0.6)',
  color: colors.text[5],
  cursor: 'pointer',
})
