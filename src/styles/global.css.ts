import { globalStyle } from '@vanilla-extract/css'
import { vars } from './theme.css.ts'

globalStyle('body', {
  fontFamily:
    '"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontSize: vars.fontSize.md,
  lineHeight: vars.lineHeight.normal,
  color: vars.color.text,
  backgroundColor: vars.color.background,
  fontSynthesis: 'none',
  textRendering: 'optimizeLegibility',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
})

globalStyle('h1, h2, h3, h4, h5, h6', {
  color: vars.color.text,
  lineHeight: vars.lineHeight.tight,
  fontWeight: vars.fontWeight.semibold,
})

globalStyle(':focus-visible', {
  outline: `2px solid ${vars.color.brand}`,
  outlineOffset: '2px',
})

globalStyle('*, *::before, *::after', {
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animationDuration: '0.01ms',
      animationIterationCount: '1',
      transitionDuration: '0.01ms',
      scrollBehavior: 'auto',
    },
  },
})
