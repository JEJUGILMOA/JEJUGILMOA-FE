import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type WheelEvent as ReactWheelEvent } from 'react'
import {
  colonStyle,
  ITEM_HEIGHT,
  popoverStyle,
  VISIBLE_COUNT,
  wheelHighlightStyle,
  wheelItemStyle,
  wheelsRowStyle,
  wheelTrackStyle,
  wheelViewportStyle,
} from './TimeWheelPopover.css.ts'

const HOURS = Array.from({ length: 24 }, (_, hour) => String(hour).padStart(2, '0'))
const MINUTES = Array.from({ length: 60 }, (_, minute) => String(minute).padStart(2, '0'))
const CENTER_INDEX = Math.floor(VISIBLE_COUNT / 2)

export type AnchorRect = { top: number; bottom: number; left: number; width: number }

export type TimeWheelPopoverProps = {
  /** "HH:mm" */
  value: string
  onChange: (next: string) => void
  anchorRect: AnchorRect
  onClose: () => void
}

type WheelColumnProps = {
  options: string[]
  value: string
  onChange: (value: string) => void
  ariaLabel: string
}

/** 알람 앱 시간 휠처럼 드래그하거나 마우스 휠로 값을 스크롤해 고르는 단일 열 */
function WheelColumn({ options, value, onChange, ariaLabel }: WheelColumnProps) {
  const selectedIndex = Math.max(options.indexOf(value), 0)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartYRef = useRef(0)

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragStartYRef.current = event.clientY
    setIsDragging(true)
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMove = (event: PointerEvent) => {
      setDragOffset(event.clientY - dragStartYRef.current)
    }

    const handleUp = (event: PointerEvent) => {
      const deltaY = event.clientY - dragStartYRef.current
      const indexDelta = Math.round(-deltaY / ITEM_HEIGHT)
      const nextIndex = Math.min(Math.max(selectedIndex + indexDelta, 0), options.length - 1)
      setIsDragging(false)
      setDragOffset(0)
      if (options[nextIndex] !== value) onChange(options[nextIndex])
    }

    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp)
    window.addEventListener('pointercancel', handleUp)
    return () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
      window.removeEventListener('pointercancel', handleUp)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging])

  const handleWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    event.preventDefault()
    const direction = event.deltaY > 0 ? 1 : -1
    const nextIndex = Math.min(Math.max(selectedIndex + direction, 0), options.length - 1)
    if (options[nextIndex] !== value) onChange(options[nextIndex])
  }

  const translateY = (CENTER_INDEX - selectedIndex) * ITEM_HEIGHT + dragOffset

  return (
    <div
      className={wheelViewportStyle}
      onPointerDown={handlePointerDown}
      onWheel={handleWheel}
      role="listbox"
      aria-label={ariaLabel}
    >
      <div
        className={wheelTrackStyle}
        style={{
          transform: `translateY(${translateY}px)`,
          transition: isDragging ? 'none' : 'transform 180ms ease',
        }}
      >
        {options.map((option, index) => (
          <div key={option} className={wheelItemStyle} data-selected={index === selectedIndex}>
            {option}
          </div>
        ))}
      </div>
      <div className={wheelHighlightStyle} />
    </div>
  )
}

/** 알람 앱처럼 시/분을 각각 드래그(또는 마우스 휠)로 스크롤해서 맞추는 시간 피커 팝오버 */
export function TimeWheelPopover({ value, onChange, anchorRect, onClose }: TimeWheelPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null)
  const [hour, minute] = value.split(':')

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (popoverRef.current?.contains(event.target as Node)) return
      onClose()
    }
    window.addEventListener('pointerdown', handlePointerDown)
    return () => window.removeEventListener('pointerdown', handlePointerDown)
  }, [onClose])

  const popoverHeight = ITEM_HEIGHT * VISIBLE_COUNT + 16
  const opensUpward = anchorRect.bottom + popoverHeight > window.innerHeight
  const top = opensUpward ? anchorRect.top - popoverHeight - 6 : anchorRect.bottom + 6

  return (
    <div ref={popoverRef} className={popoverStyle} style={{ top, left: anchorRect.left }}>
      <div className={wheelsRowStyle}>
        <WheelColumn options={HOURS} value={hour} onChange={(next) => onChange(`${next}:${minute}`)} ariaLabel="시" />
        <span className={colonStyle}>:</span>
        <WheelColumn options={MINUTES} value={minute} onChange={(next) => onChange(`${hour}:${next}`)} ariaLabel="분" />
      </div>
    </div>
  )
}
