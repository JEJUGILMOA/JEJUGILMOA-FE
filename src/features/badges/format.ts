import { Mountain, UtensilsCrossed, Users } from 'lucide-react'
import type { ComponentType } from 'react'
import type { BadgeGroup } from './schemas'

export const BADGE_GROUP_LABEL: Record<BadgeGroup['group'], string> = {
  EXPLORATION: '탐험',
  GOURMET: '미식',
  SOCIAL: '소셜',
}

export type BadgeGroupTheme = {
  label: string
  Icon: ComponentType<{ size?: number; strokeWidth?: number; className?: string }>
  cardClass: 'exploration' | 'gourmet' | 'social'
}

export const BADGE_GROUP_THEME: Record<BadgeGroup['group'], BadgeGroupTheme> = {
  EXPLORATION: {
    label: BADGE_GROUP_LABEL.EXPLORATION,
    Icon: Mountain,
    cardClass: 'exploration',
  },
  GOURMET: {
    label: BADGE_GROUP_LABEL.GOURMET,
    Icon: UtensilsCrossed,
    cardClass: 'gourmet',
  },
  SOCIAL: {
    label: BADGE_GROUP_LABEL.SOCIAL,
    Icon: Users,
    cardClass: 'social',
  },
}
