import { globalStyle } from '@vanilla-extract/css'
import { colors } from './colors.css.ts'
import { vars } from './vars.css.ts'

globalStyle('body', {
  fontFamily: vars.fontFamily.sans,
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.regular,
  letterSpacing: '-0.01em',
  lineHeight: vars.lineHeight.normal,
  color: colors.text[1],
  backgroundColor: colors.background[2],
  fontSynthesis: 'none',
  textRendering: 'optimizeLegibility',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
})

globalStyle('h1, h2, h3, h4, h5, h6', {
  color: colors.text[1],
  fontFamily: vars.fontFamily.sans,
  lineHeight: vars.lineHeight.tight,
  fontWeight: vars.fontWeight.bold,
})

globalStyle(':focus-visible', {
  outline: `2px solid ${colors.secondary[500]}`,
  outlineOffset: '2px',
})

globalStyle('input:focus-visible, textarea:focus-visible, select:focus-visible', {
  outline: 'none',
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
