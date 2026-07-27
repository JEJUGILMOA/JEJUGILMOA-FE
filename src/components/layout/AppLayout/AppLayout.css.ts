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
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
  width: '100%',
  maxWidth: '720px',
  marginInline: 'auto',
  padding: 0,
  paddingBottom: `calc(${vars.size.bottomNav} + env(safe-area-inset-bottom))`,
  overflowY: 'auto',
  WebkitOverflowScrolling: 'touch',
})

/** 하단 네비 없는 서브페이지용 — bottomNav 여백 제거 */
export const contentFullBleedStyle = style({
  paddingBottom: 'env(safe-area-inset-bottom)',
})
