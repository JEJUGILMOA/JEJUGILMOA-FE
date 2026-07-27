import { Outlet, useMatches } from 'react-router'
import { AppHeader } from '@/components/layout/AppHeader/AppHeader'
import { BottomNavigation } from '@/components/layout/BottomNavigation/BottomNavigation'
import { useNativeMessage } from '@/bridge/useNativeMessage'
import { useAppBootstrap } from '@/hooks/useAppBootstrap'
import { APP_NAME } from '@/constants'
import { layoutStyle, contentStyle, contentFullBleedStyle } from './AppLayout.css.ts'
import { cn } from '@/utils/cn'

export type RouteHandle = {
  title?: string
  hideAppHeader?: boolean
  hideBottomNav?: boolean
}

export function AppLayout() {
  useAppBootstrap()
  useNativeMessage()

  const matches = useMatches()
  const handles = matches.map((match) => match.handle as RouteHandle | undefined)
  const title =
    [...handles].reverse().map((handle) => handle?.title).find(Boolean) ?? APP_NAME
  const hideAppHeader = handles.some((handle) => handle?.hideAppHeader)
  const hideBottomNav = handles.some((handle) => handle?.hideBottomNav)

  return (
    <div className={layoutStyle}>
      {hideAppHeader ? null : <AppHeader title={title} />}
      <main className={cn(contentStyle, hideBottomNav && contentFullBleedStyle)}>
        <Outlet />
      </main>
      {hideBottomNav ? null : <BottomNavigation />}
    </div>
  )
}
