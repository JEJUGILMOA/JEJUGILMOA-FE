import { defineProperties, createSprinkles } from '@vanilla-extract/sprinkles'
import { colors } from './colors.css.ts'
import { vars } from './vars.css.ts'

const properties = defineProperties({
  properties: {
    display: ['none', 'flex', 'block', 'inline-flex', 'grid'],
    flexDirection: ['row', 'column'],
    alignItems: ['stretch', 'flex-start', 'center', 'flex-end'],
    justifyContent: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around'],
    gap: vars.space,
    padding: vars.space,
    paddingTop: vars.space,
    paddingBottom: vars.space,
    paddingLeft: vars.space,
    paddingRight: vars.space,
    margin: vars.space,
    marginTop: vars.space,
    marginBottom: vars.space,
    width: ['100%', 'auto'],
    minHeight: vars.size,
    borderRadius: vars.radius,
    background: {
      surface: colors.surface[1],
      background: colors.background[2],
      primary: colors.primary[500],
      primarySoft: colors.primary[100],
      muted: colors.surface[3],
    },
    color: {
      text: colors.text[1],
      muted: colors.text[3],
      inverse: colors.text[5],
      primary: colors.primary[500],
      secondary: colors.secondary[500],
      error: colors.error[500],
    },
  },
})

export const sprinkles = createSprinkles(properties)
export type Sprinkles = Parameters<typeof sprinkles>[0]
