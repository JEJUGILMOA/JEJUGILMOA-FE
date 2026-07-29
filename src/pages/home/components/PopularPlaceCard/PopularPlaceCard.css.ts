import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const cardStyle = style({
  display: 'flex',
  flexDirection: 'column',
  flexShrink: 0,
  width: '148px',
  overflow: 'hidden',
  borderRadius: vars.radius.lg,
  border: `1px solid ${colors.border[1]}`,
  backgroundColor: colors.surface[1],
  fontFamily: vars.fontFamily.sans,
  textAlign: 'left',
  cursor: 'default',
  selectors: {
    '&[data-clickable="true"]': {
      cursor: 'pointer',
    },
  },
})

export const imageStyle = style({
  width: '100%',
  aspectRatio: '1 / 1',
  overflow: 'hidden',
  backgroundImage: `linear-gradient(135deg, ${colors.secondary[400]}, ${colors.primary[400]})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
})

export const imageImgStyle = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  objectPosition: 'center',
  display: 'block',
})

export const contentStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
  padding: vars.space[3],
  minWidth: 0,
})

export const titleStyle = style({
  margin: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  color: colors.text[1],
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.semibold,
  lineHeight: vars.lineHeight.tight,
  letterSpacing: '-0.025em',
})

export const ratingStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '2px',
  color: colors.warning[500],
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.semibold,
  lineHeight: 1.2,
})

export const ratingIconStyle = style({
  flexShrink: 0,
})
