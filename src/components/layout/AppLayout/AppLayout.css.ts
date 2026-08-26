import { style } from '@vanilla-extract/css'
import { PAGE_HEADER_BLEED_VAR } from '@/components/ui/PageHeader/PageHeader.css.ts'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

/** FAB 등이 웹 하단 탭 높이를 따를 때 사용. 탭이 없으면 0px */
export const BOTTOM_NAV_OFFSET_VAR = '--gilmoa-bottom-nav-offset'

export const layoutStyle = style({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  maxHeight: '100%',
  overflow: 'hidden',
  overscrollBehavior: 'none',
  backgroundColor: colors.background[1],
  paddingBottom: 'calc(var(--keyboard-inset, 0px))',
  vars: {
    [BOTTOM_NAV_OFFSET_VAR]: vars.size.bottomNav,
  },
})

export const layoutHideNavStyle = style({
  vars: {
    [BOTTOM_NAV_OFFSET_VAR]: '0px',
  },
})

export const contentStyle = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
  width: '100%',
  maxWidth: '720px',
  minWidth: 0,
  marginInline: 'auto',
  padding: vars.space[3],
  paddingBottom: `calc(${vars.size.bottomNav} + env(safe-area-inset-bottom))`,
  overflowY: 'auto',
  overflowX: 'hidden',
  overscrollBehavior: 'contain',
  WebkitOverflowScrolling: 'touch',
  vars: {
    [PAGE_HEADER_BLEED_VAR]: vars.space[3],
  },
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
  overflowY: 'auto',
  overflowX: 'hidden',
  overscrollBehavior: 'contain',
  WebkitOverflowScrolling: 'touch',
  backgroundColor: colors.background[1],
  vars: {
    [PAGE_HEADER_BLEED_VAR]: '0px',
  },
  scrollbarWidth: 'none',
  selectors: {
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
})

/** flush + 하단 탭이 있을 때 */
export const contentFlushWithNavStyle = style({
  paddingBottom: `calc(${vars.size.bottomNav} + env(safe-area-inset-bottom))`,
})

/** flush + 하단 탭이 없을 때 */
export const contentFlushNoNavStyle = style({
  paddingBottom: `calc(env(safe-area-inset-bottom) + ${vars.space[4]})`,
})

/** 하단 네비 없는 서브페이지용 — bottomNav 여백 제거 */
export const contentFullBleedStyle = style({
  paddingBottom: 'env(safe-area-inset-bottom)',
})
