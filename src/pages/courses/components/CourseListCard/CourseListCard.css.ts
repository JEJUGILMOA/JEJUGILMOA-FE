import { globalStyle, style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const cardStyle = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  overflow: 'hidden',
  borderRadius: '16px',
  border: `1px solid ${colors.border[1]}`,
  backgroundColor: colors.surface[1],
  boxShadow: '0 4px 16px rgba(15, 23, 42, 0.08)',
  fontFamily: vars.fontFamily.sans,
  textAlign: 'left',
})

export const mainRowStyle = style({
  display: 'flex',
  alignItems: 'stretch',
  minHeight: '200px',
})

export const mediaStyle = style({
  position: 'relative',
  flex: '1 1 0',
  minWidth: 0,
  alignSelf: 'stretch',
  overflow: 'hidden',
  backgroundColor: colors.surface[5],
})

export const mediaImageStyle = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  objectPosition: 'center',
  display: 'block',
})

export const imageTagListStyle = style({
  position: 'absolute',
  top: '10px',
  left: '10px',
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  zIndex: 2,
  maxWidth: '90%',
})

export const imageTagRecipe = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    borderRadius: vars.radius.full,
    fontSize: '11px',
    fontWeight: vars.fontWeight.semibold,
    lineHeight: 1.2,
    whiteSpace: 'nowrap',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  },
  variants: {
    tone: {
      blue: {
        backgroundColor: 'rgba(233, 241, 252, 0.96)',
        color: colors.secondary[600],
      },
      pink: {
        backgroundColor: 'rgba(253, 232, 240, 0.96)',
        color: '#C5306D',
      },
      green: {
        backgroundColor: 'rgba(233, 248, 235, 0.96)',
        color: colors.primary[700],
      },
    },
  },
  defaultVariants: {
    tone: 'blue',
  },
})

export const contentStyle = style({
  flex: '2 1 0',
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
  padding: vars.space[4],
})

export const infoStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
})

export const locationStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  margin: 0,
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.semibold,
  color: colors.secondary[600],
})

export const titleStyle = style({
  margin: 0,
  fontSize: '18px',
  fontWeight: vars.fontWeight.bold,
  lineHeight: 1.3,
  letterSpacing: '-0.02em',
  color: colors.text[1],
})

export const descStyle = style({
  margin: 0,
  fontSize: '13px',
  lineHeight: 1.45,
  color: colors.text[3],
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
})

export const metaRowStyle = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '6px',
  marginTop: vars.space[1],
})

export const metaItemStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  fontSize: '12px',
  fontWeight: vars.fontWeight.medium,
  color: colors.text[3],
  whiteSpace: 'nowrap',
})

export const metaDotStyle = style({
  width: '3px',
  height: '3px',
  borderRadius: vars.radius.full,
  backgroundColor: '#CBD5E1',
  flexShrink: 0,
})

export const dividerStyle = style({
  height: '1px',
  backgroundColor: colors.border[1],
  flexShrink: 0,
})

export const previewSectionStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
  marginTop: 'auto',
})

export const previewTitleStyle = style({
  margin: 0,
  fontSize: '13px',
  fontWeight: vars.fontWeight.bold,
  color: colors.text[1],
})

export const previewRowStyle = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '8px',
  overflowX: 'auto',
  scrollbarWidth: 'none',
  selectors: {
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
})

export const previewItemStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '6px',
  flexShrink: 0,
  width: '64px',
})

export const previewThumbStyle = style({
  width: '64px',
  height: '48px',
  borderRadius: '8px',
  objectFit: 'cover',
  objectPosition: 'center',
  backgroundColor: colors.surface[5],
})

export const previewLabelStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  width: '100%',
  minWidth: 0,
})

export const stepNumStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: '14px',
  height: '14px',
  borderRadius: vars.radius.full,
  backgroundColor: colors.secondary[500],
  color: colors.surface[1],
  fontSize: '9px',
  fontWeight: vars.fontWeight.bold,
  lineHeight: 1,
})

export const stepNameStyle = style({
  fontSize: '11px',
  fontWeight: vars.fontWeight.medium,
  color: colors.text[2],
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const previewMoreStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: '64px',
  height: '48px',
  borderRadius: '8px',
  border: '1px dashed #CBD5E1',
  backgroundColor: colors.surface[3],
  color: colors.text[3],
  fontSize: '11px',
  fontWeight: vars.fontWeight.semibold,
  lineHeight: 1.3,
  textAlign: 'center',
})

export const footerStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space[3],
  padding: `${vars.space[3]} ${vars.space[4]}`,
  borderTop: `1px solid ${colors.border[1]}`,
})

export const distanceStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  minWidth: 0,
  fontSize: '13px',
  fontWeight: vars.fontWeight.medium,
  color: colors.text[3],
})

globalStyle(`${distanceStyle} svg`, {
  color: colors.secondary[600],
  flexShrink: 0,
})

export const ctaButtonStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '2px',
  flexShrink: 0,
  padding: '10px 16px',
  border: 'none',
  borderRadius: '12px',
  backgroundColor: colors.secondary[100],
  color: colors.secondary[600],
  fontSize: '13px',
  fontWeight: vars.fontWeight.bold,
  fontFamily: vars.fontFamily.sans,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
})
