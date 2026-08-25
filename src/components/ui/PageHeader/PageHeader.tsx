import { Bookmark, ChevronLeft, MoreVertical } from 'lucide-react'
import { type ReactNode, useEffect, useMemo, useRef } from 'react'
import { nativeBridge } from '@/bridge/nativeBridge'
import { heading2 } from '@/styles/typography.css.ts'
import { cn } from '@/utils/cn'
import {
  backButton,
  pageHeaderAction,
  pageHeaderActionMuted,
  pageHeaderActionPrimary,
  pageHeaderHidden,
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

function ActionIcon({ icon }: { icon: PageHeaderActionIcon }) {
  if (icon === 'bookmark') return <Bookmark size={20} />
  return <MoreVertical size={16} />
}

/**
 * 페이지 상단 헤더. 뒤로 가기와 우측 액션을 지원합니다.
 * 네이티브 WebView에서는 숨기고 SET_HEADER로 앱 헤더에 위임합니다.
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
  const hideInNative = nativeBridge.isNativeWebView()
  const onBackRef = useRef(onBack)
  const actionsRef = useRef(actions)
  onBackRef.current = onBack
  actionsRef.current = actions

  const serializedActions = useMemo(() => JSON.stringify(serializeActions(actions)), [actions])

  useEffect(() => {
    if (!nativeBridge.isNativeWebView()) return

    nativeBridge.postToNative({
      type: 'SET_HEADER',
      title,
      showBack,
      visible: true,
      rightText,
      actions: serializeActions(actions),
    })

    return () => {
      nativeBridge.postToNative({
        type: 'SET_HEADER',
        title: '',
        showBack: false,
        visible: false,
        rightText: '',
        actions: [],
      })
    }
  }, [title, showBack, rightText, serializedActions])

  useEffect(() => {
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
  }, [showBack])

  const hasRight = Boolean(rightText || (actions && actions.length > 0) || rightSlot)

  return (
    <header
      data-gilmoa-page-header
      className={cn(pageHeaderRoot, hideInNative && pageHeaderHidden, className)}
    >
      <div className={pageHeaderLeft}>
        {showBack ? (
          <button type="button" className={backButton} onClick={onBack} aria-label="뒤로 가기">
            <ChevronLeft size={24} strokeWidth={2} />
          </button>
        ) : null}
        <h1 className={cn(heading2, pageHeaderTitle)}>{title}</h1>
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
