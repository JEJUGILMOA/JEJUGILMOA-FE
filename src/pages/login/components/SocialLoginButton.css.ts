import { style } from '@vanilla-extract/css'
import { vars } from '@/styles/vars.css.ts'

export const buttonStyle = style({
  height: 52,
  borderRadius: 12,
  borderWidth: 1,
  borderStyle: 'solid',
  width: '100%',
  padding: `0 ${vars.space[5]}`,
  cursor: 'pointer',
  fontFamily: vars.fontFamily.sans,
  selectors: {
    '&:disabled': {
      opacity: 0.7,
      cursor: 'not-allowed',
    },
    '&:not(:disabled):active': {
      opacity: 0.9,
    },
  },
})

export const contentStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 10,
})

export const iconSlotStyle = style({
  width: 20,
  height: 20,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
})

export const labelStyle = style({
  fontSize: vars.fontSize.md,
  fontWeight: vars.fontWeight.semibold,
})
