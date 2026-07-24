import { style, globalStyle } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const pageStyle = style({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100%',
  backgroundColor: colors.background[1],
  fontFamily: vars.fontFamily.sans,
  paddingBottom: '88px',
})

export const heroStyle = style({
  position: 'relative',
  height: '220px',
  backgroundImage: `linear-gradient(135deg, ${colors.secondary[400]}, ${colors.primary[400]})`,
})

export const heroActionsStyle = style({
  position: 'absolute',
  insetInline: vars.space[4],
  top: vars.space[4],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

export const heroIconButtonStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
  border: 'none',
  borderRadius: vars.radius.full,
  backgroundColor: 'rgba(255, 255, 255, 0.85)',
  color: colors.text[1],
  cursor: 'pointer',
})

export const bodyStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[5],
  padding: vars.space[5],
  marginTop: '-24px',
  borderRadius: `${vars.radius.xl} ${vars.radius.xl} 0 0`,
  backgroundColor: colors.background[1],
  position: 'relative',
})

export const titleStyle = style({
  margin: 0,
  fontSize: vars.fontSize.xl,
  fontWeight: vars.fontWeight.bold,
  letterSpacing: '-0.03em',
  color: colors.text[1],
})

export const badgesRowStyle = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space[2],
})

export const sectionTitleStyle = style({
  margin: 0,
  marginBottom: vars.space[3],
  fontSize: vars.fontSize.lg,
  fontWeight: vars.fontWeight.bold,
  color: colors.text[1],
})

export const timelineStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
  margin: 0,
  padding: 0,
  listStyle: 'none',
})

export const timelineItemStyle = style({
  display: 'grid',
  gridTemplateColumns: '28px 1fr',
  gap: vars.space[3],
  alignItems: 'stretch',
})

export const timelineRailStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
})

export const timelineDotStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '28px',
  height: '28px',
  borderRadius: vars.radius.full,
  backgroundColor: colors.primary[500],
  color: colors.text[5],
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.semibold,
  flexShrink: 0,
})

export const timelineLineStyle = style({
  width: '2px',
  flex: 1,
  minHeight: '24px',
  backgroundColor: colors.primary[200],
  marginBlock: '4px',
})

export const timelineCardStyle = style({
  display: 'flex',
  gap: vars.space[3],
  alignItems: 'center',
  width: '100%',
  padding: 0,
  paddingBottom: vars.space[4],
  border: 'none',
  background: 'none',
  textAlign: 'left',
  cursor: 'pointer',
  fontFamily: vars.fontFamily.sans,
})

export const timelineThumbStyle = style({
  width: '56px',
  height: '56px',
  flexShrink: 0,
  borderRadius: vars.radius.buttonLg,
  backgroundImage: `linear-gradient(135deg, ${colors.secondary[400]}, ${colors.primary[400]})`,
})

export const timelineTextStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  minWidth: 0,
})

export const timelinePlaceTitleStyle = style({
  margin: 0,
  fontSize: vars.fontSize.md,
  fontWeight: vars.fontWeight.semibold,
  color: colors.text[1],
})

export const timelineTravelStyle = style({
  margin: 0,
  fontSize: '12px',
  color: colors.text[4],
})

export const footerStyle = style({
  position: 'fixed',
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: vars.zIndex.sticky,
  maxWidth: '720px',
  marginInline: 'auto',
  padding: `${vars.space[3]} ${vars.space[4]}`,
  paddingBottom: `calc(${vars.space[3]} + env(safe-area-inset-bottom))`,
  backgroundColor: colors.surface[1],
  borderTop: `1px solid ${colors.border[1]}`,
})

globalStyle(`${timelineItemStyle}:last-child ${timelineLineStyle}`, {
  display: 'none',
})

globalStyle(`${timelineItemStyle}:last-child ${timelineCardStyle}`, {
  paddingBottom: 0,
})
