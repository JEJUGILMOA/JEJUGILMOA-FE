import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const pageStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[5],
  paddingInline: vars.space[1],
  paddingBottom: vars.space[8],
})

export const tripHeaderStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
  paddingInline: vars.space[3],
  paddingTop: vars.space[1],
})

export const tripTitleStyle = style({
  fontSize: vars.fontSize['2xl'],
  fontWeight: vars.fontWeight.bold,
  color: colors.text[1],
  letterSpacing: '-0.03em',
})

export const tripMetaStyle = style({
  fontSize: vars.fontSize.sm,
  color: colors.text[4],
})

export const sectionListStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[4],
})

export const sectionHeaderRowStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: vars.space[3],
})

export const sectionTitleStyle = style({
  fontSize: vars.fontSize.md,
  fontWeight: vars.fontWeight.bold,
  color: colors.text[1],
})

export const editButtonStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '28px',
  height: '28px',
  border: 'none',
  borderRadius: vars.radius.full,
  backgroundColor: 'transparent',
  color: colors.text[4],
  cursor: 'pointer',
  selectors: {
    '&:hover': { backgroundColor: colors.surface[4], color: colors.text[2] },
  },
})

export const dayListStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
})

export const dayRowStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
})

export const dayLabelRowStyle = style({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
})

export const dayLabelStyle = style({
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.semibold,
  color: colors.text[2],
})

export const dayMetaStyle = style({
  fontSize: vars.fontSize.xs,
  color: colors.text[4],
})

export const dayPlacesStyle = style({
  fontSize: vars.fontSize.sm,
  color: colors.text[3],
})

export const budgetRowStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${vars.space[1]} 0`,
})

export const budgetRowLabelStyle = style({
  fontSize: vars.fontSize.sm,
  color: colors.text[3],
})

export const budgetRowValueStyle = style({
  fontSize: vars.fontSize.sm,
  color: colors.text[2],
})

export const budgetTotalRowStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${vars.space[2]} 0 0`,
  marginTop: vars.space[1],
  borderTop: `1px solid ${colors.border[1]}`,
})

export const budgetTotalLabelStyle = style({
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.semibold,
  color: colors.text[1],
})

export const budgetTotalValueStyle = style({
  fontSize: vars.fontSize.lg,
  fontWeight: vars.fontWeight.bold,
  color: colors.primary[700],
})

export const emptyHintStyle = style({
  fontSize: vars.fontSize.sm,
  color: colors.text[4],
})
