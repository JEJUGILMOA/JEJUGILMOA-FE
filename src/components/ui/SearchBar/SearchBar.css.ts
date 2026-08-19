import { style, globalStyle } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const searchBarRoot = style({
  position: 'relative',
  width: '100%',
})

const iconSlot = style({})

globalStyle(`${iconSlot} svg`, {
  width: '16px',
  height: '16px',
})

export const searchIconClass = iconSlot

export const searchIconRecipe = recipe({
  base: {
    display: 'inline-flex',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.text[4],
    transition: `color ${vars.duration.fast}`,
  },
  variants: {
    focused: {
      true: {
        color: colors.secondary[500],
      },
      false: {},
    },
  },
  defaultVariants: {
    focused: false,
  },
})

export const clearButton = style({
  display: 'inline-flex',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  width: '20px',
  height: '20px',
  padding: 0,
  border: 'none',
  borderRadius: vars.radius.full,
  backgroundColor: colors.surface[5],
  color: colors.text[3],
  cursor: 'pointer',
  selectors: {
    '&:hover': {
      backgroundColor: colors.stone[200],
      color: colors.text[2],
    },
  },
})

export const dropdown = style({
  position: 'absolute',
  top: 'calc(100% + 4px)',
  left: 0,
  right: 0,
  zIndex: vars.zIndex.dropdown,
  margin: 0,
  padding: `${vars.space[1]} ${vars.space[1]}`,
  listStyle: 'none',
  borderRadius: vars.radius.sm,
  border: `1px solid ${colors.border[1]}`,
  backgroundColor: colors.surface[1],
  boxShadow: vars.shadow.md,
  overflow: 'hidden',
})

export const suggestionRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[1],
})

export const suggestionItem = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
  flex: 1,
  minWidth: 0,
  padding: `${vars.space[2]} ${vars.space[3]}`,
  borderRadius: vars.radius.sm,
  border: 'none',
  backgroundColor: 'transparent',
  color: colors.text[1],
  fontFamily: vars.fontFamily.sans,
  fontSize: vars.fontSize.sm,
  textAlign: 'left',
  cursor: 'pointer',
  selectors: {
    '&:hover': {
      backgroundColor: colors.surface[3],
    },
  },
})

export const suggestionLabel = style({
  flex: 1,
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const suggestionType = style({
  flexShrink: 0,
  fontSize: vars.fontSize.xs,
  color: colors.text[4],
})

export const removeSuggestionButton = style({
  display: 'inline-flex',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  padding: 0,
  border: 'none',
  borderRadius: vars.radius.sm,
  backgroundColor: 'transparent',
  color: colors.text[4],
  cursor: 'pointer',
  selectors: {
    '&:hover': {
      color: colors.text[2],
      backgroundColor: colors.surface[4],
    },
  },
})
