import { globalStyle, style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const pageStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[6],
  minWidth: 0,
  marginInline: `calc(-1 * ${vars.space[4]})`,
  marginTop: `calc(-1 * ${vars.space[4]})`,
  paddingBottom: vars.space[4],
  backgroundColor: colors.background[1],
  color: colors.text[1],
  fontFamily: vars.fontFamily.sans,
})

export const heroBlockStyle = style({
  position: 'relative',
  paddingBottom: '22px',
})

export const heroStyle = style({
  position: 'relative',
  height: '220px',
  overflow: 'hidden',
})

export const heroImageStyle = style({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  objectPosition: 'center 55%',
  pointerEvents: 'none',
})

export const heroCopyStyle = style({
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  maxWidth: '284px',
  padding: '20px 20px 0',
})

export const heroTitleStyle = style({
  margin: 0,
  fontSize: '22px',
  fontWeight: vars.fontWeight.medium,
  lineHeight: 1.15,
  letterSpacing: '-0.04em',
  color: colors.text[1],
})

export const heroSubtitleStyle = style({
  margin: 0,
  fontSize: vars.fontSize.sm,
  fontWeight: '300',
  lineHeight: vars.lineHeight.normal,
  color: colors.text[1],
})

export const searchWrapStyle = style({
  position: 'absolute',
  left: '17px',
  right: '17px',
  bottom: 0,
  zIndex: 2,
})

export const searchBarElevatedStyle = style({})

globalStyle(`${searchBarElevatedStyle} > div:first-of-type`, {
  boxShadow: vars.shadow.md,
  borderRadius: vars.radius.lg,
  backgroundColor: colors.surface[1],
})

export const sectionStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
  minWidth: 0,
  maxWidth: '100%',
  paddingInline: '17px',
})

export const sectionHeaderStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space[3],
})

export const sectionTitleStyle = style({
  margin: 0,
  fontSize: vars.fontSize.lg,
  fontWeight: vars.fontWeight.bold,
  letterSpacing: '-0.03em',
  color: colors.text[1],
})

export const sectionSubtitleStyle = style({
  margin: '4px 0 0',
  fontSize: '11px',
  fontWeight: vars.fontWeight.medium,
  letterSpacing: '0.08em',
  color: colors.text[4],
})

export const sectionActionStyle = style({
  margin: 0,
  padding: 0,
  border: 'none',
  background: 'none',
  fontFamily: vars.fontFamily.sans,
  fontSize: '11px',
  fontWeight: vars.fontWeight.regular,
  letterSpacing: '-0.005em',
  color: colors.text[4],
  cursor: 'pointer',
  whiteSpace: 'nowrap',
})

export const travelPickRowStyle = style({
  display: 'flex',
  gap: vars.space[3],
  width: '100%',
  minWidth: 0,
  overflowX: 'auto',
  overflowY: 'hidden',
  scrollSnapType: 'x proximity',
  paddingBottom: vars.space[1],
  WebkitOverflowScrolling: 'touch',
  overscrollBehaviorX: 'contain',
  scrollbarWidth: 'none',
  selectors: {
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
})

export const categoryListStyle = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '10px',
  margin: 0,
  paddingBlock: '2px',
  paddingInline: 0,
  listStyle: 'none',
})

export const categoryItemStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '6px',
  flexShrink: 0,
  width: '52px',
  padding: 0,
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  fontFamily: vars.fontFamily.sans,
})

export const categoryIconStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '52px',
  height: '52px',
  borderRadius: '14px',
  transition: 'transform 0.15s ease',
  selectors: {
    [`${categoryItemStyle}:active &`]: {
      transform: 'scale(0.92)',
    },
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
})

export const categoryLabelStyle = style({
  fontSize: '12px',
  fontWeight: vars.fontWeight.regular,
  letterSpacing: '-0.01em',
  lineHeight: 1.2,
  color: colors.text[1],
  whiteSpace: 'nowrap',
})

export const courseRowStyle = style({
  display: 'flex',
  gap: vars.space[3],
  width: '100%',
  minWidth: 0,
  paddingTop: vars.space[1],
  paddingBottom: vars.space[3],
  scrollSnapType: 'x mandatory',
})

export const popularListStyle = style({
  display: 'flex',
  gap: '15px',
  width: '100%',
  minWidth: 0,
  overflowX: 'auto',
  overflowY: 'hidden',
  paddingBottom: vars.space[1],
  WebkitOverflowScrolling: 'touch',
  overscrollBehaviorX: 'contain',
  scrollbarWidth: 'none',
  selectors: {
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
})
