import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

/**
 * 부모 pageStyle이 레이아웃 패딩을 이미 취소하므로 풀블리드.
 * 위쪽 여백은 RecordDetailPage의 subHeaderStyle이 처리한다.
 */
export const wrapStyle = style({
  position: 'relative',
  aspectRatio: '1 / 1',
  overflow: 'hidden',
  backgroundColor: colors.surface[4],
})

export const slideImageStyle = style({
  flex: '0 0 100%',
  width: '100%',
  height: '100%',
  userSelect: 'none',
  WebkitUserSelect: 'none',
  // iOS 롱프레스 콜아웃·이미지 저장 시트 억제
  WebkitTouchCallout: 'none',
  pointerEvents: 'none',
})

export const trackStyle = style({
  display: 'flex',
  width: '100%',
  height: '100%',
  touchAction: 'pan-y',
  transition: 'transform 0.25s ease',
  cursor: 'grab',
  userSelect: 'none',
  WebkitUserSelect: 'none',
  WebkitTouchCallout: 'none',
})

export const placeholderStyle = style({
  width: '100%',
  height: '100%',
})

export const overlayActionsStyle = style({
  position: 'absolute',
  top: vars.space[3],
  right: vars.space[3],
  zIndex: 2,
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
})

export const overlayButtonStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '36px',
  height: '36px',
  padding: 0,
  border: 'none',
  borderRadius: vars.radius.full,
  backgroundColor: colors.surface[1],
  color: colors.text[1],
  cursor: 'pointer',
  boxShadow: '0 1px 4px rgba(37, 37, 45, 0.12)',
  selectors: {
    '&:disabled': {
      opacity: 0.6,
      cursor: 'default',
    },
  },
})

export const bookmarkActiveStyle = style({
  color: colors.primary[500],
})

export const menuListStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  minWidth: '148px',
})

export const menuItemStyle = style({
  padding: `${vars.space[2]} ${vars.space[3]}`,
  borderRadius: vars.radius.sm,
  textAlign: 'left',
  fontSize: vars.fontSize.sm,
  color: colors.text[1],
  backgroundColor: 'transparent',
  border: 'none',
  cursor: 'pointer',
  selectors: {
    '&:hover': {
      backgroundColor: colors.surface[3],
    },
  },
})

export const menuItemDangerStyle = style([
  menuItemStyle,
  {
    color: colors.error[100],
  },
])

export const counterStyle = style({
  position: 'absolute',
  bottom: vars.space[3],
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 2,
  padding: `${vars.space[1]} ${vars.space[2]}`,
  borderRadius: vars.radius.full,
  backgroundColor: 'rgba(37, 37, 45, 0.6)',
  color: colors.text[5],
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.medium,
})

export const navButtonStyle = style({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  border: 'none',
  borderRadius: vars.radius.full,
  backgroundColor: 'rgba(37, 37, 45, 0.4)',
  color: colors.text[5],
  cursor: 'pointer',
})

export const navButtonPrevStyle = style([navButtonStyle, { left: vars.space[3] }])
export const navButtonNextStyle = style([navButtonStyle, { right: vars.space[3] }])
