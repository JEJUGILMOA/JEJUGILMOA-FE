import { style } from '@vanilla-extract/css'
import { vars } from '@/styles/theme.css.ts'

export const layoutStyle = style({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  '@supports': {
    '(min-height: 100dvh)': {
      minHeight: '100dvh',
    },
  },
  backgroundColor: vars.color.background,
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
