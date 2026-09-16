import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'

const SWIPE_THRESHOLD_PX = 40
/** 이 정도 이하로 움직였으면 드래그가 아니라 탭으로 본다 */
const TAP_THRESHOLD_PX = 6

type DragCarouselOptions = {
  total: number
  index: number
  onIndexChange: (index: number) => void
  /** 스와이프 없이 제자리에서 누르고 뗐을 때 (전체화면 보기 등에 사용) */
  onTap?: () => void
}

/** 사진 캐러셀에서 좌우로 드래그(스와이프)해 이전/다음 사진으로 넘기는 제스처 처리. 움직임이 거의 없으면 탭으로 판단한다 */
export function useDragCarousel({ total, index, onIndexChange, onTap }: DragCarouselOptions) {
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const startXRef = useRef<number | null>(null)

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    startXRef.current = event.clientX
    if (total > 1) {
      setIsDragging(true)
      event.currentTarget.setPointerCapture(event.pointerId)
    }
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (startXRef.current === null || total <= 1) return
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
    } else if (Math.abs(dragOffset) < TAP_THRESHOLD_PX) {
      onTap?.()
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
