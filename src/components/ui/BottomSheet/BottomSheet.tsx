import type { ReactNode } from 'react'
import { Drawer } from 'vaul'
import { contentStyle, handleStyle, overlayStyle, titleStyle } from './BottomSheet.css.ts'

type BottomSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  children: ReactNode
}

export function BottomSheet({ open, onOpenChange, title, children }: BottomSheetProps) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className={overlayStyle} />
        <Drawer.Content className={contentStyle}>
          <div className={handleStyle} />
          {title ? <Drawer.Title className={titleStyle}>{title}</Drawer.Title> : null}
          {children}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
