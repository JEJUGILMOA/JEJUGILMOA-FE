import { defineProperties, createSprinkles } from '@vanilla-extract/sprinkles'
import { vars } from './theme.css.ts'

const spaceProperties = defineProperties({
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
      surface: vars.color.surface,
      background: vars.color.background,
      brand: vars.color.brand,
      brandSoft: vars.color.brandSoft,
      muted: vars.color.surfaceMuted,
    },
    color: {
      text: vars.color.text,
      muted: vars.color.textMuted,
      inverse: vars.color.textInverse,
      brand: vars.color.brand,
      danger: vars.color.danger,
    },
  },
})

export const sprinkles = createSprinkles(spaceProperties)
export type Sprinkles = Parameters<typeof sprinkles>[0]
