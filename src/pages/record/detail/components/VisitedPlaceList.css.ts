import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const headerRowStyle = style({
  display: 'flex',
  alignItems: 'center',
  marginBottom: vars.space[3],
})

export const sectionTitleStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[1],
  margin: 0,
  fontSize: vars.fontSize.lg,
  fontWeight: vars.fontWeight.semibold,
  color: colors.text[1],
})

export const countStyle = style({
  fontSize: vars.fontSize.md,
  fontWeight: vars.fontWeight.regular,
  color: colors.text[4],
})

export const gridStyle = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: vars.space[3],
  // 기본값(stretch)이면 같은 행의 카드가 제일 큰 카드 높이에 맞춰 늘어나
  // 메모 없는 카드 아래에 빈 공간이 생긴다 — 카드마다 자기 내용만큼만 높이를 갖게 함
  alignItems: 'start',
})

export const collapseButtonStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '2px',
  width: '100%',
  marginTop: vars.space[3],
  padding: vars.space[2],
  border: 'none',
  borderRadius: vars.radius.full,
  backgroundColor: colors.surface[4],
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.medium,
  color: colors.text[3],
  cursor: 'pointer',
})
