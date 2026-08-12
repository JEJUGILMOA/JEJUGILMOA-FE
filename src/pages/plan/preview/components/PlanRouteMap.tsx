import { useState } from 'react'
import { Chip } from '@/components/ui/Chip/Chip'
import { GATEWAY_ARRIVAL_ID, GATEWAY_DEPARTURE_ID, getPinPosition } from '@/utils/mapPinPositions'
import { colors } from '@/styles/colors.css.ts'
import {
  dayTabRowStyle,
  emptyStateStyle,
  mapBoxStyle,
  routeSvgStyle,
  stopPinRecipe,
} from './PlanRouteMap.css.ts'

export type PlanRouteMapProps = {
  /** Day별로 배정된 장소 목록 (방문 순서대로) */
  days: { day: number; places: { id: string; title: string }[] }[]
  /** 배/비행기 도착·출발 지점 라벨 (예: "제주국제공항") */
  gatewayLabel: string
}

/** STEP 08 계획 미리보기: 전체/Day별로 전환해서 볼 수 있는 정적 경로 미니맵 (확대/축소 없음) */
export function PlanRouteMap({ days, gatewayLabel }: PlanRouteMapProps) {
  const [selectedDay, setSelectedDay] = useState<number | 'all'>('all')

  const firstDay = days[0]?.day
  const lastDay = days[days.length - 1]?.day
  const arrivalStop = { id: GATEWAY_ARRIVAL_ID, title: `${gatewayLabel} 도착` }
  const departureStop = { id: GATEWAY_DEPARTURE_ID, title: `${gatewayLabel} 출발` }

  const stops =
    selectedDay === 'all'
      ? [arrivalStop, ...days.flatMap((entry) => entry.places), departureStop]
      : [
          ...(selectedDay === firstDay ? [arrivalStop] : []),
          ...(days.find((entry) => entry.day === selectedDay)?.places ?? []),
          ...(selectedDay === lastDay ? [departureStop] : []),
        ]

  const routePoints = stops.map((stop) => getPinPosition(stop.id))

  return (
    <div>
      <div className={dayTabRowStyle} role="tablist" aria-label="지도에 표시할 일정 범위">
        <Chip
          size="sm"
          colorScheme="primary"
          isSelected={selectedDay === 'all'}
          onClick={() => setSelectedDay('all')}
        >
          전체
        </Chip>
        {days.map(({ day }) => (
          <Chip
            key={day}
            size="sm"
            colorScheme="primary"
            isSelected={selectedDay === day}
            onClick={() => setSelectedDay(day)}
          >
            Day {day}
          </Chip>
        ))}
      </div>

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
    </div>
  )
}
