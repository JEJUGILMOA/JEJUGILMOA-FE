import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const listStyle = style({
  display: 'flex',
  flexDirection: 'column',
})

export const rowStyle = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
  padding: `${vars.space[2]} 0`,
  borderBottom: `1px solid ${colors.border[1]}`,
  backgroundColor: colors.surface[1],
  selectors: {
    '&[data-dragging="true"]': {
      zIndex: 1,
      borderRadius: vars.radius.sm,
      boxShadow: vars.shadow.sm,
    },
  },
})

export const dragHandleStyle = style({
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '20px',
  height: '20px',
  color: colors.text[6],
  cursor: 'grab',
  touchAction: 'none',
})

export const titleStyle = style({
  flex: 1,
  minWidth: 0,
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.semibold,
  color: colors.text[1],
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const mustVisitButtonRecipe = recipe({
  base: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
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

export const removeButtonStyle = style({
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '24px',
  height: '24px',
  border: 'none',
  background: 'transparent',
  color: colors.text[4],
  cursor: 'pointer',
})
