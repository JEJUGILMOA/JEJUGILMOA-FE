import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const rootStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
})

export const monthHeaderStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

export const monthTitleStyle = style({
  fontSize: vars.fontSize.lg,
  fontWeight: vars.fontWeight.bold,
  color: colors.text[1],
  textAlign: 'center',
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
    '&:disabled': { color: colors.text[6], cursor: 'not-allowed' },
    '&:not(:disabled):hover': { backgroundColor: colors.surface[3] },
  },
})

export const weekdayRowStyle = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
})

export const weekdayStyle = style({
  textAlign: 'center',
  fontSize: vars.fontSize.sm,
  color: colors.text[4],
  padding: '4px 0',
})

export const dayGridStyle = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: '4px 0',
})

export const dayCellRecipe = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '36px',
  },
  variants: {
    inRange: {
      true: { backgroundColor: colors.primary[100] },
      false: {},
    },
    rangeStart: {
      true: { borderRadius: `${vars.radius.full} 0 0 ${vars.radius.full}` },
      false: {},
    },
    rangeEnd: {
      true: { borderRadius: `0 ${vars.radius.full} ${vars.radius.full} 0` },
      false: {},
    },
  },
})

export const dayButtonRecipe = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    margin: '0 auto',
    padding: 0,
    border: 'none',
    borderRadius: vars.radius.full,
    backgroundColor: 'transparent',
    fontSize: vars.fontSize.sm,
    color: colors.text[1],
    cursor: 'pointer',
  },
  variants: {
    disabled: {
      true: { color: colors.text[6], cursor: 'not-allowed' },
      false: {},
    },
    endpoint: {
      true: { backgroundColor: colors.primary[500], color: colors.text[5], fontWeight: vars.fontWeight.bold },
      false: {},
    },
    empty: {
      true: { visibility: 'hidden', cursor: 'default' },
      false: {},
    },
  },
})

export const summaryBoxStyle = style({
  backgroundColor: colors.surface[4],
  borderRadius: vars.radius.md,
  padding: vars.space[3],
  textAlign: 'center',
  fontSize: vars.fontSize.md,
  fontWeight: vars.fontWeight.bold,
  color: colors.text[1],
})

export const summaryPlaceholderStyle = style({
  color: colors.text[4],
  fontWeight: vars.fontWeight.regular,
})
