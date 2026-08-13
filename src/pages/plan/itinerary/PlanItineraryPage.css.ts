import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const pageRootStyle = style({
  position: 'relative',
  height: '100%',
  minHeight: '100%',
  overflow: 'hidden',
})

export const backButtonStyle = style({
  position: 'absolute',
  top: vars.space[3],
  left: vars.space[3],
  zIndex: vars.zIndex.toast,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
  border: 'none',
  borderRadius: vars.radius.full,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  color: colors.text[1],
  boxShadow: vars.shadow.sm,
  cursor: 'pointer',
})

export const nextButtonStyle = style({
  position: 'absolute',
  top: vars.space[4],
  right: vars.space[3],
  zIndex: vars.zIndex.toast,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '37px',
  padding: `0 ${vars.space[4]}`,
  border: 'none',
  borderRadius: vars.radius.full,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  color: colors.primary[600],
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.bold,
  boxShadow: vars.shadow.sm,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
})

export const dayPagerFloatStyle = style({
  position: 'absolute',
  top: vars.space[3],
  left: '64px',
  right: '84px',
  zIndex: vars.zIndex.toast,
  filter: 'drop-shadow(0 2px 10px rgba(0, 0, 0, 0.12))',
})

export const sectionStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
})

export const sectionHeaderStyle = style({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
})

export const sectionTitleStyle = style({
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.bold,
  color: colors.text[1],
})

export const sectionMetaStyle = style({
  fontSize: vars.fontSize.xs,
  color: colors.text[4],
})

export const emptyTextStyle = style({
  padding: `${vars.space[4]} 0`,
  textAlign: 'center',
  fontSize: vars.fontSize.sm,
  color: colors.text[4],
})

export const unassignedRowStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
  padding: `${vars.space[2]} 0`,
  borderBottom: `1px solid ${colors.border[1]}`,
  selectors: {
    '&:last-child': { borderBottom: 'none' },
  },
})

export const unassignedInfoStyle = style({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
})

export const unassignedTitleStyle = style({
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.semibold,
  color: colors.text[1],
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const unassignedCategoryStyle = style({
  fontSize: vars.fontSize.xs,
  color: colors.text[4],
})

export const gatewayRowStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: vars.space[3],
  borderRadius: vars.radius.md,
  backgroundColor: colors.surface[4],
})

export const gatewayLabelStyle = style({
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.semibold,
  color: colors.text[2],
})

export const gatewayTimeStyle = style({
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.bold,
  color: colors.primary[700],
})

export const assignButtonStyle = style({
  flexShrink: 0,
  border: 'none',
  background: 'transparent',
  padding: 0,
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.semibold,
  color: colors.primary[500],
  cursor: 'pointer',
  whiteSpace: 'nowrap',
})
