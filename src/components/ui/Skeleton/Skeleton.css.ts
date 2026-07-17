import { keyframes, style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

const shimmer = keyframes({
  '0%': { backgroundPosition: '200% 0' },
  '100%': { backgroundPosition: '-200% 0' },
})

export const skeletonStyle = style({
  borderRadius: vars.radius.sm,
  backgroundImage: `linear-gradient(90deg, ${colors.surface[3]} 25%, ${colors.border[1]} 50%, ${colors.surface[3]} 75%)`,
  backgroundSize: '200% 100%',
  animation: `${shimmer} 1.4s ease infinite`,
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
      backgroundImage: 'none',
      backgroundColor: colors.surface[3],
    },
  },
})
