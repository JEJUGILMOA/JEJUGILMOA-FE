import { globalStyle } from '@vanilla-extract/css'

globalStyle('*, *::before, *::after', {
  boxSizing: 'border-box',
})

globalStyle('*', {
  margin: 0,
})

globalStyle('html, body, #root', {
  height: '100%',
})

globalStyle('html', {
  WebkitTextSizeAdjust: '100%',
  textSizeAdjust: '100%',
})

globalStyle('body', {
  minHeight: '100vh',
  '@supports': {
    '(min-height: 100dvh)': {
      minHeight: '100dvh',
    },
  },
  overscrollBehavior: 'none',
  WebkitOverflowScrolling: 'touch',
  WebkitTapHighlightColor: 'transparent',
})

globalStyle('img, picture, video, canvas, svg', {
  display: 'block',
  maxWidth: '100%',
})

globalStyle('input, button, textarea, select', {
  font: 'inherit',
  color: 'inherit',
})

globalStyle('button', {
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
})

globalStyle('a', {
  color: 'inherit',
  textDecoration: 'none',
})

globalStyle('ul, ol', {
  listStyle: 'none',
  padding: 0,
})
