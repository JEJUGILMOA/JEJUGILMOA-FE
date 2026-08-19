import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'
import { bodySmall, titleSmall } from '@/styles/typography.css.ts'

export const pageStyle = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  gap: vars.space[5],
  padding: vars.space[4],
  paddingTop: 0,
  backgroundColor: colors.surface[1],
})

export const saveButtonStyle = style([
  titleSmall,
  {
    border: 'none',
    background: 'transparent',
    color: colors.primary[700],
    cursor: 'pointer',
    padding: vars.space[2],
  },
])

export const avatarWrapStyle = style({
  position: 'relative',
  width: 74,
  height: 74,
  marginInline: 'auto',
})

export const editBadgeStyle = style({
  position: 'absolute',
  right: -2,
  bottom: -2,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 30,
  height: 30,
  borderRadius: '50%',
  border: `3px solid ${colors.surface[1]}`,
  backgroundColor: colors.text[1],
  color: colors.text[5],
  cursor: 'pointer',
  padding: 0,
})

export const fieldGroupStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[4],
})

export const emailReadonlyStyle = style([
  bodySmall,
  {
    margin: `${vars.space[1]} 0 0`,
    color: colors.text[4],
  },
])

export const readonlyFieldStyle = style({
  display: 'flex',
  alignItems: 'center',
  minHeight: 44,
  paddingInline: vars.space[3],
  borderRadius: 12,
  backgroundColor: colors.background[2],
  color: colors.text[4],
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.semibold,
})

export const fieldLabelStyle = style([
  bodySmall,
  {
    display: 'block',
    marginBottom: vars.space[2],
    color: colors.text[4],
  },
])
