import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const pageHeaderRoot = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space[3],
  minHeight: vars.size.header,
  padding: `${vars.space[2]} ${vars.space[4]}`,
})

export const pageHeaderLeft = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
  minWidth: 0,
  flex: 1,
})

export const pageHeaderTitle = style({
  margin: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const backButton = style({
  display: 'inline-flex',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  width: vars.size.touch,
  height: vars.size.touch,
  margin: `0 -${vars.space[2]}`,
  padding: 0,
  border: 'none',
  borderRadius: vars.radius.sm,
  backgroundColor: 'transparent',
  color: colors.text[1],
  cursor: 'pointer',
  transition: `background-color ${vars.duration.fast}`,
  selectors: {
    '&:hover': {
      backgroundColor: colors.surface[4],
    },
    '&:active': {
      backgroundColor: colors.surface[5],
    },
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
})

export const pageHeaderRight = style({
  display: 'flex',
  flexShrink: 0,
  alignItems: 'center',
  gap: vars.space[2],
})
