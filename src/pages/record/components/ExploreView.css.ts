import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const wrapStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
})

export const viewToggleButtonStyle = recipe({
  base: {
    display: 'inline-flex',
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    border: `1px solid ${colors.border[1]}`,
    borderRadius: vars.radius.sm,
    backgroundColor: colors.surface[1],
    color: colors.text[4],
    cursor: 'pointer',
    transition: `color ${vars.duration.fast}, background-color ${vars.duration.fast}, border-color ${vars.duration.fast}`,
    '@media': {
      '(prefers-reduced-motion: reduce)': {
        transition: 'none',
      },
    },
  },
})

export const listStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[4],
})
