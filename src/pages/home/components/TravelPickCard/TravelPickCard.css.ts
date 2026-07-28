import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const cardStyle = style({
  flex: '0 0 auto',
  width: '260px',
  scrollSnapAlign: 'start',
  borderRadius: vars.radius.xl,
  overflow: 'hidden',
  backgroundColor: colors.surface[1],
  border: `1px solid ${colors.border[1]}`,
  boxShadow: vars.shadow.sm,
  cursor: 'default',
  fontFamily: vars.fontFamily.sans,
  selectors: {
    '&[data-clickable="true"]': {
      cursor: 'pointer',
    },
  },
})

export const heroStyle = style({
  position: 'relative',
  height: '140px',
  overflow: 'hidden',
  backgroundColor: colors.surface[5],
})

export const heroImageStyle = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  objectPosition: 'center',
  display: 'block',
})

export const badgeStyle = style({
  position: 'absolute',
  top: '12px',
  left: '12px',
  zIndex: 5,
  padding: '6px 10px',
  borderRadius: vars.radius.full,
  backgroundColor: 'rgba(255, 255, 255, 0.92)',
  color: colors.text[1],
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.bold,
  lineHeight: 1.2,
})

export const bookmarkStyle = style({
  position: 'absolute',
  top: '10px',
  right: '10px',
  zIndex: 5,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  padding: 0,
  border: '1px solid rgba(255, 255, 255, 0.25)',
  borderRadius: vars.radius.full,
  backgroundColor: 'rgba(10, 16, 20, 0.32)',
  color: colors.text[5],
  cursor: 'pointer',
  backdropFilter: 'blur(3px)',
})

export const contentStyle = style({
  padding: vars.space[4],
})

export const eyebrowStyle = style({
  margin: `0 0 ${vars.space[1]}`,
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.bold,
  letterSpacing: '0.02em',
})

export const titleRowStyle = style({
  display: 'flex',
  alignItems: 'baseline',
  flexWrap: 'wrap',
  gap: vars.space[2],
  marginBottom: vars.space[1],
})

export const titleStyle = style({
  margin: 0,
  fontSize: vars.fontSize['2xl'],
  fontWeight: vars.fontWeight.bold,
  lineHeight: vars.lineHeight.tight,
  letterSpacing: '-0.03em',
  color: colors.text[1],
})

export const regionStyle = style({
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.medium,
  color: colors.text[3],
})

export const descStyle = style({
  margin: `${vars.space[1]} 0 ${vars.space[2]}`,
  fontSize: vars.fontSize.sm,
  lineHeight: vars.lineHeight.relaxed,
  color: colors.text[2],
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
})

export const tagsStyle = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space[2],
  marginBottom: 0,
})

export const tagStyle = style({
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.semibold,
  padding: `${vars.space[1]} ${vars.space[2]}`,
  borderRadius: vars.radius.full,
  border: '1px solid',
})
export const heroGradientStyle = style({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: '50%',
  background: 'linear-gradient(to top, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0) 100%)',
  pointerEvents: 'none',
  zIndex: 2,
})

export const heroRatingStyle = style({
  position: 'absolute',
  bottom: '10px',
  left: '12px',
  zIndex: 3,
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[1],
  fontSize: vars.fontSize.sm,
  color: 'rgba(255,255,255,0.92)',
})

export const heroRatingValueStyle = style({
  fontSize: vars.fontSize.md,
  fontWeight: vars.fontWeight.bold,
  color: '#fff',
})
