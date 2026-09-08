import { style } from '@vanilla-extract/css'
import { PAGE_HEADER_BLEED_VAR } from '@/components/ui/PageHeader/PageHeader.css.ts'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'
import { bodySmall, titleLarge } from '@/styles/typography.css.ts'

export const pageStyle = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  gap: vars.space[3],
  padding: vars.space[4],
  paddingTop: 0,
  backgroundColor: colors.surface[1],
  vars: {
    [PAGE_HEADER_BLEED_VAR]: vars.space[4],
  },
})

export const listStyle = style({
  margin: 0,
  padding: 0,
  listStyle: 'none',
  display: 'flex',
  flexDirection: 'column',
})

export const listItemStyle = style({
  selectors: {
    '& + &': {
      marginTop: vars.space[6],
      paddingTop: vars.space[4],
      borderTop: `1px solid ${colors.border[1]}`,
    },
  },
})

export const itemStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
  width: '100%',
  padding: 0,
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  textAlign: 'left',
  overflow: 'hidden',
})

export const metaStyle = style({
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
  paddingInline: 2,
})

export const titleRowStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
  minWidth: 0,
})

export const nameStyle = style([
  titleLarge,
  {
    color: colors.text[1],
    fontWeight: vars.fontWeight.bold,
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
])

export const categoryStyle = style([
  bodySmall,
  {
    flexShrink: 0,
    padding: `2px ${vars.space[2]}`,
    borderRadius: vars.radius.sm,
    backgroundColor: colors.primary[100],
    color: colors.primary[700],
    fontWeight: vars.fontWeight.medium,
  },
])

export const addressStyle = style([
  bodySmall,
  {
    margin: 0,
    color: colors.text[4],
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
])

export const coverStyle = style({
  position: 'relative',
  width: '100%',
  height: 100,
  overflow: 'hidden',
  borderRadius: vars.radius.sm,
  backgroundColor: colors.surface[4],
})

export const coverImageStyle = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  objectPosition: 'center',
  display: 'block',
})

export const coverPlaceholderStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  backgroundImage: `linear-gradient(145deg, ${colors.surface[5]} 0%, ${colors.surface[4]} 100%)`,
  color: colors.text[6],
})

export const skeletonItemStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
  width: '100%',
  selectors: {
    '& + &': {
      marginTop: vars.space[3],
      paddingTop: vars.space[3],
      borderTop: `1px solid ${colors.border[1]}`,
    },
  },
})

export const skeletonMetaStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
})

export const skeletonCoverStyle = style({
  width: '100%',
  height: 100,
  borderRadius: vars.radius.md,
})
