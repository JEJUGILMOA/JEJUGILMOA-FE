import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const pageHeaderRoot = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space[3],
  minHeight: vars.size.header,
  padding: `${vars.space[2]} 0`,
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
  margin: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const backButton = style({
  display: 'inline-flex',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  width: vars.size.touch,
  height: vars.size.touch,
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
      backgroundColor: colors.surface[5],
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
})

export const pageHeaderAction = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: vars.size.touch,
  padding: `0 ${vars.space[2]}`,
  border: 'none',
  borderRadius: vars.radius.sm,
  backgroundColor: 'transparent',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  fontSize: vars.fontSize.sm,
  color: colors.text[1],
})

export const pageHeaderActionMuted = style({
  fontSize: vars.fontSize.xs,
  color: colors.text[4],
})

export const pageHeaderActionPrimary = style({
  fontWeight: vars.fontWeight.semibold,
  color: colors.primary[700],
})
