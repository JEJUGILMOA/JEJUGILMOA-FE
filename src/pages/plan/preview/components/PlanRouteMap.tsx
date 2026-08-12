import { getPinPosition } from '@/utils/mapPinPositions'
import { colors } from '@/styles/colors.css.ts'
import { emptyStateStyle, mapBoxStyle, routeSvgStyle, stopPinRecipe } from './PlanRouteMap.css.ts'

export type PlanRouteMapProps = {
  /** 전체 일정에 배정된 장소를 방문 순서대로 나열 (Day 경계 없이 이어서 표시) */
  stops: { id: string; title: string }[]
}

/** STEP 08 계획 미리보기: 전체 일정 경로를 정적으로 보여주는 미니맵 (확대/축소 없음) */
export function PlanRouteMap({ stops }: PlanRouteMapProps) {
  const routePoints = stops.map((stop) => getPinPosition(stop.id))

  return (
    <div className={mapBoxStyle}>
      {stops.length === 0 ? (
        <span className={emptyStateStyle}>아직 배정된 장소가 없어요</span>
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

      {stops.map((stop, index) => {
        const pos = getPinPosition(stop.id)
        return (
          <span
            key={stop.id}
            className={stopPinRecipe()}
            style={{ left: `${pos.left}%`, top: `${pos.top}%` }}
            aria-label={stop.title}
          >
            {index + 1}
          </span>
        )
      })}
    </div>
  )
}
