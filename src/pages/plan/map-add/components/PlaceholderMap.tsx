import { ZoomIn, ZoomOut } from 'lucide-react'
import { useZoomPan } from '@/hooks/useZoomPan'
import { getPinPosition } from '@/utils/mapPinPositions'
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

/**
 * 실제 지도 SDK 연동 전까지 쓰는 자리표시 지도. 좌표 없이 id 해시로 핀을 배치하고,
 * 확대/축소·드래그 이동을 지원한다.
 */
export function PlaceholderMap({ pins, selectedId, onSelect }: PlaceholderMapProps) {
  const {
    zoom,
    pan,
    minZoom,
    maxZoom,
    zoomIn,
    zoomOut,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  } = useZoomPan()

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
          const pos = getPinPosition(pin.id)
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
          disabled={zoom >= maxZoom}
          aria-label="지도 확대"
        >
          <ZoomIn size={16} />
        </button>
        <button
          type="button"
          className={zoomButtonStyle}
          onClick={zoomOut}
          disabled={zoom <= minZoom}
          aria-label="지도 축소"
        >
          <ZoomOut size={16} />
        </button>
      </div>
    </div>
  )
}
