import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'
import { bodySmall, titleLarge } from '@/styles/typography.css.ts'

export const pageStyle = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  gap: vars.space[4],
  marginInline: `calc(-1 * ${vars.space[3]})`,
  padding: vars.space[4],
  backgroundColor: colors.surface[1],
})

export const profileButtonStyle = style({
  display: 'block',
  width: '100%',
  padding: vars.space[2],
  border: 'none',
  borderRadius: vars.radius.md,
  backgroundColor: 'transparent',
  cursor: 'pointer',
  textAlign: 'left',
  selectors: {
    '&:active': {
      backgroundColor: colors.surface[3],
    },
  },
})

export const profileRowStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[3],
})

export const profileMetaBlockStyle = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  minWidth: 0,
  flex: 1,
})

export const profileMetaStyle = style({
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
  flex: 1,
})

export const nameStyle = style([
  titleLarge,
  {
    color: colors.text[1],
  },
])

export const emailStyle = style([
  bodySmall,
  {
    color: colors.text[4],
  },
])

export const chevronStyle = style({
  flexShrink: 0,
  color: colors.text[4],
})

export const menuListStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
  backgroundColor: colors.surface[1],
  borderRadius: vars.radius.lg,
  overflow: 'hidden',
  paddingInline: vars.space[1],
})

export const devAuthButtonStyle = style({
  marginTop: vars.space[2],
})
