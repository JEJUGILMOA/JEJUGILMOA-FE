import { keyframes, style } from '@vanilla-extract/css'
import { vars } from '@/styles/theme.css.ts'

const shimmer = keyframes({
  '0%': { backgroundPosition: '200% 0' },
  '100%': { backgroundPosition: '-200% 0' },
})

export const skeletonStyle = style({
  borderRadius: vars.radius.sm,
  backgroundImage: `linear-gradient(90deg, ${vars.color.surfaceMuted} 25%, ${vars.color.border} 50%, ${vars.color.surfaceMuted} 75%)`,
  backgroundSize: '200% 100%',
  animation: `${shimmer} 1.4s ease infinite`,
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
      backgroundImage: 'none',
      backgroundColor: vars.color.surfaceMuted,
    },
  },
})
