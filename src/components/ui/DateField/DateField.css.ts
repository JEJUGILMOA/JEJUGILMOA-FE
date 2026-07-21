import { style, globalStyle } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const rootStyle = style({
  position: 'relative',
  width: '100%',
})

export const triggerStyle = style({
  width: '100%',
  cursor: 'pointer',
})

export const iconRecipe = recipe({
  base: {
    display: 'inline-flex',
    flexShrink: 0,
    color: colors.text[3],
    transition: `color ${vars.duration.fast}`,
    paddingBottom: '2px',
  },
  variants: {
    open: {
      true: { color: colors.secondary[500] },
      false: {},
    },
    placeholder: {
      true: { color: colors.text[4] },
      false: {},
    },
  },
  compoundVariants: [
    {
      variants: { open: true, placeholder: true },
      style: { color: colors.secondary[500] },
    },
  ],
  defaultVariants: {
    open: false,
    placeholder: false,
  },
})

export const valueStyle = recipe({
  base: {
    flex: 1,
    textAlign: 'left',
    border: 'none',
    backgroundColor: 'transparent',
    fontFamily: vars.fontFamily.sans,
    fontSize: vars.fontSize.md,
    fontWeight: vars.fontWeight.medium,
    cursor: 'pointer',
    outline: 'none',
  },
  variants: {
    placeholder: {
      true: { color: colors.text[4] },
      false: { color: colors.text[3] },
    },
  },
  defaultVariants: {
    placeholder: false,
  },
})

export const popoverStyle = style({
  position: 'absolute',
  top: 'calc(100% + 4px)',
  left: 0,
  zIndex: vars.zIndex.dropdown,
  width: '100%',
  minWidth: '280px',
  padding: vars.space[5],
  borderRadius: vars.radius.sm,
  backgroundColor: colors.surface[1],
  boxShadow: '0 12px 32px rgba(0, 0, 0, 0.16)',
})

export const monthHeaderStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: vars.space[4],
})

export const monthTitleStyle = style({
  fontFamily: vars.fontFamily.sans,
  fontWeight: vars.fontWeight.bold,
  fontSize: '15px',
  color: colors.text[1],
})

export const navButtonStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '28px',
  height: '28px',
  padding: 0,
  border: 'none',
  borderRadius: vars.radius.full,
  backgroundColor: 'transparent',
  color: colors.text[3],
  cursor: 'pointer',
  selectors: {
    '&:hover': {
      backgroundColor: colors.surface[3],
    },
  },
})

export const weekdayRowStyle = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: '4px',
  marginBottom: '6px',
})

export const weekdayStyle = recipe({
  base: {
    textAlign: 'center',
    fontFamily: vars.fontFamily.sans,
    fontWeight: vars.fontWeight.semibold,
    fontSize: '11px',
    color: colors.text[4],
  },
  variants: {
    tone: {
      sunday: { color: colors.error[300] },
      saturday: { color: colors.secondary[500] },
      weekday: {},
    },
  },
  defaultVariants: {
    tone: 'weekday',
  },
})

export const dayGridStyle = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: '4px',
})

export const dayCellStyle = style({
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

export const dayButtonRecipe = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    padding: 0,
    border: 'none',
    borderRadius: vars.radius.full,
    backgroundColor: 'transparent',
    fontFamily: vars.fontFamily.sans,
    fontSize: '13px',
    cursor: 'pointer',
  },
  variants: {
    tone: {
      sunday: { color: colors.error[300] },
      saturday: { color: colors.secondary[500] },
      weekday: { color: colors.text[1] },
      empty: {
        color: 'transparent',
        cursor: 'default',
        pointerEvents: 'none',
      },
    },
    selected: {
      true: {
        backgroundColor: colors.primary[500],
        color: colors.text[5],
        fontWeight: vars.fontWeight.bold,
      },
      false: {},
    },
  },
  compoundVariants: [
    {
      variants: { selected: true, tone: 'sunday' },
      style: { color: colors.text[5] },
    },
    {
      variants: { selected: true, tone: 'saturday' },
      style: { color: colors.text[5] },
    },
  ],
  defaultVariants: {
    tone: 'weekday',
    selected: false,
  },
})

globalStyle(`${iconRecipe.classNames.base} svg`, {
  width: '16px',
  height: '16px',
})
