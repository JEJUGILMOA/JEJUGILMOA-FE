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
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  maxHeight: '85dvh',
  outline: 'none',
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
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
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
