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
    backgroundColor: colors.surface[5],
  },
  variants: {
    variant: {
      vertical: {
        width: '100%',
        aspectRatio: '16 / 10',
        borderRadius: `${vars.radius.lg} ${vars.radius.lg} 0 0`,
      },
      horizontal: {
        width: '88px',
        height: '88px',
        borderRadius: vars.radius.buttonLg,
      },
      compact: {
        width: '56px',
        height: '56px',
        borderRadius: vars.radius.sm,
      },
    },
  },
  defaultVariants: {
    variant: 'vertical',
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
        padding: vars.space[3],
        // 제목 1줄 + 메타 1줄 + 캡션 1줄 기준(대부분 제목이 한 줄이라) — 캡션(메모) 유무로
        // 카드 높이가 들쭉날쭉해지지 않도록 고정한다. 제목이 2줄이 되거나 평점이 붙으면
        // 그만큼 자연스럽게 더 늘어난다.
        minHeight: '90px',
      },
      horizontal: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        alignSelf: 'stretch',
        gap: '6px',
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
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        whiteSpace: 'normal',
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
  display: 'block',
  width: '100%',
  minWidth: 0,
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  fontSize: '11px',
  fontWeight: vars.fontWeight.medium,
  lineHeight: vars.lineHeight.normal,
  letterSpacing: '-0.005em',
  color: colors.text[2],
})

/** 메모는 주소(metaText)보다 옅은 회색으로 구분한다 */
export const captionText = style([metaText, { color: colors.text[4] }])

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

export const badgesRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: vars.space[2],
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
  gap: '6px',
})

/**
 * vertical/horizontal 변형 전용. 그 둘의 contentRecipe는 flexDirection:column이라
 * infoColumn이 alignItems:flex-start 때문에 제일 긴 텍스트만큼만 너비를 갖는다 — 그래서
 * 주소 말줄임(ellipsis)이 안 먹힌다. compact는 row라 infoColumn의 flex:1이 이미 너비를
 * 채워주므로 이 클래스를 쓰면 안 된다(진짜 카드 폭보다 더 넓어지려 해서 레이아웃이 깨짐).
 */
export const infoColumnFill = style([infoColumn, { width: '100%' }])

export const trailingColumn = style({
  display: 'flex',
  flexShrink: 0,
  flexDirection: 'column',
  alignItems: 'flex-end',
  justifyContent: 'center',
  gap: vars.space[1],
})
