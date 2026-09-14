import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const sheetBody = style({
  display: 'flex',
  flexDirection: 'column',
  // 시트 body 높이만큼 채워 짧은 내용에서도 저장 버튼이 하단에 붙도록
  minHeight: '100%',
  gap: vars.space[4],
  // 키보드가 시트 하단을 가릴 때(입력 포커스 시에만) 저장 버튼을 위로 올림
  paddingBottom: 'var(--sheet-keyboard-inset, 0px)',
  transition: 'padding-bottom 120ms ease-out',
  boxSizing: 'border-box',
})

export const scrollArea = style({
  display: 'flex',
  flexDirection: 'column',
  flex: '1 1 auto',
  gap: vars.space[4],
  minHeight: 0,
})

export const placeNameStyle = style({
  fontSize: vars.fontSize.lg,
  fontWeight: vars.fontWeight.semibold,
  color: colors.text[1],
})

export const footerStyle = style({
  position: 'sticky',
  bottom: 0,
  zIndex: 1,
  flexShrink: 0,
  marginTop: 'auto',
  paddingTop: vars.space[4],
  // body 하단 패딩 구간까지 배경이 이어져 스크롤 시 본문이 비치지 않게
  paddingBottom: vars.space[1],
  marginInline: `calc(-1 * ${vars.space[4]})`,
  paddingInline: vars.space[4],
  backgroundColor: colors.surface[1],
})
