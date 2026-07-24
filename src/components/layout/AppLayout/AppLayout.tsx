import { Outlet, useMatches } from 'react-router'
import { AppHeader } from '@/components/layout/AppHeader/AppHeader'
import { BottomNavigation } from '@/components/layout/BottomNavigation/BottomNavigation'
import { useNativeMessage } from '@/bridge/useNativeMessage'
import { useAppBootstrap } from '@/hooks/useAppBootstrap'
import { APP_NAME } from '@/constants'
import { layoutStyle, contentStyle, contentFlushStyle } from './AppLayout.css.ts'

export type RouteHandle = {
  title?: string
  /** true면 AppHeader 숨김 (페이지 자체 PageHeader 사용) */
  hideHeader?: boolean
  /** true면 BottomNavigation 숨김 */
  hideNav?: boolean
  /** true면 content 기본 패딩 제거 (풀블리드 히어로 등) */
  flush?: boolean
}

export function AppLayout() {
  useAppBootstrap()
  useNativeMessage()

  const matches = useMatches()
  const handles = matches.map((match) => match.handle as RouteHandle | undefined)

  const title =
    [...handles]
      .reverse()
      .map((handle) => handle?.title)
      .find(Boolean) ?? APP_NAME

  const hideHeader = handles.some((handle) => handle?.hideHeader)
  const hideNav = handles.some((handle) => handle?.hideNav)
  const flush = handles.some((handle) => handle?.flush)

  return (
    <div className={layoutStyle}>
      {!hideHeader ? <AppHeader title={title} /> : null}
      <main className={flush ? contentFlushStyle : contentStyle}>
        <Outlet />
      </main>
      {!hideNav ? <BottomNavigation /> : null}
    </div>
  )
}
