import { type ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/utils/cn'
import {
  chevronStyle,
  iconWrapStyle,
  labelStyle,
  menuItemStyle,
} from './MenuListItem.css.ts'

export type MenuListItemProps = {
  label: string
  icon: ReactNode
  onClick?: () => void
  className?: string
}

export function MenuListItem({ label, icon, onClick, className }: MenuListItemProps) {
  return (
    <button type="button" className={cn(menuItemStyle, className)} onClick={onClick}>
      <span className={iconWrapStyle} aria-hidden>
        {icon}
      </span>
      <span className={labelStyle}>{label}</span>
      <ChevronRight className={chevronStyle} size={16} strokeWidth={2} aria-hidden />
    </button>
  )
}
