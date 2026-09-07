import { type ReactNode, useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useLocation, useMatches } from 'react-router'
import { useNativeHeaderOverride } from '@/bridge/NativeHeaderProvider'
import { nativeBridge } from '@/bridge/nativeBridge'
import type { RouteHandle } from '@/components/layout/AppLayout/AppLayout'
import { cn } from '@/utils/cn'
import {
  backButton,
  pageHeaderAction,
  pageHeaderActionMuted,
  pageHeaderActionPrimary,
  pageHeaderHidden,
  pageHeaderIcon,
  pageHeaderLeft,
  pageHeaderRight,
  pageHeaderRightText,
  pageHeaderRoot,
  pageHeaderTitle,
} from './PageHeader.css.ts'

export type PageHeaderActionTone = 'default' | 'muted' | 'primary'
export type PageHeaderActionIcon = 'more' | 'bookmark'

export type PageHeaderAction = {
  id: string
  label: string
  tone?: PageHeaderActionTone
  icon?: PageHeaderActionIcon
  onPress: () => void
}

export type PageHeaderProps = {
  /** 페이지 제목 */
  title: string
  /** true면 뒤로 가기 버튼 표시. 기본값 false */
  showBack?: boolean
  /** 뒤로 가기 클릭 핸들러 */
  onBack?: () => void
  /** 우측 액션. 네이티브 헤더에도 동일하게 전달됩니다. */
  actions?: PageHeaderAction[]
  /** 클릭 없는 우측 텍스트 (예: 1 / 4) */
  rightText?: string
  /** 웹 전용 우측 슬롯. 네이티브로는 전달되지 않습니다. */
  rightSlot?: ReactNode
  className?: string
}

function serializeActions(actions: PageHeaderAction[] | undefined) {
  return (actions ?? []).map(({ id, label, tone, icon }) => ({
    id,
    label,
    tone,
    icon,
  }))
}

/** APP PageHeader SVG와 동일한 path (lucide와 미세한 시각 차이 제거) */
function ChevronLeftIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      className={pageHeaderIcon}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M15 18 9 12l6-6"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MoreIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      className={pageHeaderIcon}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM12 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM12 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
        fill="currentColor"
      />
    </svg>
  )
}

function BookmarkIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      className={pageHeaderIcon}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16Z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ActionIcon({ icon }: { icon: PageHeaderActionIcon }) {
  if (icon === 'bookmark') return <BookmarkIcon />
  return <MoreIcon />
}

/** 라우트 handle의 showHeader(마지막 match 우선). true면 네이티브 헤더 사용 */
function useRouteShowNativeHeader() {
  const matches = useMatches()
  let showHeader = false
  for (const match of matches) {
    const handle = match.handle as RouteHandle | undefined
    if (handle?.showHeader !== undefined) showHeader = handle.showHeader
  }
  return showHeader
}

/**
 * 페이지 상단 헤더. 뒤로 가기와 우측 액션을 지원합니다.
 * 라우트 showHeader가 true인 WebView에서는 숨기고 네이티브 헤더로 위임합니다.
 * showHeader가 false면(마이 하위 등) WebView에서도 웹 헤더를 그대로 씁니다.
 */
export function PageHeader({
  title,
  showBack = false,
  onBack,
  actions,
  rightText,
  rightSlot,
  className,
}: PageHeaderProps) {
  const showNativeHeader = useRouteShowNativeHeader()
  const hideInNative = nativeBridge.isNativeWebView() && showNativeHeader
  const { pathname } = useLocation()
  const { setOverride, clearOverride } = useNativeHeaderOverride()
  const onBackRef = useRef(onBack)
  const actionsRef = useRef(actions)
  onBackRef.current = onBack
  actionsRef.current = actions

  const actionsKey = useMemo(() => JSON.stringify(serializeActions(actions)), [actions])

  useLayoutEffect(() => {
    if (!nativeBridge.isNativeWebView()) return

    if (!showNativeHeader) {
      // 네이티브 헤더를 끄고 웹 PageHeader를 쓴다
      setOverride({ pathname, visible: false })
      return () => {
        clearOverride(pathname)
      }
    }

    setOverride({
      pathname,
      title,
      showBack,
      visible: true,
      rightText,
      actions: JSON.parse(actionsKey) as ReturnType<typeof serializeActions>,
    })

    return () => {
      clearOverride(pathname)
    }
  }, [
    pathname,
    title,
    showBack,
    rightText,
    actionsKey,
    showNativeHeader,
    setOverride,
    clearOverride,
  ])

  useEffect(() => {
    if (!showNativeHeader) return

    const onHeaderBack = (event: Event) => {
      if (!showBack) return
      event.preventDefault()
      onBackRef.current?.()
    }

    const onHeaderAction = (event: Event) => {
      const id = (event as CustomEvent<{ id: string }>).detail?.id
      actionsRef.current?.find((action) => action.id === id)?.onPress()
    }

    window.addEventListener('gilmoa:header-back', onHeaderBack)
    window.addEventListener('gilmoa:header-action', onHeaderAction)
    return () => {
      window.removeEventListener('gilmoa:header-back', onHeaderBack)
      window.removeEventListener('gilmoa:header-action', onHeaderAction)
    }
  }, [showBack, showNativeHeader])

  const hasRight = Boolean(rightText || (actions && actions.length > 0) || rightSlot)

  return (
    <header
      data-gilmoa-page-header
      className={cn(pageHeaderRoot, hideInNative && pageHeaderHidden, className)}
    >
      <div className={pageHeaderLeft}>
        {showBack ? (
          <button type="button" className={backButton} onClick={onBack} aria-label="뒤로 가기">
            <ChevronLeftIcon />
          </button>
        ) : null}
        <h1 className={pageHeaderTitle}>{title}</h1>
      </div>
      {hasRight ? (
        <div className={pageHeaderRight}>
          {rightText ? <span className={pageHeaderRightText}>{rightText}</span> : null}
          {actions?.map((action) => (
            <button
              key={action.id}
              type="button"
              className={cn(
                pageHeaderAction,
                action.tone === 'muted' && pageHeaderActionMuted,
                action.tone === 'primary' && pageHeaderActionPrimary,
              )}
              onClick={action.onPress}
              aria-label={action.label}
            >
              {action.icon ? <ActionIcon icon={action.icon} /> : action.label}
            </button>
          ))}
          {rightSlot}
        </div>
      ) : null}
    </header>
  )
}
