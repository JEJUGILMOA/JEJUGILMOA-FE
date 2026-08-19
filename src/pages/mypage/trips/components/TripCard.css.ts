import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'
import { bodySmall, captionSm, titleLarge, titleSmall } from '@/styles/typography.css.ts'

export const cardStyle = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: vars.space[2],
    width: '100%',
    padding: 0,
    overflow: 'hidden',
    borderRadius: vars.radius.lg,
    border: `1px solid ${colors.border[1]}`,
    backgroundColor: colors.surface[1],
    cursor: 'pointer',
    textAlign: 'left',
  },
  variants: {
    ongoing: {
      true: {
        border: 'none',
        boxShadow: vars.shadow.sm,
      },
      false: {
        padding: vars.space[3],
      },
    },
  },
  defaultVariants: {
    ongoing: false,
  },
})

export const ongoingHeaderStyle = style({
  padding: vars.space[3],
  backgroundColor: colors.primary[700],
})

export const titleStyle = style([
  titleLarge,
  {
    margin: 0,
    color: colors.text[1],
    selectors: {
      [`${ongoingHeaderStyle} &`]: {
        color: colors.text[5],
      },
    },
  },
])

export const summaryStyle = style([
  captionSm,
  {
    margin: 0,
    color: colors.text[4],
    selectors: {
      [`${ongoingHeaderStyle} &`]: {
        color: colors.text[5],
        opacity: 0.85,
      },
    },
  },
])

export const detailStyle = style([
  bodySmall,
  {
    margin: 0,
    padding: `${vars.space[3]} ${vars.space[3]} ${vars.space[1]}`,
    color: colors.text[2],
  },
])

export const progressBarStyle = style({
  height: 5,
  margin: `0 ${vars.space[3]} ${vars.space[3]}`,
  borderRadius: vars.radius.full,
  backgroundColor: colors.surface[4],
  overflow: 'hidden',
})

export const progressFillStyle = style({
  height: '100%',
  borderRadius: vars.radius.full,
  backgroundColor: colors.primary[500],
})

export const badgeStyle = style([
  titleSmall,
  {
    alignSelf: 'flex-end',
    padding: `${vars.space[1]} ${vars.space[2]}`,
    borderRadius: vars.radius.sm,
    backgroundColor: colors.surface[4],
    color: colors.text[2],
  },
])
