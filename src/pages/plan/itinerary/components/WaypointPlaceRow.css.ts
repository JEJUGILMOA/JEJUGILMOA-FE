import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const rowStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[3],
  padding: `${vars.space[3]} 0`,
})

export const thumbnailStyle = style({
  flexShrink: 0,
  width: '48px',
  height: '48px',
  borderRadius: vars.radius.sm,
  backgroundColor: colors.surface[4],
})

export const thumbnailImageStyle = style({
  flexShrink: 0,
  width: '48px',
  height: '48px',
  borderRadius: vars.radius.sm,
  objectFit: 'cover',
  objectPosition: 'center',
  display: 'block',
})

export const infoColumnStyle = style({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
})

export const titleStyle = style({
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.bold,
  color: colors.text[1],
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const categoryStyle = style({
  fontSize: vars.fontSize.xs,
  color: colors.text[4],
})

export const toggleButtonStyle = style({
  flexShrink: 0,
})

export const mustVisitButtonRecipe = recipe({
  base: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    border: 'none',
    background: 'transparent',
    color: colors.text[6],
    cursor: 'pointer',
  },
  variants: {
    active: {
      true: { color: colors.warning[500] },
      false: {},
    },
  },
  defaultVariants: {
    active: false,
  },
})
