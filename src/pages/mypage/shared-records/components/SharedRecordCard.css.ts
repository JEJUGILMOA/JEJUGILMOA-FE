import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'
import { bodySmall, captionSm, titleMedium } from '@/styles/typography.css.ts'

export const cardStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
  overflow: 'hidden',
  borderRadius: 16,
  border: `1px solid ${colors.border[1]}`,
  backgroundColor: colors.surface[1],
  paddingBottom: vars.space[3],
})

export const coverStyle = recipe({
  base: {
    position: 'relative',
    height: 78,
  },
  variants: {
    tone: {
      warm: {
        backgroundImage: 'linear-gradient(135deg, #FFD9A0 0%, #FF9E6D 100%)',
      },
      muted: {
        backgroundImage: 'linear-gradient(135deg, #D9D2C4 0%, #B7AE9C 100%)',
      },
    },
  },
  defaultVariants: {
    tone: 'warm',
  },
})

export const badgeStyle = style([
  captionSm,
  {
    position: 'absolute',
    top: 9,
    left: 9,
    padding: `3px ${vars.space[2]}`,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.28)',
    color: colors.text[5],
  },
])

export const titleStyle = style([
  titleMedium,
  {
    margin: `0 ${vars.space[3]}`,
    color: colors.text[1],
  },
])

export const metaStyle = style([
  captionSm,
  {
    margin: `0 ${vars.space[3]}`,
    color: colors.text[4],
  },
])

export const statsRowStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[3],
  margin: `0 ${vars.space[3]}`,
})

export const statItemStyle = style([
  bodySmall,
  {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    color: colors.text[3],
  },
])

export const actionsStyle = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: vars.space[2],
  margin: `${vars.space[1]} ${vars.space[3]} 0`,
})

export const secondaryButtonStyle = style([
  captionSm,
  {
    minHeight: 33,
    border: 'none',
    borderRadius: 10,
    backgroundColor: colors.background[2],
    color: colors.text[1],
    cursor: 'pointer',
  },
])

export const outlineButtonStyle = style([
  captionSm,
  {
    minHeight: 33,
    borderRadius: 10,
    border: `1px solid ${colors.border[1]}`,
    backgroundColor: colors.surface[1],
    color: colors.text[1],
    cursor: 'pointer',
  },
])
