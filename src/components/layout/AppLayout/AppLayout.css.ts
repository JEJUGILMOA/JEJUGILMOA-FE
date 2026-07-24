import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const layoutStyle = style({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  '@supports': {
    '(min-height: 100dvh)': {
      minHeight: '100dvh',
    },
  },
  backgroundColor: colors.background[2],
  paddingBottom: 'calc(var(--keyboard-inset, 0px))',
})

export const contentStyle = style({
  flex: 1,
  width: '100%',
  maxWidth: '720px',
  marginInline: 'auto',
  padding: vars.space[4],
  paddingBottom: `calc(${vars.size.bottomNav} + env(safe-area-inset-bottom) + ${vars.space[4]})`,
  overflowY: 'auto',
  WebkitOverflowScrolling: 'touch',
})

export const contentFlushStyle = style({
  flex: 1,
  width: '100%',
  maxWidth: '720px',
  marginInline: 'auto',
  padding: 0,
  paddingBottom: `calc(env(safe-area-inset-bottom) + ${vars.space[4]})`,
  overflowY: 'auto',
  WebkitOverflowScrolling: 'touch',
  backgroundColor: colors.background[1],
})
