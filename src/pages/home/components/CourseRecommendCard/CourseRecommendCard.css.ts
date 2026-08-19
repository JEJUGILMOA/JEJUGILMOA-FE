import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const cardStyle = style({
  display: 'flex',
  flexDirection: 'column',
  flex: '0 0 294px',
  width: '294px',
  maxWidth: '294px',
  boxSizing: 'border-box',
  borderRadius: '20px',
  border: `1px solid ${colors.border[1]}`,
  overflow: 'hidden',
  backgroundColor: colors.surface[1],
  boxShadow: vars.shadow.sm,
  fontFamily: vars.fontFamily.sans,
  textAlign: 'left',
  scrollSnapAlign: 'start',
  scrollSnapStop: 'always',
  selectors: {
    '&[data-clickable="true"]': {
      cursor: 'pointer',
    },
  },
})

export const mediaStyle = style({
  position: 'relative',
  width: '100%',
  aspectRatio: '16 / 10',
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
  top: '12px',
  left: '12px',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '6px',
  zIndex: 2,
  maxWidth: '70%',
})

export const imageTagRecipe = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '5px 10px',
    borderRadius: vars.radius.full,
    fontSize: '12px',
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

export const bodyStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[4],
  padding: vars.space[4],
})

export const infoStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
})

export const locationStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  margin: 0,
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.semibold,
  color: colors.secondary[600],
})

export const titleStyle = style({
  margin: 0,
  fontSize: '20px',
  fontWeight: vars.fontWeight.bold,
  lineHeight: 1.3,
  letterSpacing: '-0.02em',
  color: colors.text[1],
})

export const descStyle = style({
  margin: 0,
  fontSize: '14px',
  lineHeight: 1.5,
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
  gap: '8px',
  marginTop: vars.space[2],
})

export const metaItemStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  fontSize: '13px',
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

export const previewSectionStyle = style({
  display: 'flex',
  flexDirection: 'column',
})

export const previewRowStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: vars.space[2],
  width: '100%',
})

export const previewThumbStyle = style({
  width: '60px',
  height: '60px',
  flexShrink: 0,
  borderRadius: '12px',
  objectFit: 'cover',
  objectPosition: 'center',
  display: 'block',
  backgroundColor: colors.surface[5],
})

export const previewMoreStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '60px',
  height: '60px',
  flexShrink: 0,
  boxSizing: 'border-box',
  borderRadius: '12px',
  border: '1px dashed #CBD5E1',
  backgroundColor: colors.surface[3],
  color: colors.text[3],
  fontSize: '13px',
  fontWeight: vars.fontWeight.semibold,
})
