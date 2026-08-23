import { Flag } from 'lucide-react'
import { useState } from 'react'
import { Chip } from '@/components/ui/Chip/Chip'
import { getPinPosition } from '@/utils/mapPinPositions'
import { colors } from '@/styles/colors.css.ts'
import {
  dayTabRowStyle,
  emptyStateStyle,
  mapBoxStyle,
  routeSvgStyle,
  stopPinRecipe,
} from './PlanRouteMap.css.ts'

export type PlanRouteMapProps = {
  /** Day별로 배정된 장소 목록 (방문 순서대로). isDeparture는 그 Day의 출발지를 뜻한다. */
  days: { day: number; places: { id: string; title: string; isDeparture?: boolean }[] }[]
}

/** "전체" 탭에서 Day를 구분하는 핀 색상 팔레트 — Day 수가 넘으면 처음부터 반복 */
const DAY_PIN_COLORS = [colors.primary[500], colors.secondary[500], colors.warning[500], colors.error[100]]
/** 출발지는 어느 Day든 항상 중립 회색으로 고정 */
const DEPARTURE_PIN_COLOR = colors.text[3]

/** 출발지는 번호를 매기지 않고 깃발 아이콘으로 표시하고, 나머지 장소만 Day마다 1부터 번호를 매긴다. */
function numberDayPlaces(places: { id: string; title: string; isDeparture?: boolean }[]) {
  let count = 0
  return places.map((place) => {
    if (place.isDeparture) return { ...place, number: undefined }
    count += 1
    return { ...place, number: count }
  })
}

/** STEP 08 계획 미리보기: 전체/Day별로 전환해서 볼 수 있는 정적 경로 미니맵 (확대/축소 없음) */
export function PlanRouteMap({ days }: PlanRouteMapProps) {
  const [selectedDay, setSelectedDay] = useState<number | 'all'>('all')

  const dayColor = (dayIndex: number) => DAY_PIN_COLORS[dayIndex % DAY_PIN_COLORS.length]

  const stops: { key: string; id: string; title: string; color?: string; number?: number; isDeparture?: boolean }[] =
    selectedDay === 'all'
      ? days.flatMap((entry, dayIndex) =>
          numberDayPlaces(entry.places).map((place) => ({
            ...place,
            key: `${entry.day}-${place.id}`,
            color: place.isDeparture ? DEPARTURE_PIN_COLOR : dayColor(dayIndex),
          })),
        )
      : (() => {
          const dayIndex = days.findIndex((entry) => entry.day === selectedDay)
          const entry = days[dayIndex]
          return entry
            ? numberDayPlaces(entry.places).map((place) => ({
                ...place,
                key: `${entry.day}-${place.id}`,
                color: place.isDeparture ? DEPARTURE_PIN_COLOR : dayColor(dayIndex),
              }))
            : []
        })()

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

        {stops.map((stop) => {
          const pos = getPinPosition(stop.id)
          return (
            <span
              key={stop.key}
              className={stopPinRecipe()}
              style={{
                left: `${pos.left}%`,
                top: `${pos.top}%`,
                ...(stop.color ? { backgroundColor: stop.color } : {}),
              }}
              aria-label={stop.isDeparture ? `출발지: ${stop.title}` : stop.title}
            >
              {stop.isDeparture ? <Flag size={12} /> : stop.number}
            </span>
          )
        })}
      </div>
    </div>
  )
}
