import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'
import { bodyMedium, heading3 } from '@/styles/typography.css.ts'

export const pageStyle = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  gap: vars.space[4],
  padding: vars.space[4],
  paddingBottom: vars.space[10],
  backgroundColor: colors.surface[1],
})

export const sectionStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
  paddingTop: vars.space[2],
})

export const titleStyle = style([
  heading3,
  {
    margin: 0,
    color: colors.text[1],
  },
])

export const descStyle = style([
  bodyMedium,
  {
    margin: 0,
    color: colors.text[4],
  },
])

export const emailLinkStyle = style({
  display: 'inline-flex',
  alignSelf: 'flex-start',
  marginTop: vars.space[2],
  textDecoration: 'none',
})

export const emailStyle = style({
  fontSize: vars.fontSize.md,
  fontWeight: vars.fontWeight.semibold,
  color: colors.primary[600],
  textDecoration: 'underline',
  textUnderlineOffset: 3,
})
