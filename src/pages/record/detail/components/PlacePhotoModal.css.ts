import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const overlayStyle = style({
  position: 'fixed',
  inset: 0,
  zIndex: 200,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(15, 15, 20, 0.92)',
})

export const wrapStyle = style({
  position: 'relative',
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
})

export const trackStyle = style({
  display: 'flex',
  width: '100%',
  height: '100%',
  touchAction: 'pan-y',
  transition: 'transform 0.25s ease',
  cursor: 'grab',
})

export const slideImageStyle = style({
  flex: '0 0 100%',
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  userSelect: 'none',
})

export const closeButtonStyle = style({
  position: 'absolute',
  top: vars.space[4],
  right: vars.space[4],
  zIndex: 1,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '36px',
  height: '36px',
  border: 'none',
  borderRadius: vars.radius.full,
  backgroundColor: 'rgba(37, 37, 45, 0.6)',
  color: colors.text[5],
  cursor: 'pointer',
})

export const counterStyle = style({
  position: 'absolute',
  bottom: vars.space[4],
  left: '50%',
  transform: 'translateX(-50%)',
  padding: `${vars.space[1]} ${vars.space[3]}`,
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
  width: '36px',
  height: '36px',
  border: 'none',
  borderRadius: vars.radius.full,
  backgroundColor: 'rgba(37, 37, 45, 0.4)',
  color: colors.text[5],
  cursor: 'pointer',
})

export const navButtonPrevStyle = style([navButtonStyle, { left: vars.space[3] }])
export const navButtonNextStyle = style([navButtonStyle, { right: vars.space[3] }])
