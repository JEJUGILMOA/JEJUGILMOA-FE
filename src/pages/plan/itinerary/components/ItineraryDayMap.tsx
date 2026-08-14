import { Flag, ZoomIn, ZoomOut } from 'lucide-react'
import { useZoomPan } from '@/hooks/useZoomPan'
import { getPinPosition } from '@/utils/mapPinPositions'
import { colors } from '@/styles/colors.css.ts'
import {
  canvasStyle,
  departurePinStyle,
  emptyStateStyle,
  routeSvgStyle,
  stopPinRecipe,
  unassignedPinRecipe,
  viewportStyle,
  zoomButtonStyle,
  zoomControlsStyle,
} from './ItineraryDayMap.css.ts'

export type ItineraryDayMapProps = {
  /** 이 Day의 출발지 (검색으로 고른 곳, 없으면 null) */
  departurePlace: { id: string; title: string } | null
  /** 현재 Day에 배정된 장소 (방문 순서대로) */
  stops: { id: string; title: string }[]
  /** 아직 어느 Day에도 배정되지 않은 장소 */
  unassignedPlaces: { id: string; title: string }[]
  /** 미배정 장소 핀 색상 — 지금 추천 기준(유명한/가까운 장소)에 맞춰 지도에서도 구분해 보여준다 */
  unassignedPinKind?: 'popular' | 'nearby'
  /** 미배정 장소 핀을 클릭했을 때 현재 Day에 담는다 */
  onAssignPlace: (id: string) => void
}

/** STEP 05 Day별 지도: 출발지 깃발 핀 + 번호 핀 + 점선 동선 + 미배정 장소 추천 핀(클릭 시 담기) */
export function ItineraryDayMap({
  departurePlace,
  stops,
  unassignedPlaces,
  unassignedPinKind = 'popular',
  onAssignPlace,
}: ItineraryDayMapProps) {
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

  // 동선(점선)이 출발지에서부터 시작하도록, 있으면 맨 앞에 끼워 넣는다.
  const routePoints = [
    ...(departurePlace ? [getPinPosition(departurePlace.id)] : []),
    ...stops.map((stop) => getPinPosition(stop.id)),
  ]

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
        {!departurePlace && stops.length === 0 && unassignedPlaces.length === 0 ? (
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

        {unassignedPlaces.map((place) => {
          const pos = getPinPosition(place.id)
          return (
            <button
              key={place.id}
              type="button"
              className={unassignedPinRecipe({ kind: unassignedPinKind })}
              style={{
                left: `${pos.left}%`,
                top: `${pos.top}%`,
                transform: `translate(-50%, -50%) scale(${1 / zoom})`,
              }}
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => onAssignPlace(place.id)}
              aria-label={`${place.title} 이 Day에 담기`}
            />
          )
        })}

        {departurePlace ? (
          <span
            className={departurePinStyle}
            style={{
              left: `${getPinPosition(departurePlace.id).left}%`,
              top: `${getPinPosition(departurePlace.id).top}%`,
              transform: `translate(-50%, -50%) scale(${1 / zoom})`,
            }}
            aria-label={`출발지: ${departurePlace.title}`}
          >
            <Flag size={12} fill="currentColor" />
          </span>
        ) : null}

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
