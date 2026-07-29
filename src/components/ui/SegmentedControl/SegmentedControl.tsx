import { useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'
import { cn } from '@/utils/cn'
import { indicatorStyle, segmentRecipe, segmentedRoot, segmentedRootFullWidth } from './SegmentedControl.css.ts'

export type SegmentedControlItem = {
  /** 세그먼트 고유 값 */
  value: string
  /** 표시 라벨 */
  label: string
}

export type SegmentedControlProps = {
  /** 선택지 목록 */
  items: SegmentedControlItem[]
  /** 현재 선택된 value */
  value: string
  /** 선택 변경 핸들러 */
  onChange: (value: string) => void
  className?: string
  /** radiogroup 접근성 라벨. 기본값 "옵션 선택" */
  'aria-label'?: string
  /** true면 컨테이너 전체 폭을 채우고 세그먼트를 균등 분할 */
  fullWidth?: boolean
}

type IndicatorRect = {
  left: number
  width: number
}

/**
 * 서로 배타적인 옵션을 고르는 세그먼트 컨트롤.
 *
 * @example
 * <SegmentedControl items={[{ value: 'list', label: '목록' }, { value: 'map', label: '지도' }]} value={mode} onChange={setMode} />
 */
export function SegmentedControl({
  items,
  value,
  onChange,
  className,
  'aria-label': ariaLabel = '옵션 선택',
  fullWidth = false,
}: SegmentedControlProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map())
  const [indicator, setIndicator] = useState<IndicatorRect | null>(null)
  const [animated, setAnimated] = useState(false)

  useLayoutEffect(() => {
    const root = rootRef.current
    const activeButton = buttonRefs.current.get(value)
    if (!root || !activeButton) return

    const update = () => {
      const rootRect = root.getBoundingClientRect()
      const buttonRect = activeButton.getBoundingClientRect()
      setIndicator({
        left: buttonRect.left - rootRect.left,
        width: buttonRect.width,
      })
    }

    update()

    const frame = requestAnimationFrame(() => setAnimated(true))
    const resizeObserver = new ResizeObserver(update)
    resizeObserver.observe(root)
    resizeObserver.observe(activeButton)

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
    }
  }, [value, items])

  const focusItem = (itemValue: string) => {
    buttonRefs.current.get(itemValue)?.focus()
  }

  const selectAt = (index: number) => {
    const next = items[(index + items.length) % items.length]
    onChange(next.value)
    focusItem(next.value)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = items.findIndex((item) => item.value === value)
    if (currentIndex < 0) return

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault()
        selectAt(currentIndex + 1)
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault()
        selectAt(currentIndex - 1)
        break
      case 'Home':
        event.preventDefault()
        selectAt(0)
        break
      case 'End':
        event.preventDefault()
        selectAt(items.length - 1)
        break
      default:
        break
    }
  }

  return (
    <div
      ref={rootRef}
      className={cn(segmentedRoot, fullWidth && segmentedRootFullWidth, className)}
      role="radiogroup"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
    >
      {indicator ? (
        <span
          className={indicatorStyle}
          style={{
            width: indicator.width,
            transform: `translateX(${indicator.left}px)`,
            transition: animated ? undefined : 'none',
          }}
          aria-hidden
        />
      ) : null}
      {items.map((item) => {
        const isActive = item.value === value

        return (
          <button
            key={item.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            tabIndex={isActive ? 0 : -1}
            className={segmentRecipe({ active: isActive, fullWidth })}
            ref={(node) => {
              if (node) buttonRefs.current.set(item.value, node)
              else buttonRefs.current.delete(item.value)
            }}
            onClick={() => onChange(item.value)}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
