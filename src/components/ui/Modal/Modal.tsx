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
  label: string
  onClick: () => void
  variant?: ButtonVariant
  /** ? ??? ? ??? ?? ?? true */
  grow?: boolean
}

type ModalProps = {
  open: boolean
  title: string
  description?: string
  children?: ReactNode
  actions?: ModalAction[]
  onClose: () => void
}

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
