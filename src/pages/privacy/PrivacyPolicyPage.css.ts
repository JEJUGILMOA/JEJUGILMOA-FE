import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'
import { bodyLarge, heading3, titleMedium } from '@/styles/typography.css.ts'

export const pageStyle = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  gap: vars.space[4],
  padding: vars.space[4],
  paddingBottom: vars.space[10],
  backgroundColor: colors.surface[1],
})

export const docTitleStyle = style([
  heading3,
  {
    margin: 0,
    color: colors.text[1],
  },
])

export const leadStyle = style([
  bodyLarge,
  {
    margin: 0,
    color: colors.text[2],
    lineHeight: 1.7,
  },
])

export const effectiveDateStyle = style({
  margin: 0,
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.semibold,
  color: colors.text[1],
})

export const dividerStyle = style({
  height: 1,
  backgroundColor: colors.border[1],
  border: 'none',
  margin: 0,
})

export const sectionStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
})

export const sectionTitleStyle = style([
  titleMedium,
  {
    margin: 0,
    color: colors.text[1],
  },
])

export const subsectionTitleStyle = style({
  margin: 0,
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.semibold,
  color: colors.text[1],
})

export const paragraphStyle = style({
  margin: 0,
  fontSize: vars.fontSize.sm,
  lineHeight: 1.7,
  color: colors.text[2],
})

export const listStyle = style({
  margin: 0,
  paddingLeft: vars.space[5],
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
  fontSize: vars.fontSize.sm,
  lineHeight: 1.7,
  color: colors.text[2],
})

export const tableWrapStyle = style({
  width: '100%',
  overflowX: 'auto',
  border: `1px solid ${colors.border[1]}`,
  borderRadius: vars.radius.md,
})

export const tableStyle = style({
  width: '100%',
  minWidth: 480,
  borderCollapse: 'collapse',
  fontSize: vars.fontSize.xs,
  lineHeight: 1.5,
})

export const thStyle = style({
  padding: `${vars.space[2]} ${vars.space[3]}`,
  textAlign: 'left',
  fontWeight: vars.fontWeight.semibold,
  color: colors.text[1],
  backgroundColor: colors.surface[3],
  borderBottom: `1px solid ${colors.border[1]}`,
  verticalAlign: 'top',
})

export const tdStyle = style({
  padding: `${vars.space[2]} ${vars.space[3]}`,
  textAlign: 'left',
  color: colors.text[2],
  borderBottom: `1px solid ${colors.border[1]}`,
  verticalAlign: 'top',
})

export const noteStyle = style({
  margin: 0,
  fontSize: vars.fontSize.xs,
  lineHeight: 1.6,
  color: colors.text[3],
})

export const strongInlineStyle = style({
  fontWeight: vars.fontWeight.semibold,
  color: colors.text[1],
})
