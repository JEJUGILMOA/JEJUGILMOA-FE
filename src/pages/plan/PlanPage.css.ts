import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const pageStyle = style({
  padding: vars.space[2],
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[4],
})

export const listStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[6],
})

export const sectionStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
})

export const sectionHeaderStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
})

export const sectionTitleStyle = style({
  fontSize: vars.fontSize.md,
  fontWeight: vars.fontWeight.bold,
  color: colors.text[1],
})

export const sectionHintStyle = style({
  margin: 0,
  fontSize: vars.fontSize.sm,
  color: colors.text[3],
  lineHeight: 1.3,
})

export const skeletonSectionStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
})

export const skeletonCardsStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
})

export const skeletonCardStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
  padding: vars.space[4],
  borderRadius: vars.radius.lg,
  border: `1px solid ${colors.border[1]}`,
  backgroundColor: colors.surface[1],
  boxShadow: vars.shadow.sm,
})

export const skeletonTitleRowStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space[2],
  marginBottom: vars.space[1],
})
