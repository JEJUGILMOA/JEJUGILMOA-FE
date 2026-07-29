import { Outlet, useMatches } from 'react-router'
import { BottomNavigation } from '@/components/layout/BottomNavigation/BottomNavigation'
import { useNativeMessage } from '@/bridge/useNativeMessage'
import { useAppBootstrap } from '@/hooks/useAppBootstrap'
import { cn } from '@/utils/cn'
import { layoutStyle, contentStyle, contentFlushStyle, contentFullBleedStyle } from './AppLayout.css.ts'

export type RouteHandle = {
  title?: string
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

  const hideNav = handles.some((handle) => handle?.hideNav)
  const flush = handles.some((handle) => handle?.flush)

  const mainClassName = flush
    ? contentFlushStyle
    : cn(contentStyle, hideNav && contentFullBleedStyle)

  return (
    <div className={layoutStyle}>
      <main className={mainClassName}>
        <Outlet />
      </main>
      {!hideNav ? <BottomNavigation /> : null}
    </div>
  )
}
