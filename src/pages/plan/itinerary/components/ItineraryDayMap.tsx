import { ZoomIn, ZoomOut } from 'lucide-react'
import { useZoomPan } from '@/hooks/useZoomPan'
import { getPinPosition } from '@/utils/mapPinPositions'
import { colors } from '@/styles/colors.css.ts'
import {
  canvasStyle,
  emptyStateStyle,
  routeSvgStyle,
  stopPinRecipe,
  unassignedPinStyle,
  viewportStyle,
  zoomButtonStyle,
  zoomControlsStyle,
} from './ItineraryDayMap.css.ts'

export type ItineraryDayMapProps = {
  /** 현재 Day에 배정된 장소 (방문 순서대로) */
  stops: { id: string; title: string }[]
  /** 아직 어느 Day에도 배정되지 않은 장소 id */
  unassignedPlaceIds: string[]
}

/** STEP 05 Day별 지도: 번호 핀 + 점선 동선 + 미배정 장소 회색 핀 */
export function ItineraryDayMap({ stops, unassignedPlaceIds }: ItineraryDayMapProps) {
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

  const routePoints = stops.map((stop) => getPinPosition(stop.id))

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
        {stops.length === 0 && unassignedPlaceIds.length === 0 ? (
          <span className={emptyStateStyle}>이 Day에 배정된 장소가 없어요</span>
        ) : null}

        {routePoints.length > 1 ? (
          <svg className={routeSvgStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <polyline
              points={routePoints.map((point) => `${point.left},${point.top}`).join(' ')}
              fill="none"
              stroke={colors.primary[500]}
              strokeWidth={0.6}
              strokeDasharray="2.2 1.8"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ) : null}

        {unassignedPlaceIds.map((placeId) => {
          const pos = getPinPosition(placeId)
          return (
            <span
              key={placeId}
              className={unassignedPinStyle}
              style={{
                left: `${pos.left}%`,
                top: `${pos.top}%`,
                transform: `translate(-50%, -50%) scale(${1 / zoom})`,
              }}
              aria-hidden
            />
          )
        })}

        {stops.map((stop, index) => {
          const pos = getPinPosition(stop.id)
          return (
            <span
              key={stop.id}
              className={stopPinRecipe()}
              style={{
                left: `${pos.left}%`,
                top: `${pos.top}%`,
                transform: `translate(-50%, -50%) scale(${1 / zoom})`,
              }}
              aria-label={stop.title}
            >
              {index + 1}
            </span>
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
