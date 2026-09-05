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
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  minHeight: '220px',
  padding: `${vars.space[4]} ${vars.space[5]} ${vars.space[5]}`,
  backgroundImage: `linear-gradient(160deg, ${colors.secondary[400]}, ${colors.primary[500]})`,
})

export const heroActionsStyle = style({
  position: 'absolute',
  insetInline: vars.space[4],
  top: vars.space[4],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
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

export const heroTitleStyle = style({
  margin: 0,
  maxWidth: '100%',
  fontSize: vars.fontSize['2xl'],
  fontWeight: vars.fontWeight.bold,
  letterSpacing: '-0.03em',
  lineHeight: vars.lineHeight.tight,
  color: colors.text[5],
  textShadow: '0 1px 2px rgba(0, 0, 0, 0.18)',
})

export const bodyStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[5],
  padding: vars.space[5],
  backgroundColor: colors.background[1],
})

export const metaRowStyle = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space[2],
  alignItems: 'center',
  justifyContent: 'space-between',
})

export const metaTextStyle = style({
  margin: 0,
  color: colors.text[3],
  fontSize: vars.fontSize.sm,
})

export const ratingStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  color: colors.text[1],
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.semibold,
})

export const descriptionStyle = style({
  margin: 0,
  fontSize: vars.fontSize.sm,
  lineHeight: vars.lineHeight.relaxed,
  color: colors.text[2],
})

export const infoListStyle = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: vars.space[3],
  margin: 0,
  padding: vars.space[4],
  listStyle: 'none',
  borderRadius: vars.radius.lg,
  backgroundColor: colors.surface[4],
  border: `1px solid ${colors.border[1]}`,
})

export const infoItemStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.space[1],
  textAlign: 'center',
})

export const infoIconStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: colors.primary[500],
})

export const infoLabelStyle = style({
  fontSize: '12px',
  color: colors.text[4],
})

export const infoValueStyle = style({
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.semibold,
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
  flexShrink: 0,
  width: '96px',
  height: '96px',
  borderRadius: vars.radius.buttonLg,
  backgroundImage: `linear-gradient(135deg, ${colors.secondary[400]}, ${colors.primary[400]})`,
  overflow: 'hidden',
})

export const photoImgStyle = style({
  display: 'block',
  width: '100%',
  height: '100%',
  objectFit: 'cover',
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
