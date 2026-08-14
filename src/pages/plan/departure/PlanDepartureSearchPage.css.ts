import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const pageStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[5],
  paddingBottom: vars.space[8],
})

export const doneLinkStyle = style({
  flexShrink: 0,
  border: 'none',
  background: 'transparent',
  padding: 0,
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.semibold,
  color: colors.text[4],
  cursor: 'pointer',
  whiteSpace: 'nowrap',
})

export const headerBlockStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
})

export const titleStyle = style({
  fontSize: vars.fontSize['2xl'],
  fontWeight: vars.fontWeight.bold,
  color: colors.text[1],
  letterSpacing: '-0.03em',
})

export const descriptionStyle = style({
  fontSize: vars.fontSize.sm,
  color: colors.text[4],
})

export const selectedCardStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
  padding: vars.space[4],
  borderRadius: vars.radius.md,
  border: `1px solid ${colors.primary[300]}`,
  backgroundColor: colors.primary[100],
})

export const selectedCardTitleStyle = style({
  fontSize: vars.fontSize.md,
  fontWeight: vars.fontWeight.bold,
  color: colors.primary[700],
})

export const selectedCardMetaStyle = style({
  fontSize: vars.fontSize.xs,
  color: colors.text[3],
})

export const listStyle = style({
  display: 'flex',
  flexDirection: 'column',
})

export const rowStyle = style({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  gap: vars.space[3],
  padding: `${vars.space[3]} 0`,
  border: 'none',
  borderBottom: `1px solid ${colors.border[1]}`,
  background: 'none',
  textAlign: 'left',
  cursor: 'pointer',
  selectors: {
    '&:last-child': { borderBottom: 'none' },
  },
})

export const thumbnailStyle = style({
  flexShrink: 0,
  width: '44px',
  height: '44px',
  borderRadius: vars.radius.sm,
  backgroundColor: colors.surface[4],
})

export const infoColumnStyle = style({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
})

export const rowTitleStyle = style({
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.bold,
  color: colors.text[1],
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const rowMetaStyle = style({
  fontSize: vars.fontSize.xs,
  color: colors.text[4],
})

export const emptyTextStyle = style({
  padding: `${vars.space[8]} 0`,
  textAlign: 'center',
  fontSize: vars.fontSize.sm,
  color: colors.text[4],
})
