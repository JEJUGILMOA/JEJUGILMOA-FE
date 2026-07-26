import type { ExploreRecord } from '@/features/records/types'
import {
  cardStyle,
  endpointDotStyle,
  endpointHaloStyle,
  mapAreaStyle,
  pathLineStyle,
  titleStyle,
  waypointDotStyle,
} from './ExplorePathPreview.css.ts'

const VIEW_WIDTH = 100
const VIEW_HEIGHT = 56

type Point = { x: number; y: number }

/** Catmull-Rom 제어점을 3차 베지어로 변환해 경로를 부드러운 곡선으로 그린다. */
function buildSmoothPathD(points: Point[]) {
  if (points.length < 2) return ''

  let d = `M ${points[0].x},${points[0].y}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? p2
    const c1x = p1.x + (p2.x - p0.x) / 6
    const c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6
    const c2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${c1x},${c1y} ${c2x},${c2y} ${p2.x},${p2.y}`
  }
  return d
}

export type ExplorePathPreviewProps = {
  record: ExploreRecord
}

/**
 * STEP 06 지도형: 기록의 방문 경로를 점선으로 스케치한 미리보기.
 * 실제 지도 SDK 연동 전까지의 자리표시자 시각화.
 */
export function ExplorePathPreview({ record }: ExplorePathPreviewProps) {
  const points = record.path.map((point) => ({
    x: point.x * VIEW_WIDTH,
    y: point.y * VIEW_HEIGHT,
  }))
  const lastIndex = points.length - 1

  return (
    <div className={cardStyle}>
      <h3 className={titleStyle}>{record.title}</h3>
      <svg
        className={mapAreaStyle}
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        role="img"
        aria-label={`${record.title} 방문 경로`}
      >
        <path className={pathLineStyle} d={buildSmoothPathD(points)} />
        {points.map((point, index) => {
          if (index === 0 || index === lastIndex) return null
          return (
            <circle
              key={`${record.id}-${index}`}
              className={waypointDotStyle}
              cx={point.x}
              cy={point.y}
              r={1.8}
            />
          )
        })}
        {points[0] ? (
          <circle className={waypointDotStyle} cx={points[0].x} cy={points[0].y} r={2.6} />
        ) : null}
        {lastIndex > 0 ? (
          <>
            <circle
              className={endpointHaloStyle}
              cx={points[lastIndex].x}
              cy={points[lastIndex].y}
              r={6}
            />
            <circle
              className={endpointDotStyle}
              cx={points[lastIndex].x}
              cy={points[lastIndex].y}
              r={3.2}
            />
          </>
        ) : null}
      </svg>
    </div>
  )
}
