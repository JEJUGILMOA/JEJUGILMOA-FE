import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const pageStyle = style({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100%',
  backgroundColor: colors.surface[1],
  fontFamily: vars.fontFamily.sans,
  paddingBottom: `calc(88px + env(safe-area-inset-bottom))`,
})

export const heroStyle = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  backgroundColor: colors.surface[5],
})

export const bodyStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[4],
  padding: `${vars.space[5]} ${vars.space[5]} ${vars.space[4]}`,
  backgroundColor: colors.surface[1],
})

export const titleStyle = style({
  margin: 0,
  fontSize: '26px',
  fontWeight: vars.fontWeight.bold,
  letterSpacing: '-0.03em',
  lineHeight: 1.25,
  color: colors.text[1],
})

export const categoryTagStyle = style({
  display: 'inline-flex',
  alignSelf: 'flex-start',
  alignItems: 'center',
  padding: `5px ${vars.space[3]}`,
  borderRadius: vars.radius.full,
  backgroundColor: colors.primary[100],
  color: colors.primary[700],
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.semibold,
  lineHeight: 1.2,
})

export const addressTextStyle = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: vars.space[2],
  margin: 0,
  fontSize: vars.fontSize.md,
  lineHeight: vars.lineHeight.relaxed,
  color: colors.text[2],
})

export const addressIconStyle = style({
  flexShrink: 0,
  marginTop: '3px',
  color: colors.text[3],
})

export const dividerStyle = style({
  width: '100%',
  height: '1px',
  margin: 0,
  border: 'none',
  backgroundColor: colors.border[1],
})

export const sectionStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
})

export const sectionTitleStyle = style({
  margin: 0,
  fontSize: vars.fontSize.lg,
  fontWeight: vars.fontWeight.bold,
  color: colors.text[1],
})

export const descriptionStyle = style({
  margin: 0,
  fontSize: vars.fontSize.sm,
  lineHeight: vars.lineHeight.relaxed,
  color: colors.text[2],
  whiteSpace: 'pre-wrap',
})

export const contactListStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
  margin: 0,
  padding: 0,
  listStyle: 'none',
})

export const contactItemStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
  fontSize: vars.fontSize.sm,
  color: colors.text[2],
})

export const contactIconStyle = style({
  display: 'inline-flex',
  color: colors.primary[500],
})

export const contactLinkStyle = style({
  color: colors.text[1],
  fontWeight: vars.fontWeight.semibold,
  textDecoration: 'none',
})

export const footerStyle = style({
  position: 'fixed',
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: vars.zIndex.sticky,
  maxWidth: '720px',
  marginInline: 'auto',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: vars.space[2],
  padding: `${vars.space[3]} ${vars.space[4]}`,
  paddingBottom: `calc(${vars.space[3]} + env(safe-area-inset-bottom))`,
  backgroundColor: colors.surface[1],
  borderTop: `1px solid ${colors.border[1]}`,
})

export const footerSaveButtonStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space[2],
  height: '52px',
  border: `1px solid ${colors.border[1]}`,
  borderRadius: vars.radius.buttonLg,
  backgroundColor: colors.surface[1],
  color: colors.text[1],
  fontSize: vars.fontSize.md,
  fontWeight: vars.fontWeight.semibold,
  cursor: 'pointer',
  selectors: {
    '&[aria-pressed="true"]': {
      color: colors.primary[500],
      borderColor: colors.primary[300],
      backgroundColor: colors.primary[100],
    },
    '&:disabled': {
      opacity: 0.6,
      cursor: 'default',
    },
  },
})

export const footerMapButtonStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space[2],
  height: '52px',
  border: 'none',
  borderRadius: vars.radius.buttonLg,
  backgroundColor: colors.primary[100],
  color: colors.primary[700],
  fontSize: vars.fontSize.md,
  fontWeight: vars.fontWeight.semibold,
  cursor: 'pointer',
})
