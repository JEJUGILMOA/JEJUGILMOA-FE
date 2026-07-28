import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const cardStyle = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  gap: vars.space[3],
  padding: `${vars.space[4]} ${vars.space[1]}`,
  boxSizing: 'border-box',
  borderBottom: `1px solid ${colors.border[1]}`,
  backgroundColor: colors.surface[1],
  fontFamily: vars.fontFamily.sans,
  textAlign: 'left',
  cursor: 'default',
  selectors: {
    '&:first-child': {
      paddingTop: 0,
    },
    '&:last-child': {
      borderBottom: 'none',
      paddingBottom: 0,
    },
    '&[data-clickable="true"]': {
      cursor: 'pointer',
    },
  },
})

export const headerRowStyle = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: vars.space[2],
  minWidth: 0,
})

export const titleBlockStyle = style({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
})

export const titleRowStyle = style({
  display: 'flex',
  alignItems: 'baseline',
  flexWrap: 'wrap',
  gap: '6px',
  minWidth: 0,
})

export const titleStyle = style({
  margin: 0,
  fontSize: vars.fontSize.lg,
  fontWeight: vars.fontWeight.bold,
  lineHeight: vars.lineHeight.tight,
  letterSpacing: '-0.02em',
  color: colors.text[1],
})

export const categoryStyle = style({
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.medium,
  color: colors.text[3],
  whiteSpace: 'nowrap',
})

export const metaStyle = style({
  margin: 0,
  fontSize: vars.fontSize.sm,
  lineHeight: vars.lineHeight.normal,
  color: colors.text[3],
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const moreButtonStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: '28px',
  height: '28px',
  marginTop: '-2px',
  padding: 0,
  border: 'none',
  borderRadius: vars.radius.full,
  backgroundColor: 'transparent',
  color: colors.text[3],
  cursor: 'pointer',
})

export const imageRowStyle = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: vars.space[2],
  width: '100%',
})

export const imageStyle = style({
  width: '100%',
  aspectRatio: '1 / 1',
  borderRadius: '10px',
  objectFit: 'cover',
  objectPosition: 'center',
  display: 'block',
  backgroundColor: colors.surface[5],
})

export const imagePlaceholderStyle = style({
  width: '100%',
  aspectRatio: '1 / 1',
  borderRadius: '10px',
  backgroundImage: `linear-gradient(135deg, ${colors.secondary[300]}, ${colors.primary[300]})`,
})
