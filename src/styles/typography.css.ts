import { styleVariants } from '@vanilla-extract/css'
import { vars } from './theme.css.ts'

export const typography = styleVariants({
  display: {
    fontSize: vars.fontSize['3xl'],
    fontWeight: vars.fontWeight.bold,
    lineHeight: vars.lineHeight.tight,
  },
  title: {
    fontSize: vars.fontSize['2xl'],
    fontWeight: vars.fontWeight.semibold,
    lineHeight: vars.lineHeight.tight,
  },
  heading: {
    fontSize: vars.fontSize.xl,
    fontWeight: vars.fontWeight.semibold,
    lineHeight: vars.lineHeight.tight,
  },
  body: {
    fontSize: vars.fontSize.md,
    fontWeight: vars.fontWeight.regular,
    lineHeight: vars.lineHeight.normal,
  },
  bodyStrong: {
    fontSize: vars.fontSize.md,
    fontWeight: vars.fontWeight.semibold,
    lineHeight: vars.lineHeight.normal,
  },
  caption: {
    fontSize: vars.fontSize.sm,
    fontWeight: vars.fontWeight.regular,
    lineHeight: vars.lineHeight.normal,
    color: vars.color.textMuted,
  },
  label: {
    fontSize: vars.fontSize.sm,
    fontWeight: vars.fontWeight.medium,
    lineHeight: vars.lineHeight.normal,
  },
})
