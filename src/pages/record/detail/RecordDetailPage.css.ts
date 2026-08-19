import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

/** 상단 앱 헤더 바로 아래에 이어붙여 한 헤더처럼 보이게 함 (뒤로가기 + 관리 메뉴) */
export const subHeaderStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: `calc(-1 * ${vars.space[4]})`,
  marginInline: `calc(-1 * ${vars.space[4]})`,
  padding: `${vars.space[1]} ${vars.space[4]}`,
  backgroundColor: colors.surface[1],
})

export const backButtonStyle = style({
  display: 'inline-flex',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  width: vars.size.touch,
  height: vars.size.touch,
  margin: `0 -${vars.space[2]}`,
  padding: 0,
  border: 'none',
  borderRadius: vars.radius.sm,
  backgroundColor: 'transparent',
  color: colors.text[1],
  cursor: 'pointer',
  selectors: {
    '&:hover': {
      backgroundColor: colors.surface[4],
    },
    '&:active': {
      backgroundColor: colors.surface[5],
    },
  },
})

export const pageStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[6],
  paddingBottom: vars.space[8],
})

export const infoStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[4],
})

export const badgeRowStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

export const createdAtStyle = style({
  fontSize: vars.fontSize.xs,
  color: colors.text[4],
})

export const titleGroupStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
})

export const titleStyle = style({
  fontSize: vars.fontSize['2xl'],
  fontWeight: vars.fontWeight.bold,
  color: colors.text[1],
  letterSpacing: '-0.03em',
})

export const dateRangeStyle = style({
  fontSize: vars.fontSize.sm,
  color: colors.text[3],
})

export const linkedPlanButtonStyle = style({
  alignSelf: 'flex-start',
  padding: 0,
})

export const summaryStyle = style({
  fontSize: vars.fontSize.md,
  color: colors.text[2],
  lineHeight: vars.lineHeight.relaxed,
})

export const authorRowStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
})

export const avatarStyle = style({
  display: 'inline-flex',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  width: '28px',
  height: '28px',
  borderRadius: vars.radius.full,
  backgroundColor: colors.secondary[100],
  color: colors.secondary[500],
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.semibold,
})

export const authorNameStyle = style({
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.medium,
  color: colors.text[2],
})

export const authorTimeStyle = style({
  fontSize: vars.fontSize.xs,
  color: colors.text[4],
})

export const metaStyle = style({
  fontSize: vars.fontSize.xs,
  color: colors.text[4],
})

export const actionRowStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
  paddingTop: vars.space[3],
  borderTop: `1px solid ${colors.border[1]}`,
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

export const shareButtonStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space[1],
  marginLeft: 'auto',
  padding: `${vars.space[1]} ${vars.space[3]}`,
  borderRadius: vars.radius.full,
  border: `1px solid ${colors.border[1]}`,
  backgroundColor: colors.surface[1],
  color: colors.text[3],
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.medium,
  cursor: 'pointer',
})
