import { style } from '@vanilla-extract/css'
import { PAGE_HEADER_BLEED_VAR } from '@/components/ui/PageHeader/PageHeader.css.ts'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const pageStyle = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  gap: vars.space[4],
  padding: vars.space[4],
  paddingTop: 0,
  backgroundColor: colors.surface[1],
  vars: {
    [PAGE_HEADER_BLEED_VAR]: vars.space[4],
  },
})

export const listStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[4],
})

export const skeletonCardStyle = style({
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  borderRadius: vars.radius.sm,
  backgroundColor: colors.surface[1],
  boxShadow: '0 4px 16px rgba(37, 37, 45, 0.08)',
})

export const skeletonHeaderStyle = style({
  height: 92,
  backgroundColor: colors.surface[4],
})

export const skeletonBodyStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
  padding: `${vars.space[3]} ${vars.space[4]} ${vars.space[4]}`,
})

export const skeletonMetaRowStyle = style({
  display: 'flex',
  justifyContent: 'space-between',
  gap: vars.space[3],
})
