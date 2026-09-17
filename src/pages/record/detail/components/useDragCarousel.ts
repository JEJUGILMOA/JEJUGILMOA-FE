import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'

const SWIPE_THRESHOLD_PX = 40
/** 이 거리 이상 움직이면 탭이 아님 (스크롤·스와이프 의도) */
const TAP_SLOP_PX = 14

type DragCarouselOptions = {
  total: number
  index: number
  onIndexChange: (index: number) => void
  /** 스와이프/스크롤 없이 짧게 탭했을 때 (전체화면 보기 등) */
  onTap?: () => void
}

/** 사진 캐러셀 좌우 스와이프 + 탭 판정. 세로 스크롤은 탭으로 치지 않는다. */
export function useDragCarousel({ total, index, onIndexChange, onTap }: DragCarouselOptions) {
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const startXRef = useRef<number | null>(null)
  const startYRef = useRef<number | null>(null)
  const dragOffsetRef = useRef(0)
  const axisLockRef = useRef<'x' | 'y' | null>(null)
  const movedBeyondSlopRef = useRef(false)
  const pointerIdRef = useRef<number | null>(null)
  const targetRef = useRef<HTMLDivElement | null>(null)

  const resetGesture = () => {
    if (
      pointerIdRef.current != null &&
      targetRef.current?.hasPointerCapture(pointerIdRef.current)
    ) {
      targetRef.current.releasePointerCapture(pointerIdRef.current)
    }
    startXRef.current = null
    startYRef.current = null
    dragOffsetRef.current = 0
    axisLockRef.current = null
    movedBeyondSlopRef.current = false
    pointerIdRef.current = null
    targetRef.current = null
    setIsDragging(false)
    setDragOffset(0)
  }

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    startXRef.current = event.clientX
    startYRef.current = event.clientY
    dragOffsetRef.current = 0
    axisLockRef.current = null
    movedBeyondSlopRef.current = false
    pointerIdRef.current = event.pointerId
    targetRef.current = event.currentTarget
    setDragOffset(0)
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (startXRef.current === null || startYRef.current === null) return

    const dx = event.clientX - startXRef.current
    const dy = event.clientY - startYRef.current
    const absX = Math.abs(dx)
    const absY = Math.abs(dy)

    if (!movedBeyondSlopRef.current && (absX > TAP_SLOP_PX || absY > TAP_SLOP_PX)) {
      movedBeyondSlopRef.current = true
    }

    if (axisLockRef.current == null && (absX > TAP_SLOP_PX || absY > TAP_SLOP_PX)) {
      axisLockRef.current = absX >= absY ? 'x' : 'y'
      if (axisLockRef.current === 'x' && total > 1) {
        setIsDragging(true)
        // 가로 스와이프만 캡처 — 세로 스크롤은 브라우저에 맡김
        event.currentTarget.setPointerCapture(event.pointerId)
      } else if (axisLockRef.current === 'y') {
        // 세로로 잠기면 제스처 종료해 페이지 스크롤과 충돌하지 않게 함
        resetGesture()
        return
      }
    }

    if (total <= 1 || axisLockRef.current !== 'x') return

    dragOffsetRef.current = dx
    setDragOffset(dx)
  }

  const endDrag = () => {
    if (startXRef.current === null) return

    const offset = dragOffsetRef.current
    const axis = axisLockRef.current
    const moved = movedBeyondSlopRef.current

    if (axis === 'x' && total > 1) {
      if (offset <= -SWIPE_THRESHOLD_PX && index < total - 1) {
        onIndexChange(index + 1)
      } else if (offset >= SWIPE_THRESHOLD_PX && index > 0) {
        onIndexChange(index - 1)
      }
    } else if (!moved && axis == null) {
      onTap?.()
    }

    resetGesture()
  }

  return {
    dragOffset,
    isDragging,
    trackHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
    },
  }
}
