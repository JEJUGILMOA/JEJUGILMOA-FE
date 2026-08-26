import { style } from '@vanilla-extract/css'
import { PAGE_HEADER_BLEED_VAR } from '@/components/ui/PageHeader/PageHeader.css.ts'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'
import { bodySmall, titleMedium } from '@/styles/typography.css.ts'

export const pageStyle = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  gap: vars.space[3],
  padding: vars.space[4],
  paddingTop: 0,
  backgroundColor: colors.surface[1],
  vars: {
    [PAGE_HEADER_BLEED_VAR]: vars.space[4],
  },
})

export const listStyle = style({
  margin: 0,
  padding: 0,
  listStyle: 'none',
})

export const itemStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  width: '100%',
  padding: `${vars.space[3]} 0`,
  border: 'none',
  borderBottom: `1px solid ${colors.border[1]}`,
  background: 'transparent',
  cursor: 'pointer',
  textAlign: 'left',
})

export const titleStyle = style([
  titleMedium,
  {
    color: colors.text[1],
  },
])

export const dateStyle = style([
  bodySmall,
  {
    color: colors.text[4],
  },
])
