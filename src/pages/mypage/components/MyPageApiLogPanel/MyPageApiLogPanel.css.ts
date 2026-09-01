import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const panelStyle = style({
  position: 'fixed',
  left: vars.space[3],
  right: vars.space[3],
  bottom: `calc(64px + env(safe-area-inset-bottom) + ${vars.space[2]})`,
  zIndex: vars.zIndex.modal,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: '42vh',
  borderRadius: vars.radius.lg,
  border: `1px solid ${colors.border[1]}`,
  backgroundColor: colors.surface[1],
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
  overflow: 'hidden',
})

export const panelCollapsedStyle = style({
  maxHeight: '44px',
})

export const headerStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space[2],
  padding: `${vars.space[2]} ${vars.space[3]}`,
  borderBottom: `1px solid ${colors.border[1]}`,
  backgroundColor: colors.surface[3],
})

export const titleStyle = style({
  margin: 0,
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.semibold,
  color: colors.text[1],
})

export const headerActionsStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
})

export const actionButtonStyle = style({
  margin: 0,
  padding: `${vars.space[1]} ${vars.space[2]}`,
  border: `1px solid ${colors.border[1]}`,
  borderRadius: vars.radius.sm,
  backgroundColor: colors.surface[1],
  fontFamily: vars.fontFamily.sans,
  fontSize: '12px',
  color: colors.text[2],
  cursor: 'pointer',
})

export const listStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
  margin: 0,
  padding: vars.space[2],
  overflowY: 'auto',
  listStyle: 'none',
})

export const entryStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
  padding: vars.space[2],
  borderRadius: vars.radius.md,
  border: `1px solid ${colors.border[1]}`,
  backgroundColor: colors.surface[2],
})

export const entryHeaderStyle = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space[2],
  alignItems: 'center',
  justifyContent: 'space-between',
})

export const methodStyle = style({
  fontSize: '12px',
  fontWeight: vars.fontWeight.bold,
  color: colors.primary[700],
})

export const urlStyle = style({
  flex: 1,
  minWidth: 0,
  fontSize: '12px',
  color: colors.text[2],
  wordBreak: 'break-all',
})

export const statusBadgeStyle = style({
  fontSize: '11px',
  fontWeight: vars.fontWeight.semibold,
  padding: '2px 6px',
  borderRadius: vars.radius.full,
  backgroundColor: colors.surface[4],
  color: colors.text[3],
})

export const statusPendingStyle = style({
  backgroundColor: colors.warning[300],
  color: colors.text[1],
})

export const statusSuccessStyle = style({
  backgroundColor: colors.primary[100],
  color: colors.primary[800],
})

export const statusErrorStyle = style({
  backgroundColor: '#FFE8E8',
  color: colors.error[700],
})

export const sectionTitleStyle = style({
  margin: 0,
  fontSize: '11px',
  fontWeight: vars.fontWeight.semibold,
  color: colors.text[4],
})

export const codeBlockStyle = style({
  margin: 0,
  padding: vars.space[2],
  borderRadius: vars.radius.sm,
  backgroundColor: colors.surface[4],
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  fontSize: '11px',
  lineHeight: 1.45,
  color: colors.text[2],
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  maxHeight: '160px',
  overflow: 'auto',
})

export const emptyStyle = style({
  margin: 0,
  padding: vars.space[3],
  fontSize: vars.fontSize.sm,
  color: colors.text[4],
  textAlign: 'center',
})
