import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const cardStyle = style({
  flex: '0 0 auto',
  width: '260px',
  scrollSnapAlign: 'start',
  borderRadius: '14px',
  overflow: 'hidden',
  backgroundColor: colors.surface[1],
  boxShadow: '0 2px 12px rgba(37, 37, 45, 0.08)',
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
  aspectRatio: '4 / 3',
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

export const heroPlaceholderStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  backgroundImage: `linear-gradient(145deg, ${colors.surface[5]} 0%, ${colors.surface[4]} 100%)`,
})

export const heroPlaceholderIconStyle = style({
  color: colors.text[6],
})

export const badgeStyle = style({
  position: 'absolute',
  top: vars.space[3],
  left: vars.space[3],
  zIndex: 1,
  padding: `${vars.space[1]} ${vars.space[3]}`,
  borderRadius: vars.radius.full,
  backgroundColor: colors.surface[1],
  color: colors.text[1],
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.semibold,
  lineHeight: 1.2,
  boxShadow: '0 1px 4px rgba(37, 37, 45, 0.1)',
})

export const bookmarkStyle = style({
  position: 'absolute',
  top: vars.space[3],
  right: vars.space[3],
  zIndex: 1,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '36px',
  height: '36px',
  padding: 0,
  border: 'none',
  borderRadius: vars.radius.full,
  backgroundColor: colors.surface[1],
  color: colors.text[1],
  cursor: 'pointer',
  boxShadow: '0 1px 4px rgba(37, 37, 45, 0.12)',
})

export const contentStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  padding: `${vars.space[3]} ${vars.space[4]} ${vars.space[4]}`,
})

export const titleStyle = style({
  margin: 0,
  fontSize: vars.fontSize.lg,
  fontWeight: vars.fontWeight.bold,
  lineHeight: vars.lineHeight.tight,
  letterSpacing: '-0.03em',
  color: colors.text[1],
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const regionStyle = style({
  margin: 0,
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.regular,
  lineHeight: vars.lineHeight.normal,
  color: colors.text[3],
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const addressStyle = style({
  margin: `${vars.space[1]} 0 0`,
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.regular,
  lineHeight: 1.45,
  color: colors.text[4],
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
})
