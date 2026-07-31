import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const listStyle = style({
  display: 'flex',
  flexDirection: 'column',
})

export const rowStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
  padding: `${vars.space[2]} 0`,
  borderBottom: `1px solid ${colors.border[1]}`,
  backgroundColor: colors.surface[1],
  selectors: {
    '&[data-dragging="true"]': { opacity: 0.4 },
  },
})

export const dragHandleStyle = style({
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '20px',
  height: '20px',
  color: colors.text[6],
  cursor: 'grab',
})

export const timeBadgeStyle = style({
  flexShrink: 0,
  padding: `${vars.space[1]} ${vars.space[2]}`,
  borderRadius: vars.radius.sm,
  backgroundColor: colors.primary[100],
  color: colors.primary[700],
  fontSize: '11px',
  fontWeight: vars.fontWeight.bold,
})

export const titleStyle = style({
  flex: 1,
  minWidth: 0,
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.semibold,
  color: colors.text[1],
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const removeButtonStyle = style({
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '24px',
  height: '24px',
  border: 'none',
  background: 'transparent',
  color: colors.text[4],
  cursor: 'pointer',
})
