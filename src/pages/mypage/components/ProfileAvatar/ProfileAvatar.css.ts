import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/colors.css.ts'

export const avatarStyle = style({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '50%',
  backgroundColor: 'transparent',
  flexShrink: 0,
  boxSizing: 'border-box',
  border: `2px solid ${colors.border[1]}`,
})

export const sizeRecipe = recipe({
  variants: {
    size: {
      sm: { width: 50, height: 50 },
      md: { width: 74, height: 74 },
      lg: { width: 78, height: 78 },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export const avatarImageStyle = style({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  objectPosition: 'center',
  display: 'block',
})
