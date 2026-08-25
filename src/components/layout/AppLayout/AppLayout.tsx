import { Outlet, useMatches } from 'react-router'
import { BottomNavigation } from '@/components/layout/BottomNavigation/BottomNavigation'
import { nativeBridge } from '@/bridge/nativeBridge'
import { useNativeMessage } from '@/bridge/useNativeMessage'
import { useAppBootstrap } from '@/hooks/useAppBootstrap'
import { cn } from '@/utils/cn'
import { layoutStyle, layoutHideNavStyle, contentStyle, contentFlushStyle, contentFlushWithNavStyle, contentFlushNoNavStyle, contentFullBleedStyle } from './AppLayout.css.ts'

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

  const hideNav =
    nativeBridge.shouldHideWebBottomNav() || handles.some((handle) => handle?.hideNav)
  const flush = handles.some((handle) => handle?.flush)

  const mainClassName = flush
    ? cn(contentFlushStyle, hideNav ? contentFlushNoNavStyle : contentFlushWithNavStyle)
    : cn(contentStyle, hideNav && contentFullBleedStyle)

  return (
    <div data-gilmoa-shell className={cn(layoutStyle, hideNav && layoutHideNavStyle)}>
      <main className={mainClassName}>
        <Outlet />
      </main>
      {!hideNav ? <BottomNavigation /> : null}
    </div>
  )
}
