import { NavLink } from 'react-router'
import { Home, Map, CalendarDays, NotebookPen, User } from 'lucide-react'
import { navStyle, linkStyle, labelStyle } from './BottomNavigation.css.ts'
import { ROUTES } from '@/constants'

const items = [
  { to: ROUTES.home, label: '홈', icon: Home, end: true },
  { to: ROUTES.map, label: '지도', icon: Map, end: false },
  { to: ROUTES.plan, label: '계획', icon: CalendarDays, end: false },
  { to: ROUTES.record, label: '기록', icon: NotebookPen, end: false },
  { to: ROUTES.my, label: '마이', icon: User, end: false },
] as const

export function BottomNavigation() {
  return (
    <nav className={navStyle} aria-label="하단 내비게이션">
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) => linkStyle({ active: isActive })}
        >
          <Icon size={22} aria-hidden />
          <span className={labelStyle}>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
