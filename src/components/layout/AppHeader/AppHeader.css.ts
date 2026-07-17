import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const headerStyle = style({
  position: 'sticky',
  top: 0,
  zIndex: vars.zIndex.sticky,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  minHeight: vars.size.header,
  paddingTop: 'env(safe-area-inset-top)',
  paddingLeft: `max(${vars.space[4]}, env(safe-area-inset-left))`,
  paddingRight: `max(${vars.space[4]}, env(safe-area-inset-right))`,
  backgroundColor: colors.surface[1],
  borderBottom: `1px solid ${colors.border[1]}`,
})

export const titleStyle = style({
  fontSize: vars.fontSize.lg,
  fontWeight: vars.fontWeight.semibold,
})
