import { style, globalStyle } from '@vanilla-extract/css'
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

export const chipRowStyle = style({
  display: 'flex',
  gap: vars.space[2],
})

globalStyle(`${chipRowStyle} > *`, {
  flexShrink: 0,
})

export const listStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
  width: '100%',
})

export const loadMoreSentinelStyle = style({
  width: '100%',
  height: 1,
})

export const loadMoreStatusStyle = style({
  margin: 0,
  padding: `${vars.space[3]} 0 ${vars.space[6]}`,
  textAlign: 'center',
  fontSize: vars.fontSize.xs,
  color: colors.text[4],
})
