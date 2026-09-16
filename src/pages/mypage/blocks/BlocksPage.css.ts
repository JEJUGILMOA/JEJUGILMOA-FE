import { style } from '@vanilla-extract/css'
import { PAGE_HEADER_BLEED_VAR } from '@/components/ui/PageHeader/PageHeader.css.ts'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'
import { titleMedium } from '@/styles/typography.css.ts'

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
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
})

export const itemStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[3],
  width: '100%',
  minHeight: 64,
  padding: `${vars.space[2]} ${vars.space[1]}`,
})

export const metaStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
  minWidth: 0,
  flex: 1,
})

export const nameStyle = style([
  titleMedium,
  {
    color: colors.text[1],
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
])

export const skeletonItemStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[3],
  minHeight: 64,
  padding: `${vars.space[2]} ${vars.space[1]}`,
})

export const skeletonAvatarStyle = style({
  width: 42,
  height: 42,
  borderRadius: '50%',
  flexShrink: 0,
})
