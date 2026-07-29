import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const layoutStyle = style({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  minHeight: '100vh',
  '@supports': {
    '(height: 100dvh)': {
      height: '100dvh',
      minHeight: '100dvh',
    },
  },
  overflow: 'hidden',
  backgroundColor: colors.background[2],
  paddingBottom: 'calc(var(--keyboard-inset, 0px))',
})

export const contentStyle = style({
  flex: 1,
  width: '100%',
  maxWidth: '720px',
  minWidth: 0,
  minHeight: 0,
  marginInline: 'auto',
  padding: vars.space[3],
  paddingBottom: `calc(${vars.size.bottomNav} + env(safe-area-inset-bottom))`,
  overflowY: 'auto',
  overflowX: 'hidden',
  WebkitOverflowScrolling: 'touch',
  scrollbarWidth: 'none',
  selectors: {
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
})

export const contentFlushStyle = style({
  flex: 1,
  width: '100%',
  maxWidth: '720px',
  minWidth: 0,
  minHeight: 0,
  marginInline: 'auto',
  padding: 0,
  paddingBottom: `calc(env(safe-area-inset-bottom) + ${vars.space[4]})`,
  overflowY: 'auto',
  overflowX: 'hidden',
  WebkitOverflowScrolling: 'touch',
  backgroundColor: colors.background[1],
  scrollbarWidth: 'none',
  selectors: {
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
})
