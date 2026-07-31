import { ZoomIn, ZoomOut } from 'lucide-react'
import { useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import {
  canvasStyle,
  pinButtonRecipe,
  pinDotRecipe,
  viewportStyle,
  zoomButtonStyle,
  zoomControlsStyle,
} from './PlaceholderMap.css.ts'

export type PlaceholderMapPin = {
  id: string
  label: string
  collected: boolean
}

export type PlaceholderMapProps = {
  pins: PlaceholderMapPin[]
  selectedId: string | null
  onSelect: (id: string) => void
}

const MAP_MARGIN = 9
const MIN_PIN_DISTANCE = 11
const MIN_ZOOM = 1
const MAX_ZOOM = 2.5
const ZOOM_STEP = 0.5
const PAN_RANGE_PER_ZOOM = 110

function hashString(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0
  }
  return hash
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function basePinPosition(placeId: string, salt: number) {
  return MAP_MARGIN + (hashString(`${placeId}-${salt}`) % (100 - MAP_MARGIN * 2))
}

/** 핀끼리 최소 거리를 확보하도록 해시 기반 좌표를 나선형으로 밀어내며 배치한다 */
function computePinPositions(placeIds: string[]) {
  const positions = new Map<string, { left: number; top: number }>()

  for (const id of placeIds) {
    let left = basePinPosition(id, 1)
    let top = basePinPosition(id, 2)
    let attempt = 0

    while (attempt < 60) {
      const overlaps = [...positions.values()].some(
        (pos) => Math.hypot(pos.left - left, pos.top - top) < MIN_PIN_DISTANCE,
      )
      if (!overlaps) break

      const angle = attempt * 2.399963
      const radius = 3 + attempt * 1.1
      left = clamp(basePinPosition(id, 1) + Math.cos(angle) * radius, MAP_MARGIN, 100 - MAP_MARGIN)
      top = clamp(basePinPosition(id, 2) + Math.sin(angle) * radius, MAP_MARGIN, 100 - MAP_MARGIN)
      attempt += 1
    }

    positions.set(id, { left, top })
  }

  return positions
}

/**
 * 실제 지도 SDK 연동 전까지 쓰는 자리표시 지도. 좌표 없이 id 해시로 핀을 배치하고,
 * 확대/축소·드래그 이동을 지원한다.
 */
export function PlaceholderMap({ pins, selectedId, onSelect }: PlaceholderMapProps) {
  const idsKey = pins.map((pin) => pin.id).join('|')
  const positions = useMemo(() => computePinPositions(idsKey.split('|')), [idsKey])

  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const dragRef = useRef<{ startX: number; startY: number; startPanX: number; startPanY: number } | null>(
    null,
  )

  const clampPan = (nextPan: { x: number; y: number }, zoomValue: number) => {
    const maxOffset = (zoomValue - 1) * PAN_RANGE_PER_ZOOM
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
    if (zoom <= MIN_ZOOM) return
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

  return (
    <div className={viewportStyle}>
      <div
        className={canvasStyle}
        style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {pins.map((pin) => {
          const pos = positions.get(pin.id)
          if (!pos) return null
          return (
            <button
              key={pin.id}
              type="button"
              aria-label={pin.label}
              className={pinButtonRecipe({ collected: pin.collected, focused: pin.id === selectedId })}
              style={{
                left: `${pos.left}%`,
                top: `${pos.top}%`,
                // 지도(캔버스)가 scale(zoom)되므로, 핀 자체는 화면상 크기가 그대로 보이게 반대로 축소한다
                transform: `translate(-50%, -50%) scale(${1 / zoom})`,
              }}
              onClick={() => onSelect(pin.id)}
            >
              <span className={pinDotRecipe({ collected: pin.collected })} aria-hidden />
            </button>
          )
        })}
      </div>

      <div className={zoomControlsStyle}>
        <button
          type="button"
          className={zoomButtonStyle}
          onClick={zoomIn}
          disabled={zoom >= MAX_ZOOM}
          aria-label="지도 확대"
        >
          <ZoomIn size={16} />
        </button>
        <button
          type="button"
          className={zoomButtonStyle}
          onClick={zoomOut}
          disabled={zoom <= MIN_ZOOM}
          aria-label="지도 축소"
        >
          <ZoomOut size={16} />
        </button>
      </div>
    </div>
  )
}
