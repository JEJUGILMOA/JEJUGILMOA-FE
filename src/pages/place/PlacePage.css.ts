import { style } from '@vanilla-extract/css'
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

export const metaRowStyle = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space[2],
  alignItems: 'center',
  marginTop: vars.space[2],
  color: colors.text[3],
  fontSize: vars.fontSize.sm,
})

export const ratingStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  color: colors.text[1],
  fontWeight: vars.fontWeight.semibold,
})

export const descriptionStyle = style({
  margin: 0,
  fontSize: vars.fontSize.sm,
  lineHeight: vars.lineHeight.relaxed,
  color: colors.text[2],
})

export const infoListStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
  margin: 0,
  padding: 0,
  listStyle: 'none',
})

export const infoItemStyle = style({
  display: 'grid',
  gridTemplateColumns: '72px 1fr',
  gap: vars.space[3],
  fontSize: vars.fontSize.sm,
})

export const infoLabelStyle = style({
  color: colors.text[4],
})

export const infoValueStyle = style({
  color: colors.text[1],
})

export const sectionTitleStyle = style({
  margin: 0,
  marginBottom: vars.space[3],
  fontSize: vars.fontSize.lg,
  fontWeight: vars.fontWeight.bold,
  color: colors.text[1],
})

export const photoListStyle = style({
  display: 'flex',
  gap: vars.space[2],
  overflowX: 'auto',
  scrollbarWidth: 'none',
  selectors: {
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
})

export const photoItemStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: '96px',
  height: '96px',
  borderRadius: vars.radius.buttonLg,
  backgroundImage: `linear-gradient(135deg, ${colors.secondary[400]}, ${colors.primary[400]})`,
  color: colors.text[5],
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.medium,
})

export const reviewListStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[4],
  margin: 0,
  padding: 0,
  listStyle: 'none',
})

export const reviewItemStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
})

export const reviewHeaderStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space[3],
})

export const reviewUserStyle = style({
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.semibold,
  color: colors.text[1],
})

export const reviewDateStyle = style({
  fontSize: '12px',
  color: colors.text[4],
})

export const reviewContentStyle = style({
  margin: 0,
  fontSize: vars.fontSize.sm,
  lineHeight: vars.lineHeight.relaxed,
  color: colors.text[2],
})

export const footerStyle = style({
  position: 'fixed',
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: vars.zIndex.sticky,
  maxWidth: '720px',
  marginInline: 'auto',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: vars.space[2],
  padding: `${vars.space[3]} ${vars.space[4]}`,
  paddingBottom: `calc(${vars.space[3]} + env(safe-area-inset-bottom))`,
  backgroundColor: colors.surface[1],
  borderTop: `1px solid ${colors.border[1]}`,
})
