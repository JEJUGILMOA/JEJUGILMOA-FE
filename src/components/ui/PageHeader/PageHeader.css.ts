import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

/**
 * 부모 패딩을 상쇄해 네이티브 PageHeader와 같은 화면 가장자리 기준으로 그리기 위한 변수.
 * AppLayout·페이지 셸에서 해당 패딩 값으로 설정한다.
 */
export const PAGE_HEADER_BLEED_VAR = '--gilmoa-header-bleed'

export const pageHeaderRoot = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space[2],
  boxSizing: 'border-box',
  minHeight: vars.size.header,
  /** main 패딩(12px) 안으로 올려 스크롤 컨테이너 상단에 붙인다 */
  marginTop: `calc(-1 * var(${PAGE_HEADER_BLEED_VAR}, 0px))`,
  marginInline: `calc(-1 * var(${PAGE_HEADER_BLEED_VAR}, 0px))`,
  padding: `${vars.space[2]} 4px ${vars.space[2]} 10px`,
  backgroundColor: colors.surface[1],
  position: 'sticky',
  top: `calc(-1 * var(${PAGE_HEADER_BLEED_VAR}, 0px))`,
  zIndex: vars.zIndex.sticky,
})

/** 네이티브 셸이 헤더를 그릴 때 웹 헤더는 레이아웃에서 제거 */
export const pageHeaderHidden = style({
  display: 'none',
})

export const pageHeaderLeft = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
  minWidth: 0,
  flex: 1,
})

export const pageHeaderTitle = style({
  flex: 1,
  margin: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  letterSpacing: '-0.6px',
})

export const backButton = style({
  display: 'inline-flex',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  width: 36,
  height: 36,
  margin: 0,
  padding: 0,
  border: 'none',
  borderRadius: vars.radius.sm,
  backgroundColor: 'transparent',
  color: colors.text[1],
  cursor: 'pointer',
  transition: `background-color ${vars.duration.fast}`,
  selectors: {
    '&:hover': {
      backgroundColor: colors.surface[4],
    },
    '&:active': {
      backgroundColor: colors.surface[4],
    },
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
})

export const pageHeaderRight = style({
  display: 'flex',
  flexShrink: 0,
  alignItems: 'center',
  gap: vars.space[2],
})

export const pageHeaderRightText = style({
  fontSize: vars.fontSize.xs,
  color: colors.text[4],
  whiteSpace: 'nowrap',
  paddingRight: 14,
})

export const pageHeaderAction = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: vars.size.touch,
  minWidth: vars.size.touch,
  padding: `0 ${vars.space[2]}`,
  border: 'none',
  borderRadius: vars.radius.sm,
  backgroundColor: 'transparent',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  fontSize: vars.fontSize.sm,
  color: colors.text[1],
  selectors: {
    '&:hover': {
      backgroundColor: colors.surface[4],
    },
    '&:active': {
      backgroundColor: colors.surface[4],
    },
  },
})

export const pageHeaderActionMuted = style({
  fontSize: vars.fontSize.sm,
  color: colors.text[4],
  paddingRight: 14,
  selectors: {
    '&:hover': {
      backgroundColor: 'transparent',
    },
    '&:active': {
      backgroundColor: 'transparent',
      color: colors.text[3],
    },
  },
})

export const pageHeaderActionPrimary = style({
  fontWeight: vars.fontWeight.semibold,
  color: colors.primary[700],
})
