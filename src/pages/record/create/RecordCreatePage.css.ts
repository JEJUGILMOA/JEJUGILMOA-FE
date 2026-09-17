import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'
import { style } from '@vanilla-extract/css'

/** AppLayout main 높이를 채워 본문만 스크롤, CTA는 하단에 고정 */
export const pageShellStyle = style({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  minHeight: 0,
})

export const pageStyle = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
  paddingInline: vars.space[2],
})

export const stepShellStyle = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
})

export const stepScrollStyle = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  overflowX: 'hidden',
  gap: vars.space[6],
  WebkitOverflowScrolling: 'touch',
})

/** 스크롤과 분리된 CTA — 그림자/별도 배경 없이 본문과 같은 면으로 */
export const stepFooterStyle = style({
  flexShrink: 0,
  padding: `${vars.space[4]} 0`,
})

export const stepHeaderStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
})

export const stepTitleStyle = style({
  fontSize: vars.fontSize['2xl'],
  fontWeight: vars.fontWeight.bold,
  color: colors.text[1],
  letterSpacing: '-0.03em',
  whiteSpace: 'pre-line',
})

export const stepDescriptionStyle = style({
  fontSize: vars.fontSize.sm,
  color: colors.text[4],
})

export const stepIndicatorStyle = style({
  fontSize: vars.fontSize.xs,
  color: colors.text[4],
})

export const optionListStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
})

export const fieldGroupStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[5],
})

export const sectionLabelStyle = style({
  display: 'block',
  marginBottom: vars.space[2],
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.medium,
  color: colors.text[2],
})

export const placeMemoListStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
})
