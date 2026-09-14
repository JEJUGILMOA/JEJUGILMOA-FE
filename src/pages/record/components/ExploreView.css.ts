import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const wrapStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
})

export const toolbarStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space[2],
})

export const viewModeGroupStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
  minWidth: 0,
})

export const viewModeButtonStyle = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    height: '36px',
    padding: `0 ${vars.space[3]}`,
    border: 'none',
    borderRadius: vars.radius.md,
    fontSize: vars.fontSize.sm,
    fontWeight: vars.fontWeight.medium,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: `color ${vars.duration.fast}, background-color ${vars.duration.fast}`,
    '@media': {
      '(prefers-reduced-motion: reduce)': {
        transition: 'none',
      },
    },
  },
  variants: {
    selected: {
      true: {
        backgroundColor: colors.primary[700],
        color: colors.text[5],
      },
      false: {
        backgroundColor: colors.surface[3],
        color: colors.text[3],
      },
    },
  },
  defaultVariants: {
    selected: false,
  },
})

export const sortButtonStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  height: '36px',
  padding: `0 ${vars.space[3]}`,
  border: `1px solid ${colors.border[1]}`,
  borderRadius: vars.radius.md,
  backgroundColor: colors.surface[1],
  color: colors.text[2],
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.medium,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  flexShrink: 0,
})

export const sortMenuListStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  minWidth: '132px',
})

export const sortMenuItemStyle = recipe({
  base: {
    padding: `${vars.space[2]} ${vars.space[3]}`,
    borderRadius: vars.radius.sm,
    textAlign: 'left',
    fontSize: vars.fontSize.sm,
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    selectors: {
      '&:hover': {
        backgroundColor: colors.surface[3],
      },
    },
  },
  variants: {
    selected: {
      true: {
        color: colors.primary[700],
        fontWeight: vars.fontWeight.semibold,
      },
      false: {
        color: colors.text[1],
        fontWeight: vars.fontWeight.regular,
      },
    },
  },
  defaultVariants: {
    selected: false,
  },
})

export const listStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[4],
})

export const skeletonCardStyle = style({
  overflow: 'hidden',
  backgroundColor: colors.surface[1],
  border: `1px solid ${colors.border[1]}`,
  borderRadius: vars.radius.lg,
  boxShadow: vars.shadow.sm,
})

export const skeletonThumbWrapStyle = style({
  position: 'relative',
  width: '100%',
  aspectRatio: '6 / 3',
  backgroundColor: colors.surface[4],
})

export const skeletonThumbStyle = style({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  borderRadius: 0,
})

export const skeletonBodyStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
  padding: vars.space[4],
})

export const skeletonAuthorRowStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
  marginTop: vars.space[1],
})

export const skeletonAvatarStyle = style({
  borderRadius: vars.radius.full,
  flexShrink: 0,
})
