import { style, globalStyle } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
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

/** 하단 CTA가 없을 때 — 홈 등에서 상세만 볼 때 */
export const pageWithoutCtaStyle = style({
  paddingBottom: `calc(${vars.space[4]} + env(safe-area-inset-bottom))`,
})

export const heroStyle = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  minHeight: '220px',
  margin: vars.space[2],
  borderRadius: vars.radius.sm,
  overflow: 'hidden',
  backgroundImage: `linear-gradient(160deg, ${colors.secondary[400]}, ${colors.primary[500]})`,
})

export const heroImageStyle = style({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  objectPosition: 'center',
  display: 'block',
})

export const heroOverlayStyle = style({
  position: 'absolute',
  inset: 0,
  backgroundImage:
    'linear-gradient(180deg, rgba(15, 23, 42, 0.15) 0%, rgba(15, 23, 42, 0.35) 45%, rgba(15, 23, 42, 0.72) 100%)',
  pointerEvents: 'none',
})

export const heroActionsStyle = style({
  position: 'absolute',
  insetInline: vars.space[4],
  top: vars.space[4],
  zIndex: 2,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: vars.space[2],
})

export const heroIconButtonStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
  border: 'none',
  borderRadius: vars.radius.full,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  color: colors.text[1],
  cursor: 'pointer',
  selectors: {
    '&:disabled': {
      opacity: 0.6,
      cursor: 'default',
    },
    '&[aria-pressed="true"]': {
      color: colors.primary[500],
    },
  },
})

export const heroCopyStyle = style({
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
  padding: vars.space[3],
  minWidth: 0,
})

export const heroTitleStyle = style({
  margin: 0,
  maxWidth: '100%',
  fontSize: '26px',
  fontWeight: vars.fontWeight.bold,
  letterSpacing: '-0.03em',
  lineHeight: 1.25,
  color: colors.text[5],
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const bodyStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
  padding: `0 ${vars.space[2]}`,
  backgroundColor: colors.background[1],
})

export const summaryRowStyle = style({
  display: 'grid',
  paddingBlock: vars.space[4],
  borderRadius: vars.radius.sm,
  backgroundColor: colors.surface[1],
  border: `1px solid ${colors.border[1]}`,
})

export const summaryItemStyle = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '4px',
  minWidth: 0,
  paddingInline: vars.space[2],
})

export const summaryDividerStyle = style({
  position: 'absolute',
  left: 0,
  top: '50%',
  width: '1px',
  height: '28px',
  transform: 'translateY(-50%)',
  backgroundColor: colors.border[1],
})

export const summaryIconRecipe = recipe({
  base: {
    width: '24px',
    height: '24px',
    flexShrink: 0,
    display: 'block',
  },
  variants: {
    tone: {
      green: {
        color: colors.primary[500],
      },
      blue: {
        color: colors.secondary[400],
      },
    },
  },
  defaultVariants: {
    tone: 'blue',
  },
})

export const summaryValueStyle = style({
  margin: 0,
  minWidth: 0,
  color: colors.text[1],
  fontSize: '15px',
  fontWeight: vars.fontWeight.semibold,
  lineHeight: 1.3,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const sectionStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
  marginTop: vars.space[3],
})

export const sectionHeaderStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space[2],
  padding: `0 ${vars.space[2]}`,
})

export const sectionTitleStyle = style({
  margin: 0,
  fontSize: vars.fontSize.lg,
  fontWeight: vars.fontWeight.bold,
  color: colors.text[1],
})

export const keywordHeaderTitleStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  margin: 0,
  fontSize: vars.fontSize.lg,
  fontWeight: vars.fontWeight.bold,
  color: colors.text[1],
})

export const sectionCountStyle = style({
  margin: 0,
  color: colors.text[4],
  fontSize: '12px',
  fontWeight: vars.fontWeight.medium,
})

export const introCardStyle = style({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '20px',
  minHeight: '156px',
})

export const introBackgroundStyle = style({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  objectPosition: 'bottom right',
  pointerEvents: 'none',
})

export const introContentStyle = style({
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
  padding: vars.space[4],
})

export const introTitleStyle = style({
  margin: 0,
  fontSize: vars.fontSize.lg,
  fontWeight: vars.fontWeight.bold,
  color: colors.text[1],
})

export const descriptionStyle = style({
  margin: 0,
  fontSize: '15px',
  lineHeight: 1.65,
  color: colors.text[1],
  whiteSpace: 'pre-wrap',
})

export const descriptionCollapsedStyle = style({
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
})

export const moreButtonStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '2px',
  alignSelf: 'flex-start',
  margin: 0,
  padding: 0,
  border: 'none',
  background: 'none',
  color: colors.primary[500],
  fontSize: '13px',
  fontWeight: vars.fontWeight.semibold,
  fontFamily: vars.fontFamily.sans,
  cursor: 'pointer',
})

export const keywordListStyle = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  paddingInline: vars.space[2],
})

export const keywordRecipe = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '8px 12px',
    borderRadius: vars.radius.full,
    fontSize: '13px',
    fontWeight: vars.fontWeight.semibold,
    lineHeight: 1.2,
  },
  variants: {
    tone: {
      blue: {
        backgroundColor: colors.secondary[100],
        color: colors.secondary[700],
      },
      pink: {
        backgroundColor: 'rgba(253, 232, 240, 1)',
        color: '#C5306D',
      },
      green: {
        backgroundColor: colors.primary[100],
        color: colors.primary[700],
      },
    },
  },
  defaultVariants: {
    tone: 'blue',
  },
})

export const timelineStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
  margin: 0,
  padding: `0 ${vars.space[2]}`,
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
  width: 0,
  flex: 1,
  minHeight: '20px',
  marginBlock: '4px',
  borderLeft: `2px dashed ${colors.primary[200]}`,
})

export const timelineCardStyle = style({
  display: 'flex',
  gap: vars.space[3],
  alignItems: 'center',
  width: '100%',
  paddingBottom: `${vars.space[4]}`,
  border: 'none',
  borderRadius: 0,
  backgroundColor: 'transparent',
  boxShadow: 'none',
  textAlign: 'left',
  cursor: 'pointer',
  fontFamily: vars.fontFamily.sans,
})

export const timelineThumbStyle = style({
  width: '64px',
  height: '64px',
  flexShrink: 0,
  borderRadius: vars.radius.md,
  backgroundImage: `linear-gradient(135deg, ${colors.secondary[400]}, ${colors.primary[400]})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
})

export const timelineTextStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  flex: 1,
  minWidth: 0,
})

export const timelinePlaceTitleStyle = style({
  margin: 0,
  fontSize: vars.fontSize.md,
  fontWeight: vars.fontWeight.semibold,
  color: colors.text[1],
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const timelinePlaceDescStyle = style({
  margin: 0,
  fontSize: '12px',
  lineHeight: 1.4,
  color: colors.text[4],
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const timelineChevronStyle = style({
  flexShrink: 0,
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
  marginBottom: 0,
})
