import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const pageStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[5],
  paddingInline: vars.space[4],
  paddingBottom: vars.space[8],
})

export const emptyHintStyle = style({
  fontSize: vars.fontSize.sm,
  color: colors.text[4],
})

export const actionsStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
})

/** 진행중: 여행 취소 | 지도에서 보기 */
export const actionsRowStyle = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: vars.space[2],
})
