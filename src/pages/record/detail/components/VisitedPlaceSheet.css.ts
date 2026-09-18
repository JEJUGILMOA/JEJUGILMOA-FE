import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const sheetBodyStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
})

/** 가로 스크롤 — 시트 body 패딩 안에서 여유 있게 */
export const photoRowStyle = style({
  display: 'flex',
  gap: vars.space[2],
  overflowX: 'auto',
  paddingBlock: vars.space[2],
  paddingInline: vars.space[1],
  scrollSnapType: 'x mandatory',
  WebkitOverflowScrolling: 'touch',
  scrollbarWidth: 'none',
  selectors: {
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
})

export const photoButtonStyle = style({
  position: 'relative',
  flex: '0 0 auto',
  width: '78%',
  maxWidth: '280px',
  aspectRatio: '16 / 10',
  padding: 0,
  border: 'none',
  borderRadius: vars.radius.lg,
  overflow: 'hidden',
  backgroundColor: colors.surface[4],
  cursor: 'pointer',
  scrollSnapAlign: 'start',
})

export const photoImageStyle = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  pointerEvents: 'none',
})

export const photoEmptyStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  aspectRatio: '16 / 10',
  borderRadius: vars.radius.lg,
  backgroundColor: colors.surface[4],
  color: colors.text[4],
  fontSize: vars.fontSize.sm,
})

export const contentStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
})

export const placeNameStyle = style({
  margin: 0,
  fontSize: vars.fontSize['2xl'],
  fontWeight: vars.fontWeight.bold,
  color: colors.text[1],
  letterSpacing: '-0.03em',
  lineHeight: vars.lineHeight.tight,
})

export const dateStyle = style({
  margin: 0,
  fontSize: vars.fontSize.sm,
  color: colors.text[4],
})

export const addressRowStyle = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: vars.space[1],
  margin: 0,
  marginTop: vars.space[1],
  fontSize: vars.fontSize.sm,
  color: colors.text[3],
  lineHeight: vars.lineHeight.normal,
})

export const addressIconStyle = style({
  flexShrink: 0,
  marginTop: '2px',
  color: colors.primary[500],
})

export const dividerStyle = style({
  width: '100%',
  height: '1px',
  border: 'none',
  margin: `${vars.space[3]} 0 ${vars.space[2]}`,
  backgroundColor: colors.border[1],
})

export const memoSectionStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
})

export const memoLabelStyle = style({
  margin: 0,
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.semibold,
  color: colors.primary[500],
})

export const memoTextStyle = style({
  margin: 0,
  fontSize: vars.fontSize.lg,
  color: colors.text[2],
  lineHeight: vars.lineHeight.relaxed,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
})
