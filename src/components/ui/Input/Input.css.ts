import { style } from '@vanilla-extract/css'
import { vars } from '@/styles/theme.css.ts'

export const inputStyle = style({
  width: '100%',
  minHeight: vars.size.touch,
  padding: `${vars.space[3]} ${vars.space[4]}`,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  backgroundColor: vars.color.surface,
  color: vars.color.text,
  fontSize: vars.fontSize.md,
  selectors: {
    '&::placeholder': {
      color: vars.color.textMuted,
    },
    '&:focus': {
      outline: 'none',
      borderColor: vars.color.brand,
      boxShadow: `0 0 0 3px ${vars.color.brandSoft}`,
    },
  },
})
