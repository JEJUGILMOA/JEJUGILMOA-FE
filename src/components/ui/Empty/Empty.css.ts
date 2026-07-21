import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const emptyStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space[3],
  padding: vars.space[8],
  textAlign: 'center',
  minHeight: '220px',
  borderRadius: vars.radius.lg,
  border: `1px solid ${colors.border[1]}`,
  backgroundColor: colors.surface[1],
})

export const iconWrapRecipe = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '56px',
    height: '56px',
    borderRadius: vars.radius.full,
    marginBottom: vars.space[1],
  },
  variants: {
    tone: {
      neutral: {
        backgroundColor: colors.surface[4],
        color: colors.text[3],
      },
      primary: {
        backgroundColor: colors.primary[100],
        color: colors.primary[700],
      },
      danger: {
        backgroundColor: '#FDECEC',
        color: colors.error[300],
      },
    },
  },
  defaultVariants: {
    tone: 'neutral',
  },
})

export const emptyTitleStyle = style({
  fontSize: vars.fontSize.md,
  fontWeight: vars.fontWeight.semibold,
  color: colors.text[1],
  letterSpacing: '-0.025em',
})

export const emptyDescriptionStyle = style({
  fontSize: vars.fontSize.sm,
  color: colors.text[3],
  marginBottom: vars.space[1],
})
