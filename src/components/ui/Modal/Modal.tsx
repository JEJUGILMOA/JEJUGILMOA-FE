import type { ReactNode } from 'react'
import { overlayStyle, panelStyle, titleStyle } from './Modal.css.ts'
import { Button } from '@/components/ui/Button/Button'

type ModalProps = {
  open: boolean
  title: string
  children: ReactNode
  onClose: () => void
}

export function Modal({ open, title, children, onClose }: ModalProps) {
  if (!open) return null

  return (
    <div className={overlayStyle} role="presentation" onClick={onClose}>
      <div
        className={panelStyle}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className={titleStyle}>{title}</h2>
        {children}
        <Button variant="ghost" onClick={onClose}>
          ?«ê¸°
        </Button>
      </div>
    </div>
  )
}
