import { globalStyle, style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const overlayStyle = style({
  position: 'fixed',
  inset: 0,
  zIndex: vars.zIndex.overlay,
  backgroundColor: vars.overlay,
})

// vaul은 snapPoints 사용 시 마지막 스냅포인트가 아니면 오버레이 opacity를 0으로 강제한다.
// 어느 스냅포인트에서든 배경을 항상 어둡게 유지하려면 !important로 덮어써야 한다.
globalStyle(`${overlayStyle}[data-vaul-overlay]`, {
  opacity: '1 !important',
})

export const contentStyle = style({
  position: 'fixed',
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: vars.zIndex.modal,
  // vaul snapPoints는 뷰포트 전체 높이 기준으로 transform한다.
  height: '100%',
  outline: 'none',
  // 배경은 보이는 패널(visiblePanelStyle)에만 둔다
  backgroundColor: 'transparent',
  boxShadow: 'none',
})

/** snap 높이만큼만 차지하는 실제 시트 UI (핸들·본문·하단 CTA가 모두 여기 안에) */
export const visiblePanelStyle = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  overflow: 'hidden',
  borderTopLeftRadius: vars.radius.xl,
  borderTopRightRadius: vars.radius.xl,
  backgroundColor: colors.surface[1],
  boxShadow: '0 -8px 28px rgba(0, 0, 0, 0.12)',
})

export const handleStyle = style({
  width: '40px',
  height: '4px',
  flexShrink: 0,
  marginTop: vars.space[3],
  marginBottom: vars.space[2],
  marginInline: 'auto',
  borderRadius: vars.radius.full,
  backgroundColor: colors.border[1],
})

export const titleStyle = style({
  flexShrink: 0,
  paddingInline: vars.space[4],
  fontSize: vars.fontSize.lg,
  fontWeight: vars.fontWeight.semibold,
  color: colors.text[1],
})

export const bodyStyle = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  WebkitOverflowScrolling: 'touch',
  padding: vars.space[4],
  paddingTop: vars.space[2],
  paddingBottom: `calc(${vars.space[6]} + env(safe-area-inset-bottom))`,
})

export const srOnlyStyle = style({
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
})
