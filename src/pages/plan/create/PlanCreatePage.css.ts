import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const pageStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[6],
  paddingBottom: vars.space[8],
})

export const topBarStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[3],
})

export const progressTrackStyle = style({
  flex: 1,
})

export const skipLinkStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  minHeight: vars.size.touch,
  padding: `0 ${vars.space[2]}`,
  marginRight: `-${vars.space[2]}`,
  border: 'none',
  background: 'transparent',
  fontSize: vars.fontSize.xs,
  color: colors.text[4],
  cursor: 'pointer',
  whiteSpace: 'nowrap',
})

export const stepHeaderStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
})

export const stepTitleStyle = style({
  fontSize: vars.fontSize['2xl'],
  fontWeight: vars.fontWeight.bold,
  color: colors.text[1],
  letterSpacing: '-0.03em',
})

export const stepDescriptionStyle = style({
  fontSize: vars.fontSize.sm,
  color: colors.text[4],
})

export const chipWrapStyle = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space[2],
})

export const timeFieldGroupStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
})

export const timeRowStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: vars.space[3],
  borderRadius: vars.radius.md,
  border: `1px solid ${colors.border[1]}`,
})

export const timeRowLabelStyle = style({
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.semibold,
  color: colors.text[2],
})

export const stepperRowStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space[6],
  padding: `${vars.space[8]} 0`,
})

export const stepperButtonStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
  borderRadius: vars.radius.md,
  border: `1px solid ${colors.border[1]}`,
  backgroundColor: colors.surface[1],
  fontSize: vars.fontSize.lg,
  fontWeight: vars.fontWeight.bold,
  color: colors.text[1],
  cursor: 'pointer',
  selectors: {
    '&:disabled': { color: colors.text[6], cursor: 'not-allowed' },
  },
})

export const stepperCountStyle = style({
  minWidth: '64px',
  textAlign: 'center',
  fontSize: vars.fontSize['2xl'],
  fontWeight: vars.fontWeight.bold,
  color: colors.text[1],
})

export const summaryCenterStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: `${vars.space[2]} 0`,
  textAlign: 'center',
})

export const checkCircleStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '52px',
  height: '52px',
  borderRadius: vars.radius.lg,
  backgroundColor: colors.primary[500],
  color: colors.text[5],
  fontSize: vars.fontSize.xl,
  fontWeight: vars.fontWeight.bold,
})

export const summaryTitleStyle = style({
  fontSize: vars.fontSize.lg,
  fontWeight: vars.fontWeight.bold,
  color: colors.text[1],
  marginTop: vars.space[4],
})

export const summaryDescStyle = style({
  fontSize: vars.fontSize.sm,
  color: colors.text[4],
  marginTop: vars.space[1],
})

export const summaryCardStyle = style({
  width: '100%',
  border: `1px solid ${colors.border[1]}`,
  borderRadius: vars.radius.md,
  padding: vars.space[4],
  marginTop: vars.space[5],
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
  boxSizing: 'border-box',
})

export const summaryRowStyle = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})

export const summaryRowLabelStyle = style({
  fontSize: vars.fontSize.xs,
  color: colors.text[4],
})

export const summaryRowValueStyle = style({
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.semibold,
  color: colors.text[1],
})

export const ctaGroupStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
  width: '100%',
  marginTop: vars.space[6],
})

export const secondaryLinkButtonStyle = style({
  width: '100%',
  border: 'none',
  background: 'transparent',
  padding: vars.space[3],
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.semibold,
  color: colors.text[4],
  cursor: 'pointer',
})
