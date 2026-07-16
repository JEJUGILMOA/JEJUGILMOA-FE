import { style } from '@vanilla-extract/css'
import { vars } from '@/styles/theme.css.ts'

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
  backgroundColor: vars.color.surface,
  borderBottom: `1px solid ${vars.color.border}`,
})

export const titleStyle = style({
  fontSize: vars.fontSize.lg,
  fontWeight: vars.fontWeight.semibold,
})
