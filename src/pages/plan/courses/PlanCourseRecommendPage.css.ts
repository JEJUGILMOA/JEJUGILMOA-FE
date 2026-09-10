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
