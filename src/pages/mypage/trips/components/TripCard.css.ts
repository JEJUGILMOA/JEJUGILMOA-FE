import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'
import { bodySmall, titleLarge } from '@/styles/typography.css.ts'

export const cardStyle = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  padding: 0,
  overflow: 'hidden',
  border: 'none',
  borderRadius: '20px',
  backgroundColor: colors.surface[1],
  boxShadow: '0 4px 16px rgba(37, 37, 45, 0.08)',
  cursor: 'pointer',
  textAlign: 'left',
  fontFamily: vars.fontFamily.sans,
  selectors: {
    '&:disabled': {
      cursor: 'default',
    },
  },
})

export const headerStyle = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: vars.space[3],
    minHeight: '92px',
    padding: vars.space[4],
  },
  variants: {
    tone: {
      ongoing: {
        backgroundImage: `linear-gradient(115deg, ${colors.secondary[500]} 0%, ${colors.primary[600]} 100%)`,
      },
      planned: {
        backgroundImage: 'linear-gradient(115deg, #FFB45A 0%, #F08A6B 100%)',
      },
      completed: {
        backgroundColor: '#C8C2B8',
        backgroundImage: 'none',
      },
    },
  },
  defaultVariants: {
    tone: 'ongoing',
  },
})

export const headerTopStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space[2],
})

export const statusBadgeStyle = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '5px 10px',
    borderRadius: '10px',
    backgroundColor: colors.surface[1],
    fontSize: '12px',
    fontWeight: vars.fontWeight.semibold,
    lineHeight: 1.2,
    whiteSpace: 'nowrap',
  },
  variants: {
    tone: {
      ongoing: {
        color: colors.secondary[600],
      },
      planned: {
        color: '#E67A3A',
      },
      completed: {
        backgroundColor: colors.text[3],
        color: colors.text[5],
      },
    },
  },
  defaultVariants: {
    tone: 'ongoing',
  },
})

export const dayProgressStyle = style({
  color: colors.text[4],
  fontWeight: vars.fontWeight.medium,
})

export const dDayBadgeStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '5px 10px',
  borderRadius: '10px',
  backgroundColor: colors.surface[1],
  color: colors.text[1],
  fontSize: '12px',
  fontWeight: vars.fontWeight.bold,
  lineHeight: 1.2,
})

export const headerTitleStyle = style([
  titleLarge,
  {
    margin: 0,
    marginTop: 'auto',
    color: colors.text[5],
    fontWeight: vars.fontWeight.bold,
    letterSpacing: '-0.03em',
  },
])

export const bodyStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
  padding: `${vars.space[3]} ${vars.space[4]} ${vars.space[4]}`,
  backgroundColor: colors.surface[1],
})

export const bodyTitleStyle = style([
  titleLarge,
  {
    margin: 0,
    color: colors.text[1],
    fontWeight: vars.fontWeight.bold,
    letterSpacing: '-0.03em',
  },
])

export const metaRowStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space[3],
})

export const metaTextStyle = style([
  bodySmall,
  {
    margin: 0,
    color: colors.text[4],
    fontSize: '13px',
  },
])

export const progressTrackStyle = style({
  height: 6,
  marginTop: vars.space[1],
  borderRadius: vars.radius.full,
  backgroundColor: colors.surface[4],
  overflow: 'hidden',
})

export const progressFillStyle = style({
  height: '100%',
  borderRadius: vars.radius.full,
  backgroundColor: colors.secondary[500],
})
