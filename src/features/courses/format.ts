import type { CourseTheme } from './schemas'

const THEME_LABELS: Record<CourseTheme, string> = {
  FOOD: '맛집',
  NATURE: '자연',
  ACTIVITY: '액티비티',
  CAFE: '카페',
  CULTURE: '문화',
  SHOPPING: '쇼핑',
  FESTIVAL: '축제',
}

export function courseThemeLabel(theme?: string): string | undefined {
  if (!theme) return undefined
  return THEME_LABELS[theme as CourseTheme] ?? theme
}

export function courseThemeTone(theme?: string): 'blue' | 'pink' | 'green' {
  switch (theme) {
    case 'NATURE':
      return 'green'
    case 'FOOD':
    case 'CAFE':
    case 'FESTIVAL':
      return 'pink'
    default:
      return 'blue'
  }
}
