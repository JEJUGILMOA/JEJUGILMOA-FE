import { Outlet, useMatches } from 'react-router'
import { AppHeader } from '@/components/layout/AppHeader/AppHeader'
import { BottomNavigation } from '@/components/layout/BottomNavigation/BottomNavigation'
import { useNativeMessage } from '@/bridge/useNativeMessage'
import { useAppBootstrap } from '@/hooks/useAppBootstrap'
import { APP_NAME } from '@/constants'
import { layoutStyle, contentStyle } from './AppLayout.css.ts'

type RouteHandle = {
  title?: string
}

export function AppLayout() {
  useAppBootstrap()
  useNativeMessage()

  const matches = useMatches()
  const title =
    [...matches]
      .reverse()
      .map((match) => (match.handle as RouteHandle | undefined)?.title)
      .find(Boolean) ?? APP_NAME

  return (
    <div className={layoutStyle}>
      <AppHeader title={title} />
      <main className={contentStyle}>
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  )
}
