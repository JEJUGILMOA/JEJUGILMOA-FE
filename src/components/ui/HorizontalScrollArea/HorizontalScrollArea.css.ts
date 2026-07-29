import { style } from '@vanilla-extract/css'

export const wrapperStyle = style({
  position: 'relative',
  width: '100%',
  minWidth: 0,
})

export const scrollAreaStyle = style({
  width: '100%',
  minWidth: 0,
  overflowX: 'auto',
  overflowY: 'hidden',
  WebkitOverflowScrolling: 'touch',
  overscrollBehaviorX: 'contain',
  scrollbarWidth: 'none',
  selectors: {
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
})

const fadeBase = style({
  position: 'absolute',
  top: 0,
  bottom: 0,
  zIndex: 1,
  width: 'var(--scroll-fade-width, 32px)',
  pointerEvents: 'none',
  opacity: 0,
  transition: 'opacity 0.2s ease',
  selectors: {
    '&[data-visible="true"]': {
      opacity: 1,
    },
  },
})

export const fadeLeftStyle = style([
  fadeBase,
  {
    left: 0,
  },
])

export const fadeRightStyle = style([
  fadeBase,
  {
    right: 0,
  },
])
