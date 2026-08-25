import { nativeBridge } from '@/bridge/nativeBridge'
import { Button, type ButtonVariant } from '@/components/ui/Button/Button'
import { cn } from '@/utils/cn'
import { useEffect, useId, useLayoutEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import {
  actionFixedStyle,
  actionGrowStyle,
  actionsStyle,
  bodyStyle,
  descriptionStyle,
  overlayStyle,
  panelStyle,
  titleStyle,
} from './Modal.css.ts'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export type ModalAction = {
  /** 버튼 라벨 */
  label: string
  /** 클릭 핸들러 */
  onClick: () => void
  /** 버튼 스타일. 기본값 primary */
  variant?: ButtonVariant
  /** false면 고정 너비, 그 외(기본) 가로로 늘어남 */
  grow?: boolean
}

type ModalProps = {
  /** true면 모달 표시 */
  open: boolean
  /** 다이얼로그 제목 */
  title: string
  /** 제목 아래 설명 */
  description?: string
  /** 본문 추가 콘텐츠 */
  children?: ReactNode
  /** 하단 액션 버튼. 미지정 시 닫기 버튼 하나 */
  actions?: ModalAction[]
  /** 닫기 (오버레이·Esc) */
  onClose: () => void
}

/**
 * 포커스 트랩·Esc 닫기를 지원하는 중앙 모달 다이얼로그.
 * 네이티브 웹뷰에서는 지도 위에 올라오도록 SET_MODAL로 네이티브 창을 띄운다.
 */
export function Modal({
  open,
  title,
  description,
  children,
  actions,
  onClose,
}: ModalProps) {
  const titleId = useId()
  const modalId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose
  const actionsRef = useRef<ModalAction[]>([])

  const resolvedActions =
    actions ??
    ([
      {
        label: '닫기',
        onClick: onClose,
        variant: 'ghost' as const,
        grow: true,
      },
    ] satisfies ModalAction[])
  actionsRef.current = resolvedActions

  const isNative = nativeBridge.isNativeWebView()

  useLayoutEffect(() => {
    if (!isNative) return
    if (open) {
      nativeBridge.postToNative({
        type: 'SET_MODAL',
        visible: true,
        id: modalId,
        title,
        description,
        actions: resolvedActions.map((action, index) => ({
          id: `${modalId}#${index}`,
          label: action.label,
          variant: action.variant ?? 'primary',
        })),
      })
      return
    }
    nativeBridge.postToNative({ type: 'SET_MODAL', visible: false, id: modalId })
  }, [isNative, open, modalId, title, description, actions])

  useEffect(() => {
    if (!isNative || !open) return
    const onAction = (event: Event) => {
      const id = (event as CustomEvent<{ id: string }>).detail?.id
      if (!id?.startsWith(`${modalId}#`)) return
      const index = Number(id.slice(id.lastIndexOf('#') + 1))
      actionsRef.current[index]?.onClick()
    }
    const onDismiss = () => onCloseRef.current()
    window.addEventListener('gilmoa:modal-action', onAction)
    window.addEventListener('gilmoa:modal-dismiss', onDismiss)
    return () => {
      window.removeEventListener('gilmoa:modal-action', onAction)
      window.removeEventListener('gilmoa:modal-dismiss', onDismiss)
    }
  }, [isNative, open, modalId])

  useEffect(() => {
    if (!open || isNative) return

    previousFocusRef.current = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const panel = panelRef.current
    const focusables = () =>
      panel ? Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)) : []

    const first = focusables()[0]
    first?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab' || !panel) return

      const items = focusables()
      if (items.length === 0) {
        event.preventDefault()
        return
      }

      const firstItem = items[0]
      const lastItem = items[items.length - 1]
      const active = document.activeElement as HTMLElement | null

      if (event.shiftKey) {
        if (active === firstItem || !panel.contains(active)) {
          event.preventDefault()
          lastItem.focus()
        }
      } else if (active === lastItem || !panel.contains(active)) {
        event.preventDefault()
        firstItem.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      previousFocusRef.current?.focus?.()
    }
  }, [open, onClose, isNative])

  if (isNative || !open) return null

  return createPortal(
    <div className={overlayStyle} role="presentation" onClick={onClose}>
      <div
        ref={panelRef}
        className={panelStyle}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={bodyStyle}>
          <h2 id={titleId} className={titleStyle}>
            {title}
          </h2>
          {description ? <p className={descriptionStyle}>{description}</p> : null}
          {children}
        </div>
        <div className={actionsStyle}>
          {resolvedActions.map((action) => (
            <Button
              key={action.label}
              variant={action.variant ?? 'primary'}
              size="lg"
              className={cn(action.grow === false ? actionFixedStyle : actionGrowStyle)}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  )
}
