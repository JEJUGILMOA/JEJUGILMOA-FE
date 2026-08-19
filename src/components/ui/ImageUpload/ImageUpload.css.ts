import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const hiddenInput = style({
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
})

export const imageUploadButton = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space[2],
  width: '100%',
  minHeight: '120px',
  padding: vars.space[4],
  borderRadius: vars.radius.sm,
  border: `1px dashed ${colors.border[1]}`,
  backgroundColor: colors.surface[2],
  color: colors.secondary[500],
  fontFamily: vars.fontFamily.sans,
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.medium,
  cursor: 'pointer',
  transition: `border-color ${vars.duration.fast}, background-color ${vars.duration.fast}`,
  selectors: {
    '&:hover': {
      borderColor: colors.secondary[300],
      backgroundColor: colors.secondary[100],
    },
    '&:focus-within': {
      outline: 'none',
      borderColor: colors.secondary[500],
      boxShadow: `0 0 0 3px ${colors.secondary[100]}`,
    },
  },
})

export const iconStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: colors.secondary[500],
})

export const previewImage = style({
  width: '72px',
  height: '72px',
  objectFit: 'cover',
  borderRadius: vars.radius.sm,
})

export const previewName = style({
  maxWidth: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  color: colors.text[3],
  fontSize: vars.fontSize.xs,
})
