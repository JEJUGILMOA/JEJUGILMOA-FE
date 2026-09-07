import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useLocation, useMatches } from 'react-router'
import { nativeBridge } from '@/bridge/nativeBridge'
import type { RouteHandle } from '@/components/layout/AppLayout/AppLayout'

export type NativeHeaderAction = {
  id: string
  label: string
  tone?: 'default' | 'muted' | 'primary'
  icon?: 'more' | 'bookmark'
}

/** 페이지(PageHeader)가 라우트 기본값을 덮어쓸 때 사용. pathname으로 이전 화면 override를 무시한다. */
export type NativeHeaderOverride = {
  pathname: string
  title?: string
  showBack?: boolean
  visible?: boolean
  rightText?: string
  actions?: NativeHeaderAction[]
}

type NativeHeaderContextValue = {
  setOverride: (override: NativeHeaderOverride) => void
  clearOverride: (pathname: string) => void
}

const NativeHeaderContext = createContext<NativeHeaderContextValue | null>(null)

const EMPTY_ACTIONS: NativeHeaderAction[] = []

function resolveRouteHeader(handles: Array<RouteHandle | undefined>) {
  let title: string | undefined
  let showHeader = false
  let showBack = false

  for (const handle of handles) {
    if (!handle) continue
    if (handle.title !== undefined) title = handle.title
    if (handle.showHeader !== undefined) showHeader = handle.showHeader
    if (handle.showBack !== undefined) showBack = handle.showBack
  }

  return { title, showHeader, showBack }
}

/**
 * 네이티브 헤더의 단일 소유자.
 * 라우트 handle을 SSOT로 두고, PageHeader override로 동적 title/actions만 보강한다.
 */
export function NativeHeaderProvider({ children }: { children: ReactNode }) {
  const matches = useMatches()
  const { pathname } = useLocation()
  const [override, setOverrideState] = useState<NativeHeaderOverride | null>(null)

  const setOverride = useCallback((next: NativeHeaderOverride) => {
    setOverrideState(next)
  }, [])

  const clearOverride = useCallback((path: string) => {
    setOverrideState((prev) => (prev?.pathname === path ? null : prev))
  }, [])

  const routeHeader = useMemo(() => {
    const handles = matches.map((match) => match.handle as RouteHandle | undefined)
    return resolveRouteHeader(handles)
  }, [matches])

  const activeOverride = override?.pathname === pathname ? override : null

  const headerMessage = useMemo(
    () => ({
      type: 'SET_HEADER' as const,
      visible: activeOverride?.visible ?? routeHeader.showHeader,
      title: activeOverride?.title ?? routeHeader.title ?? '',
      showBack: activeOverride?.showBack ?? routeHeader.showBack,
      rightText: activeOverride?.rightText ?? '',
      actions: activeOverride?.actions ?? EMPTY_ACTIONS,
    }),
    [activeOverride, routeHeader.showBack, routeHeader.showHeader, routeHeader.title],
  )

  useLayoutEffect(() => {
    if (!nativeBridge.isNativeWebView()) return
    nativeBridge.postToNative(headerMessage)
  }, [headerMessage])

  const value = useMemo(
    () => ({
      setOverride,
      clearOverride,
    }),
    [setOverride, clearOverride],
  )

  return <NativeHeaderContext.Provider value={value}>{children}</NativeHeaderContext.Provider>
}

export function useNativeHeaderOverride() {
  const ctx = useContext(NativeHeaderContext)
  if (!ctx) {
    return {
      setOverride: (_override: NativeHeaderOverride) => undefined,
      clearOverride: (_pathname: string) => undefined,
    }
  }
  return ctx
}
