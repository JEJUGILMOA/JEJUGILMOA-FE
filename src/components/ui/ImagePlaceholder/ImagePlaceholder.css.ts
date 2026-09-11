import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const placeholderRecipe = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    width: '100%',
    height: '100%',
    minHeight: '100%',
    boxSizing: 'border-box',
    backgroundImage: `linear-gradient(145deg, ${colors.surface[5]} 0%, ${colors.surface[4]} 100%)`,
    color: colors.text[6],
    userSelect: 'none',
  },
  variants: {
    size: {
      sm: {
        gap: '4px',
        padding: vars.space[1],
      },
      md: {
        gap: '6px',
        padding: vars.space[2],
      },
      lg: {
        gap: '8px',
        padding: vars.space[3],
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export const labelRecipe = recipe({
  base: {
    margin: 0,
    textAlign: 'center',
    fontWeight: vars.fontWeight.medium,
    lineHeight: 1.3,
    color: colors.text[4],
  },
  variants: {
    size: {
      sm: {
        fontSize: '10px',
      },
      md: {
        fontSize: '11px',
      },
      lg: {
        fontSize: '12px',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export const safeImageWrapStyle = style({
  position: 'relative',
  display: 'block',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
})

export const safeImageStyle = style({
  display: 'block',
  width: '100%',
  height: '100%',
  objectPosition: 'center',
})

export const safeImageCoverStyle = style({
  objectFit: 'cover',
})

export const safeImageContainStyle = style({
  objectFit: 'contain',
})
