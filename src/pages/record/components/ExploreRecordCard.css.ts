import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const cardStyle = style({
  overflow: 'hidden',
  backgroundColor: colors.surface[1],
  border: `1px solid ${colors.border[1]}`,
  borderRadius: vars.radius.lg,
  boxShadow: vars.shadow.sm,
  cursor: 'pointer',
})

export const thumbnailWrapStyle = style({
  display: 'flex',
  width: '100%',
  aspectRatio: '6 / 3',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: colors.surface[4],
  color: colors.text[4],
})

export const bodyStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
  padding: vars.space[4],
})

export const titleStyle = style({
  fontSize: vars.fontSize.md,
  fontWeight: vars.fontWeight.semibold,
  color: colors.text[1],
})

export const summaryStyle = style({
  fontSize: vars.fontSize.sm,
  color: colors.text[3],
})

export const authorRowStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
  marginTop: vars.space[2],
})

export const avatarStyle = style({
  display: 'inline-flex',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  width: '24px',
  height: '24px',
  borderRadius: vars.radius.full,
  backgroundColor: colors.secondary[100],
  color: colors.secondary[500],
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.semibold,
})

export const authorNameStyle = style({
  flex: 1,
  fontSize: vars.fontSize.xs,
  color: colors.text[3],
})

export const linkedPlanButtonStyle = style({
  padding: 0,
})

export const reactionRowStyle = style({
  display: 'flex',
  gap: vars.space[2],
  marginTop: vars.space[3],
})

export const reactionButtonRecipe = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: vars.space[1],
    padding: `${vars.space[1]} ${vars.space[3]}`,
    borderRadius: vars.radius.full,
    border: `1px solid ${colors.border[1]}`,
    backgroundColor: colors.surface[1],
    color: colors.text[3],
    fontSize: vars.fontSize.xs,
    fontWeight: vars.fontWeight.medium,
    cursor: 'pointer',
  },
  variants: {
    tone: {
      like: {},
      dislike: {},
    },
    active: {
      true: {},
      false: {},
    },
  },
  compoundVariants: [
    {
      variants: { tone: 'like', active: true },
      style: {
        borderColor: colors.primary[500],
        backgroundColor: colors.primary[100],
        color: colors.primary[700],
      },
    },
    {
      variants: { tone: 'dislike', active: true },
      style: {
        borderColor: colors.error[300],
        backgroundColor: colors.error[100],
        color: colors.error[300],
      },
    },
  ],
  defaultVariants: {
    tone: 'like',
    active: false,
  },
})
