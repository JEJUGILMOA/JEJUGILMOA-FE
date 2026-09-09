import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const pageStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[4],
  padding: vars.space[4],
  paddingBottom: vars.space[8],
  minHeight: '100%',
  backgroundColor: colors.background[1],
  fontFamily: vars.fontFamily.sans,
})

export const chipRowStyle = style({
  display: 'flex',
  gap: vars.space[2],
})

export const mapCanvasStyle = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
  minHeight: '140px',
  padding: vars.space[4],
  borderRadius: vars.radius.lg,
  border: `1px solid ${colors.border[1]}`,
  backgroundImage: `linear-gradient(160deg, ${colors.secondary[100]}, ${colors.primary[100]})`,
})

export const searchHereWrapStyle = style({
  position: 'sticky',
  top: vars.space[2],
  zIndex: vars.zIndex.sticky,
  display: 'flex',
  justifyContent: 'center',
  pointerEvents: 'none',
})

export const searchHereButtonStyle = style({
  pointerEvents: 'auto',
  margin: 0,
  padding: `${vars.space[2]} ${vars.space[4]}`,
  border: 'none',
  borderRadius: vars.radius.full,
  backgroundColor: colors.surface[1],
  color: colors.text[1],
  fontFamily: vars.fontFamily.sans,
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.semibold,
  letterSpacing: '-0.02em',
  boxShadow: vars.shadow.md,
  cursor: 'pointer',
  selectors: {
    '&:hover': {
      backgroundColor: colors.surface[3],
    },
    '&:active': {
      backgroundColor: colors.surface[4],
    },
  },
})

export const mapHintStyle = style({
  margin: 0,
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.semibold,
  color: colors.text[1],
})

export const statusStyle = style({
  margin: 0,
  fontSize: '12px',
  color: colors.text[3],
  lineHeight: vars.lineHeight.relaxed,
})

export const sectionTitleStyle = style({
  margin: `0 0 ${vars.space[2]}`,
  fontSize: vars.fontSize.md,
  fontWeight: vars.fontWeight.bold,
  color: colors.text[1],
})

export const listStyle = style({
  display: 'flex',
  flexDirection: 'column',
  margin: 0,
  padding: 0,
  listStyle: 'none',
  borderRadius: vars.radius.lg,
  border: `1px solid ${colors.border[1]}`,
  overflow: 'hidden',
  backgroundColor: colors.surface[1],
})

export const listItemStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  width: '100%',
  margin: 0,
  padding: vars.space[3],
  border: 'none',
  borderBottom: `1px solid ${colors.border[1]}`,
  background: 'none',
  textAlign: 'left',
  cursor: 'pointer',
  fontFamily: vars.fontFamily.sans,
  selectors: {
    '&:last-child': {
      borderBottom: 'none',
    },
  },
})

export const listTitleStyle = style({
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.semibold,
  color: colors.text[1],
})

export const listMetaStyle = style({
  fontSize: '12px',
  color: colors.text[4],
})

export const heatmapListStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
  margin: 0,
  padding: 0,
  listStyle: 'none',
})

export const heatmapItemStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
})

export const heatmapDotStyle = style({
  width: '12px',
  height: '12px',
  borderRadius: vars.radius.full,
  backgroundColor: colors.warning[500],
  selectors: {
    '&[data-level="CROWDED"]': {
      backgroundColor: colors.error[100],
    },
    '&[data-level="MODERATE"]': {
      backgroundColor: colors.warning[500],
    },
  },
})

export const heatmapMetaStyle = style({
  fontSize: '12px',
  color: colors.text[3],
})
