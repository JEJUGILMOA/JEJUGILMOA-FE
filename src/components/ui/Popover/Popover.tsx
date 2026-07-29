import { useEffect, useRef, type ReactNode } from 'react'
import { cn } from '@/utils/cn'
import { panelRecipe, rootStyle } from './Popover.css.ts'

export type PopoverAlign = 'start' | 'end'

export type PopoverProps = {
  /** true면 팝오버 패널 표시 */
  open: boolean
  /** 열림/닫힘 변경 핸들러 (바깥 클릭·Esc 닫힘 포함) */
  onOpenChange: (open: boolean) => void
  /** 팝오버를 여는 트리거 엘리먼트 */
  trigger: ReactNode
  /** 패널 내용 */
  children: ReactNode
  /** 트리거 기준 패널 정렬. 기본값 end */
  align?: PopoverAlign
  className?: string
  panelClassName?: string
  ariaLabel?: string
}

/**
 * 트리거에 앵커링되어 뜨는 팝오버. 바깥 클릭·Esc로 닫힌다.
 *
 * @example
 * <Popover open={open} onOpenChange={setOpen} trigger={<button>메뉴</button>}>내용</Popover>
 */
export function Popover({
  open,
  onOpenChange,
  trigger,
  children,
  align = 'end',
  className,
  panelClassName,
  ariaLabel,
}: PopoverProps) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        onOpenChange(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onOpenChange(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onOpenChange])

  return (
    <div ref={rootRef} className={cn(rootStyle, className)}>
      {trigger}
      {open ? (
        <div
          className={cn(panelRecipe({ align }), panelClassName)}
          role="menu"
          aria-label={ariaLabel}
        >
          {children}
        </div>
      ) : null}
    </div>
  )
}
