import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

export const avatarStyle = style({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '50%',
  backgroundImage: 'linear-gradient(135deg, #F5A623 0%, #17783C 100%)',
  flexShrink: 0,
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
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
})
