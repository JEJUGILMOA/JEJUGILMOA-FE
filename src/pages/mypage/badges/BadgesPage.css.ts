import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'
import { bodySmall, titleMedium, titleSmall } from '@/styles/typography.css.ts'

export const pageStyle = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  gap: vars.space[4],
  padding: vars.space[4],
  paddingTop: 0,
  backgroundColor: colors.surface[1],
})

export const progressCardStyle = style({
  padding: vars.space[4],
  borderRadius: vars.radius.lg,
  backgroundColor: colors.primary[100],
})

export const progressTextStyle = style([
  titleMedium,
  {
    margin: `0 0 ${vars.space[1]}`,
    color: colors.primary[800],
  },
])

export const gridStyle = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: vars.space[3],
})

export const badgeCardStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
  padding: vars.space[3],
  borderRadius: vars.radius.lg,
  border: `1px solid ${colors.border[1]}`,
  backgroundColor: colors.surface[1],
  minHeight: 110,
})

export const lockedStyle = style({
  opacity: 0.45,
})

export const badgeNameStyle = style([
  titleSmall,
  {
    margin: 0,
    color: colors.text[1],
  },
])

export const badgeDescStyle = style([
  bodySmall,
  {
    margin: 0,
    color: colors.text[4],
  },
])
