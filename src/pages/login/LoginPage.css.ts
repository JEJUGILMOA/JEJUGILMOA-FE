import { style } from '@vanilla-extract/css'
import { vars } from '@/styles/vars.css.ts'

export const pageStyle = style({
  minHeight: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: `${vars.space[10]} ${vars.space[6]}`,
  backgroundColor: '#FFFFFF',
  boxSizing: 'border-box',
})

export const headerStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.space[3],
  marginBottom: vars.space[12],
})

export const logoMarkStyle = style({
  width: 72,
  height: 72,
  borderRadius: 16,
  backgroundColor: '#1D803B',
  color: '#FFFFFF',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: vars.fontSize.xl,
  fontWeight: vars.fontWeight.bold,
  letterSpacing: '-0.02em',
})

export const titleStyle = style({
  margin: 0,
  fontSize: vars.fontSize['2xl'],
  fontWeight: vars.fontWeight.bold,
  color: '#1D803B',
  fontFamily: vars.fontFamily.sans,
})

export const subtitleStyle = style({
  margin: 0,
  fontSize: vars.fontSize.sm,
  color: '#9CA3AF',
  fontFamily: vars.fontFamily.sans,
})

export const buttonsStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
  width: '100%',
  maxWidth: 360,
  margin: '0 auto',
})

export const hintStyle = style({
  marginTop: vars.space[6],
  textAlign: 'center',
  fontSize: vars.fontSize.xs,
  color: '#9CA3AF',
  fontFamily: vars.fontFamily.sans,
  lineHeight: vars.lineHeight.relaxed,
})

export const statusPageStyle = style({
  minHeight: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space[4],
  padding: vars.space[6],
  textAlign: 'center',
  backgroundColor: '#FFFFFF',
  fontFamily: vars.fontFamily.sans,
})

export const statusTitleStyle = style({
  margin: 0,
  fontSize: vars.fontSize.lg,
  fontWeight: vars.fontWeight.semibold,
  color: '#111827',
})

export const statusMessageStyle = style({
  margin: 0,
  fontSize: vars.fontSize.sm,
  color: '#6B7280',
  lineHeight: vars.lineHeight.relaxed,
})
