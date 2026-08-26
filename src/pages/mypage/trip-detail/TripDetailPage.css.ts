import { style } from '@vanilla-extract/css'
import { PAGE_HEADER_BLEED_VAR } from '@/components/ui/PageHeader/PageHeader.css.ts'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'
import { bodySmall, captionSm, heading3, titleMedium, titleSmall } from '@/styles/typography.css.ts'

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

export const titleStyle = style([
  heading3,
  {
    margin: 0,
    color: colors.text[1],
  },
])

export const metaStyle = style([
  bodySmall,
  {
    margin: 0,
    color: colors.text[3],
  },
])

export const statsGridStyle = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: vars.space[2],
})

export const statsItemStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 2,
  padding: vars.space[3],
  borderRadius: vars.radius.md,
  backgroundColor: colors.surface[3],
})

export const statsValueStyle = style([
  titleMedium,
  {
    color: colors.text[1],
  },
])

export const statsLabelStyle = style([
  captionSm,
  {
    color: colors.text[4],
  },
])

export const sectionTitleStyle = style([
  titleSmall,
  {
    margin: `${vars.space[2]} 0 0`,
    color: colors.text[1],
  },
])

export const timelineListStyle = style({
  margin: 0,
  padding: 0,
  listStyle: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
})

export const timelineItemStyle = style([
  bodySmall,
  {
    color: colors.text[2],
    paddingLeft: vars.space[3],
    borderLeft: `2px solid ${colors.primary[300]}`,
  },
])
