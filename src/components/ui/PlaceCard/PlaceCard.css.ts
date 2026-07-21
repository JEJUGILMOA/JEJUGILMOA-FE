import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const placeCardRecipe = recipe({
  base: {
    display: 'flex',
    overflow: 'hidden',
    border: 'none',
    padding: 0,
    backgroundColor: colors.surface[1],
    fontFamily: vars.fontFamily.sans,
    textAlign: 'left',
    cursor: 'default',
    selectors: {
      '&[data-clickable="true"]': {
        cursor: 'pointer',
        transition: `box-shadow ${vars.duration.fast}`,
      },
      '&[data-clickable="true"]:hover': {
        boxShadow: vars.shadow.sm,
      },
    },
    '@media': {
      '(prefers-reduced-motion: reduce)': {
        selectors: {
          '&[data-clickable="true"]': {
            transition: 'none',
          },
        },
      },
    },
  },
  variants: {
    variant: {
      vertical: {
        flexDirection: 'column',
        borderRadius: vars.radius.lg,
        border: `1px solid ${colors.border[1]}`,
      },
      horizontal: {
        flexDirection: 'row',
        alignItems: 'stretch',
        gap: vars.space[3],
        borderRadius: vars.radius.lg,
        border: `1px solid ${colors.border[1]}`,
        padding: vars.space[3],
      },
      compact: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: vars.radius.sm,
        gap: vars.space[3],
        padding: `${vars.space[2]}`,
      },
    },
  },
  defaultVariants: {
    variant: 'vertical',
  },
})

export const imageRecipe = recipe({
  base: {
    flexShrink: 0,
    overflow: 'hidden',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  },
  variants: {
    variant: {
      vertical: {
        width: '100%',
        aspectRatio: '16 / 10',
        borderRadius: `${vars.radius.lg} ${vars.radius.lg} 0 0`,
      },
      horizontal: {
        width: '30%',
        aspectRatio: '10 / 10',
        borderRadius: vars.radius.md,
      },
      compact: {
        width: '56px',
        height: '56px',
        borderRadius: vars.radius.sm,
      },
    },
    hasImage: {
      true: {},
      false: {
        backgroundImage: `linear-gradient(135deg, ${colors.secondary[400]}, ${colors.primary[400]})`,
      },
    },
  },
  defaultVariants: {
    variant: 'vertical',
    hasImage: false,
  },
})

export const contentRecipe = recipe({
  base: {
    display: 'flex',
    minWidth: 0,
    flex: 1,
  },
  variants: {
    variant: {
      vertical: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: vars.space[2],
        padding: vars.space[4],
      },
      horizontal: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        alignSelf: 'stretch',
        gap: vars.space[1],
        minHeight: '88px',
      },
      compact: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: vars.space[3],
      },
    },
  },
  defaultVariants: {
    variant: 'vertical',
  },
})

export const titleRecipe = recipe({
  base: {
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    color: colors.text[1],
    fontWeight: vars.fontWeight.semibold,
    lineHeight: vars.lineHeight.tight,
  },
  variants: {
    variant: {
      vertical: {
        fontSize: vars.fontSize.md,
        letterSpacing: '-0.01em',
        whiteSpace: 'nowrap',
      },
      horizontal: {
        fontSize: vars.fontSize.md,
        letterSpacing: '-0.01em',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        whiteSpace: 'normal',
      },
      compact: {
        flex: 1,
        fontSize: vars.fontSize.sm,
        letterSpacing: '-0.005em',
        whiteSpace: 'nowrap',
      },
    },
  },
  defaultVariants: {
    variant: 'vertical',
  },
})

export const metaText = style({
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.regular,
  lineHeight: vars.lineHeight.normal,
  color: colors.text[3],
})

export const badgeStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  padding: `${vars.space[1]} ${vars.space[2]}`,
  borderRadius: vars.radius.full,
  backgroundColor: colors.primary[100],
  color: colors.primary[700],
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.medium,
  lineHeight: vars.lineHeight.tight,
  whiteSpace: 'nowrap',
})

export const ratingStyle = style({
  display: 'inline-flex',
  flexShrink: 0,
  alignItems: 'center',
  gap: vars.space[1],
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.semibold,
  lineHeight: vars.lineHeight.tight,
  color: colors.text[1],
})

export const ratingIcon = style({
  color: colors.warning[500],
})

export const distanceStyle = style({
  flexShrink: 0,
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.medium,
  lineHeight: vars.lineHeight.tight,
  color: colors.text[4],
  whiteSpace: 'nowrap',
})

export const infoColumn = style({
  display: 'flex',
  minWidth: 0,
  flex: 1,
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: vars.space[1],
})

export const trailingColumn = style({
  display: 'flex',
  flexShrink: 0,
  flexDirection: 'column',
  alignItems: 'flex-end',
  justifyContent: 'center',
  gap: vars.space[1],
})
