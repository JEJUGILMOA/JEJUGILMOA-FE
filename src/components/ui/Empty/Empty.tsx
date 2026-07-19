import type { ReactNode } from 'react'
import { AlertCircle, Heart, Search } from 'lucide-react'
import {
  emptyDescriptionStyle,
  emptyStyle,
  emptyTitleStyle,
  iconWrapRecipe,
} from './Empty.css.ts'

type EmptyTone = 'neutral' | 'primary' | 'danger'

type EmptyProps = {
  title?: string
  description?: string
  tone?: EmptyTone
  icon?: ReactNode
  action?: ReactNode
}

const defaultIcons: Record<EmptyTone, ReactNode> = {
  neutral: <Search size={24} />,
  primary: <Heart size={24} />,
  danger: <AlertCircle size={24} />,
}

export function Empty({
  title = '',
  description = '',
  tone = 'neutral',
  icon,
  action,
}: EmptyProps) {
  return (
    <div className={emptyStyle} role="status">
      <span className={iconWrapRecipe({ tone })} aria-hidden>
        {icon ?? defaultIcons[tone]}
      </span>
      <div>
        <p className={emptyTitleStyle}>{title}</p>
        <p className={emptyDescriptionStyle}>{description}</p>
      </div>
      {action}
    </div>
  )
}
