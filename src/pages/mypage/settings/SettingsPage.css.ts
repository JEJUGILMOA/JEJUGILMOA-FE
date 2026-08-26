import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { PAGE_HEADER_BLEED_VAR } from '@/components/ui/PageHeader/PageHeader.css.ts'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'
import { bodySmall, titleMedium } from '@/styles/typography.css.ts'

export const pageStyle = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  gap: vars.space[1],
  padding: vars.space[6],
  paddingTop: 0,
  backgroundColor: colors.surface[1],
  vars: {
    [PAGE_HEADER_BLEED_VAR]: vars.space[6],
  },
})

export const sectionLabelStyle = style([
  bodySmall,
  {
    margin: `${vars.space[3]} 0 ${vars.space[2]}`,
    color: colors.text[4],
  },
])

export const settingRowStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space[3],
  minHeight: 48,
  width: '100%',
  padding: 0,
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  textAlign: 'left',
})

export const settingLabelStyle = style([
  titleMedium,
  {
    color: colors.text[1],
  },
])

export const toggleStyle = recipe({
  base: {
    position: 'relative',
    width: 36,
    height: 20,
    borderRadius: 10,
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    flexShrink: 0,
    transition: `background-color ${vars.duration.fast}`,
  },
  variants: {
    on: {
      true: { backgroundColor: colors.secondary[600] },
      false: { backgroundColor: colors.border[1] },
    },
  },
  defaultVariants: {
    on: false,
  },
})

export const toggleThumbStyle = recipe({
  base: {
    position: 'absolute',
    top: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.surface[1],
    transition: `left ${vars.duration.fast}`,
  },
  variants: {
    on: {
      true: { left: 18 },
      false: { left: 2 },
    },
  },
  defaultVariants: {
    on: false,
  },
})

export const linkValueStyle = style([
  bodySmall,
  {
    color: colors.primary[700],
    flexShrink: 0,
  },
])

export const dividerStyle = style({
  marginTop: vars.space[3],
  paddingTop: vars.space[2],
  borderTop: `1px solid ${colors.border[1]}`,
})

export const dangerTextStyle = style({
  color: colors.error[500],
})
