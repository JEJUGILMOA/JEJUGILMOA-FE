import { style } from '@vanilla-extract/css'
import { PAGE_HEADER_BLEED_VAR } from '@/components/ui/PageHeader/PageHeader.css.ts'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const pageStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[4],
  minHeight: '100%',
  padding: vars.space[4],
  paddingTop: 0,
  backgroundColor: colors.background[1],
  fontFamily: vars.fontFamily.sans,
  vars: {
    [PAGE_HEADER_BLEED_VAR]: vars.space[4],
  },
})

export const listStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[4],
  paddingBottom: vars.space[2],
})

export const skeletonCardStyle = style({
  display: 'flex',
  alignItems: 'stretch',
  minHeight: '200px',
  overflow: 'hidden',
  borderRadius: '16px',
  border: `1px solid ${colors.border[1]}`,
  backgroundColor: colors.surface[1],
})

export const skeletonMediaStyle = style({
  flex: '1 1 0',
  minWidth: 0,
  alignSelf: 'stretch',
})

export const skeletonContentStyle = style({
  flex: '2 1 0',
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
  padding: vars.space[4],
})

export const skeletonPreviewRowStyle = style({
  display: 'flex',
  gap: '8px',
  marginTop: 'auto',
})
