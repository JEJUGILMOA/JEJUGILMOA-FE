import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const mapRootStyle = style({
  position: 'relative',
  width: '100%',
  height: '100%',
  backgroundColor: colors.surface[5],
  overflow: 'hidden',
  // 카드 클릭이 지도 제스처에 가로채이지 않도록
  pointerEvents: 'none',
})

export const mapCanvasStyle = style({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
})

export const emptyStateStyle = style({
  position: 'absolute',
  inset: 0,
  zIndex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: vars.fontSize.sm,
  color: colors.text[4],
  backgroundColor: 'rgba(243, 244, 246, 0.72)',
})
