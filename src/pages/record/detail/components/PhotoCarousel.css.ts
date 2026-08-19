import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

/**
 * 좌우로 화면 끝까지 이어붙임. 위쪽 여백은 이미 RecordDetailPage의 subHeaderStyle이
 * 취소해뒀으므로 여기서 또 marginTop을 걸면 헤더 쪽으로 파고들어 겹친다.
 */
export const wrapStyle = style({
  position: 'relative',
  marginInline: `calc(-1 * ${vars.space[4]})`,
  aspectRatio: '1 / 1',
  overflow: 'hidden',
  backgroundColor: colors.surface[4],
})

export const imageStyle = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
})

export const placeholderStyle = style({
  display: 'flex',
  width: '100%',
  height: '100%',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space[2],
  color: colors.text[4],
  fontSize: vars.fontSize.sm,
})

export const bookmarkButtonStyle = style({
  position: 'absolute',
  top: vars.space[3],
  left: vars.space[3],
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '36px',
  height: '36px',
  border: 'none',
  borderRadius: vars.radius.full,
  backgroundColor: colors.surface[1],
  color: colors.text[2],
  cursor: 'pointer',
  boxShadow: vars.shadow.sm,
})

export const bookmarkActiveStyle = style({
  color: colors.primary[500],
})

export const counterStyle = style({
  position: 'absolute',
  top: vars.space[3],
  right: vars.space[3],
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
