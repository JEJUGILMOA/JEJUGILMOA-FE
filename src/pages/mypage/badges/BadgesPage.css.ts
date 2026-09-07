import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { PAGE_HEADER_BLEED_VAR } from '@/components/ui/PageHeader/PageHeader.css.ts'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'
import { bodySmall, labelMedium, titleMedium, titleSmall } from '@/styles/typography.css.ts'

export const pageStyle = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  gap: vars.space[3],
  padding: vars.space[4],
  paddingTop: 0,
  paddingBottom: vars.space[8],
  backgroundColor: colors.surface[1],
  vars: {
    [PAGE_HEADER_BLEED_VAR]: vars.space[4],
  },
})

export const infoButtonStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 36,
  height: 36,
  margin: 0,
  padding: 0,
  border: 'none',
  borderRadius: vars.radius.sm,
  backgroundColor: 'transparent',
  color: colors.text[3],
  cursor: 'pointer',
  selectors: {
    '&:active': {
      backgroundColor: colors.surface[4],
    },
  },
})

export const progressCardStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
  padding: vars.space[4],
  borderRadius: vars.radius.sm,
  border: `1px solid ${colors.border[1]}`,
  backgroundColor: colors.surface[1],
})

export const progressHeaderStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space[2],
})

export const progressLabelStyle = style([
  titleMedium,
  {
    margin: 0,
    color: colors.text[1],
  },
])

export const progressCountStyle = style([
  titleMedium,
  {
    margin: 0,
    color: colors.text[4],
    fontVariantNumeric: 'tabular-nums',
  },
])

export const progressCountAccentStyle = style({
  color: colors.primary[500],
})

export const progressTrackStyle = style({
  position: 'relative',
  width: '100%',
  height: 10,
  borderRadius: vars.radius.full,
  backgroundColor: colors.surface[4],
  overflow: 'hidden',
})

export const progressFillStyle = style({
  height: '100%',
  borderRadius: vars.radius.full,
  backgroundColor: colors.primary[500],
  transition: `width ${vars.duration.normal}`,
})

export const progressMetaStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space[2],
})

export const progressPercentStyle = style([
  labelMedium,
  {
    margin: 0,
    color: colors.text[4],
    fontVariantNumeric: 'tabular-nums',
  },
])

export const progressHintStyle = style([
  bodySmall,
  {
    margin: 0,
    color: colors.text[4],
  },
])

export const groupCardRecipe = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: vars.space[4],
    padding: `${vars.space[4]} ${vars.space[3]}`,
    borderRadius: vars.radius.sm,
  },
  variants: {
    tone: {
      exploration: {
        backgroundColor: '#EAF7EF',
      },
      gourmet: {
        backgroundColor: '#FBF3E8',
      },
      social: {
        backgroundColor: '#F1EDF8',
      },
    },
  },
  defaultVariants: {
    tone: 'exploration',
  },
})

export const groupHeaderStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
  width: '100%',
  margin: 0,
  padding: 0,
  border: 'none',
  background: 'transparent',
  textAlign: 'left',
  cursor: 'default',
})

export const groupIconRecipe = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    borderRadius: vars.radius.sm,
    flexShrink: 0,
  },
  variants: {
    tone: {
      exploration: {
        color: colors.primary[600],
        backgroundColor: 'rgba(36, 185, 92, 0.14)',
      },
      gourmet: {
        color: '#E8913A',
        backgroundColor: 'rgba(232, 145, 58, 0.16)',
      },
      social: {
        color: '#7B6BBF',
        backgroundColor: 'rgba(123, 107, 191, 0.14)',
      },
    },
  },
  defaultVariants: {
    tone: 'exploration',
  },
})

export const groupTitleStyle = style([
  titleMedium,
  {
    margin: 0,
    color: colors.text[1],
    flex: 1,
    minWidth: 0,
  },
])

export const groupCountStyle = style([
  titleSmall,
  {
    margin: 0,
    color: colors.text[3],
    fontVariantNumeric: 'tabular-nums',
    flexShrink: 0,
  },
])

export const gridStyle = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  gap: `${vars.space[4]} ${vars.space[2]}`,
})

export const badgeItemStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.space[2],
  minWidth: 0,
})

export const badgeMediaRecipe = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
    height: 56,
    borderRadius: vars.radius.full,
    overflow: 'hidden',
    flexShrink: 0,
  },
  variants: {
    tone: {
      exploration: {
        backgroundColor: '#D5EFDD',
        color: colors.primary[600],
      },
      gourmet: {
        backgroundColor: '#F6E2C8',
        color: '#D97706',
      },
      social: {
        backgroundColor: '#E0D8F2',
        color: '#6D5AAF',
      },
    },
    acquired: {
      true: {
        backgroundColor: colors.surface[1],
        boxShadow: '0 0 0 2px rgba(36, 185, 92, 0.35)',
      },
      false: {},
    },
  },
  defaultVariants: {
    tone: 'exploration',
    acquired: false,
  },
})

export const badgeImageStyle = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
})

export const badgeNameStyle = style([
  titleSmall,
  {
    margin: 0,
    width: '100%',
    color: colors.text[1],
    textAlign: 'center',
    lineHeight: 1.3,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    wordBreak: 'keep-all',
  },
])

export const badgeProgressStyle = style([
  labelMedium,
  {
    margin: 0,
    color: colors.text[4],
    textAlign: 'center',
    fontVariantNumeric: 'tabular-nums',
  },
])

export const skeletonStackStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[4],
})

export const skeletonProgressCardStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
  padding: vars.space[4],
  borderRadius: vars.radius.sm,
  border: `1px solid ${colors.border[1]}`,
  backgroundColor: colors.surface[1],
})

export const skeletonGroupCardStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[4],
  padding: `${vars.space[4]} ${vars.space[3]}`,
  borderRadius: vars.radius.sm,
  backgroundColor: colors.surface[4],
})

export const skeletonBadgeCellStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.space[2],
})

export const skeletonBadgeMediaStyle = style({
  width: 56,
  height: 56,
  borderRadius: '50%',
})
