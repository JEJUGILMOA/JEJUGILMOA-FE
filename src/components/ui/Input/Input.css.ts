import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const inputStyle = style({
  width: '100%',
  minHeight: vars.size.touch,
  padding: `${vars.space[3]} ${vars.space[4]}`,
  borderRadius: vars.radius.md,
  border: `1px solid ${colors.border[1]}`,
  backgroundColor: colors.surface[1],
  color: colors.text[1],
  fontSize: vars.fontSize.md,
  selectors: {
    '&::placeholder': {
      color: colors.text[3],
    },
    '&:focus': {
      outline: 'none',
      borderColor: colors.primary[500],
      boxShadow: `0 0 0 3px ${colors.primary[100]}`,
    },
  },
})
