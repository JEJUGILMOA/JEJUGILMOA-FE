import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'

const MIN_ZOOM = 1
const MAX_ZOOM = 2.5
const ZOOM_STEP = 0.5
const PAN_RANGE_PER_ZOOM = 110
const BASE_PAN_RANGE = 50

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

/** 자리표시 지도의 확대/축소·드래그 이동 상태와 포인터 핸들러를 제공한다 */
export function useZoomPan() {
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const dragRef = useRef<{ startX: number; startY: number; startPanX: number; startPanY: number } | null>(
    null,
  )

  const clampPan = (nextPan: { x: number; y: number }, zoomValue: number) => {
    const maxOffset = BASE_PAN_RANGE + (zoomValue - 1) * PAN_RANGE_PER_ZOOM
    return {
      x: clamp(nextPan.x, -maxOffset, maxOffset),
      y: clamp(nextPan.y, -maxOffset, maxOffset),
    }
  }

  const zoomIn = () => setZoom((z) => Math.min(z + ZOOM_STEP, MAX_ZOOM))
  const zoomOut = () =>
    setZoom((z) => {
      const next = Math.max(z - ZOOM_STEP, MIN_ZOOM)
      setPan((p) => clampPan(p, next))
      return next
    })

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = { startX: event.clientX, startY: event.clientY, startPanX: pan.x, startPanY: pan.y }
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return
    const dx = event.clientX - dragRef.current.startX
    const dy = event.clientY - dragRef.current.startY
    setPan(clampPan({ x: dragRef.current.startPanX + dx, y: dragRef.current.startPanY + dy }, zoom))
  }

  const handlePointerUp = () => {
    dragRef.current = null
  }

  return {
    zoom,
    pan,
    minZoom: MIN_ZOOM,
    maxZoom: MAX_ZOOM,
    zoomIn,
    zoomOut,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  }
}
