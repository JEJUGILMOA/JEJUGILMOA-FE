import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const ITEM_HEIGHT = 32
export const VISIBLE_COUNT = 5

export const popoverStyle = style({
  position: 'fixed',
  zIndex: vars.zIndex.toast,
  borderRadius: vars.radius.md,
  backgroundColor: colors.surface[1],
  boxShadow: vars.shadow.lg,
  padding: vars.space[2],
})

export const wheelsRowStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[1],
})

export const colonStyle = style({
  fontSize: vars.fontSize.md,
  fontWeight: vars.fontWeight.bold,
  color: colors.text[2],
})

export const wheelViewportStyle = style({
  position: 'relative',
  width: '52px',
  height: `${ITEM_HEIGHT * VISIBLE_COUNT}px`,
  overflow: 'hidden',
  touchAction: 'none',
  cursor: 'ns-resize',
  userSelect: 'none',
})

export const wheelTrackStyle = style({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  zIndex: 1,
})

export const wheelItemStyle = style({
  height: `${ITEM_HEIGHT}px`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: vars.fontSize.md,
  fontWeight: vars.fontWeight.medium,
  color: colors.text[4],
  selectors: {
    '&[data-selected="true"]': {
      fontSize: vars.fontSize.lg,
      fontWeight: vars.fontWeight.bold,
      color: colors.primary[700],
    },
  },
})

export const wheelHighlightStyle = style({
  position: 'absolute',
  left: 0,
  right: 0,
  top: `${Math.floor(VISIBLE_COUNT / 2) * ITEM_HEIGHT}px`,
  height: `${ITEM_HEIGHT}px`,
  zIndex: 0,
  pointerEvents: 'none',
  borderRadius: vars.radius.sm,
  backgroundColor: colors.primary[100],
})
