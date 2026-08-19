import { useEffect, useId, useRef, type ReactNode } from 'react'
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
import { Button, type ButtonVariant } from '@/components/ui/Button/Button'
import { cn } from '@/utils/cn'

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
 *
 * @example
 * <Modal open={open} title="삭제할까요?" onClose={close} actions={[{ label: '삭제', onClick: remove, variant: 'danger' }]} />
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
  const panelRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return

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
  }, [open, onClose])

  if (!open) return null

  const resolvedActions =
    actions ??
    ([
      {
        label: '??',
        onClick: onClose,
        variant: 'ghost' as const,
        grow: true,
      },
    ] satisfies ModalAction[])

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
