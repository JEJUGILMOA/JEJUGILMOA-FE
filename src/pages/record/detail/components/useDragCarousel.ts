import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'

const SWIPE_THRESHOLD_PX = 40

type DragCarouselOptions = {
  total: number
  index: number
  onIndexChange: (index: number) => void
}

/** 사진 캐러셀에서 좌우로 드래그(스와이프)해 이전/다음 사진으로 넘기는 제스처 처리 */
export function useDragCarousel({ total, index, onIndexChange }: DragCarouselOptions) {
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const startXRef = useRef<number | null>(null)

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (total <= 1) return
    startXRef.current = event.clientX
    setIsDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (startXRef.current === null) return
    setDragOffset(event.clientX - startXRef.current)
  }

  const endDrag = () => {
    if (startXRef.current === null) return
    startXRef.current = null
    setIsDragging(false)
    if (dragOffset <= -SWIPE_THRESHOLD_PX && index < total - 1) {
      onIndexChange(index + 1)
    } else if (dragOffset >= SWIPE_THRESHOLD_PX && index > 0) {
      onIndexChange(index - 1)
    }
    setDragOffset(0)
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
