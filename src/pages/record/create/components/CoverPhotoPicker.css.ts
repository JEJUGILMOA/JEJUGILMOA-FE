import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const gridStyle = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: vars.space[2],
})

export const tileRecipe = recipe({
  base: {
    position: 'relative',
    aspectRatio: '1 / 1',
    borderRadius: vars.radius.sm,
    overflow: 'hidden',
    backgroundColor: colors.surface[4],
  },
  variants: {
    selected: {
      true: {
        boxShadow: `0 0 0 2px ${colors.primary[500]}`,
      },
      false: {},
    },
  },
  defaultVariants: {
    selected: false,
  },
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

export const addTileStyle = style({
  position: 'relative',
  aspectRatio: '1 / 1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: vars.radius.sm,
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
})

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

export const emptyHintStyle = style({
  gridColumn: '1 / -1',
  padding: `${vars.space[6]} 0`,
  textAlign: 'center',
  fontSize: vars.fontSize.sm,
  color: colors.text[4],
})
