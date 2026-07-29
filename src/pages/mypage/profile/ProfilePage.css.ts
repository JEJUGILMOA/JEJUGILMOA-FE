import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'
import {
  bodyLarge,
  bodyMedium,
  heading2,
  labelMedium,
  titleLarge,
  titleMedium,
} from '@/styles/typography.css.ts'

export const pageStyle = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  gap: vars.space[4],
  padding: vars.space[4],
  paddingTop: 0,
  backgroundColor: colors.surface[1],
})

export const profileBlockStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.space[3],
  paddingTop: vars.space[2],
})

export const nameStyle = style([
  heading2,
  {
    margin: 0,
    color: colors.text[1],
  },
])

export const bioStyle = style([
  bodyMedium,
  {
    margin: 0,
    color: colors.text[4],
  },
])

export const statsRowStyle = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  borderTop: `1px solid ${colors.border[1]}`,
  borderBottom: `1px solid ${colors.border[1]}`,
  paddingBlock: vars.space[3],
})

export const statsItemStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 2,
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  padding: vars.space[1],
})

export const statsValueStyle = style([
  titleLarge,
  {
    color: colors.text[1],
  },
])

export const statsLabelStyle = style([
  labelMedium,
  {
    color: colors.text[4],
  },
])

export const infoRowStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${vars.space[3]} ${vars.space[3]}`,
  gap: vars.space[3],
  minHeight: 48,
  borderBottom: `1px solid ${colors.border[1]}`,
})

export const infoLabelStyle = style([
  bodyLarge,
  {
    color: colors.text[3],
  },
])

export const infoValueStyle = style([
  titleMedium,
  {
    color: colors.text[1],
  },
])

export const editButtonStyle = style({
  marginTop: vars.space[4],
})
