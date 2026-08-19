import { style, globalStyle } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const textFieldRoot = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
  width: '100%',
})

export const labelStyle = style({
  color: colors.text[2],
  fontFamily: vars.fontFamily.sans,
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.medium,
})

const iconSlot = style({})

globalStyle(`${iconSlot} svg`, {
  width: '16px',
  height: '16px',
})

export const leftIconClass = iconSlot

export const leftIconStyle = style({
  display: 'inline-flex',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  color: colors.text[4],
})

export const affixStyle = style({
  flexShrink: 0,
  color: colors.text[3],
  fontFamily: vars.fontFamily.sans,
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.regular,
})

export const togglePasswordButton = style({
  display: 'inline-flex',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  border: 'none',
  backgroundColor: 'transparent',
  color: colors.text[4],
  cursor: 'pointer',
  selectors: {
    '&:hover': {
      color: colors.text[2],
    },
  },
})

export const footerRow = style({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: vars.space[2],
  minHeight: vars.fontSize.xs,
})

export const errorMessage = style({
  flex: 1,
  color: colors.error[100],
  fontFamily: vars.fontFamily.sans,
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.regular,
  lineHeight: vars.lineHeight.normal,
})

export const countStyle = style({
  flexShrink: 0,
  marginLeft: 'auto',
  color: colors.text[4],
  fontFamily: vars.fontFamily.sans,
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.regular,
})
