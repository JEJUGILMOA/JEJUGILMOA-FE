import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const sectionTitleStyle = style({
  marginBottom: vars.space[3],
  fontSize: vars.fontSize.lg,
  fontWeight: vars.fontWeight.semibold,
  color: colors.text[1],
})

export const mapAreaStyle = style({
  position: 'relative',
  width: '100%',
  aspectRatio: '4 / 3',
  borderRadius: vars.radius.md,
  overflow: 'hidden',
  backgroundColor: colors.surface[4],
})

export const mapLabelStyle = style({
  position: 'absolute',
  top: vars.space[2],
  left: 0,
  right: 0,
  textAlign: 'center',
  fontSize: vars.fontSize.xs,
  color: colors.text[4],
})

export const pathSvgStyle = style({
  width: '100%',
  height: '100%',
})

export const pathLineStyle = style({
  fill: 'none',
  stroke: colors.primary[300],
  strokeWidth: 0.6,
  strokeDasharray: '2 1.6',
  strokeLinecap: 'round',
})

export const pinCircleStyle = style({
  fill: colors.primary[500],
  stroke: colors.surface[1],
  strokeWidth: 0.6,
})

export const pinTextStyle = style({
  fill: colors.text[5],
  fontSize: 3,
  fontWeight: 700,
  textAnchor: 'middle',
  dominantBaseline: 'central',
})

export const pinLabelStyle = style({
  fill: colors.text[2],
  fontSize: 2.6,
  fontWeight: 600,
  textAnchor: 'middle',
})
