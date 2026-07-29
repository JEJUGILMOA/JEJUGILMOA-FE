import type { VisitedPlaceRecord } from '@/features/records/types'
import {
  mapAreaStyle,
  mapLabelStyle,
  pathLineStyle,
  pathSvgStyle,
  pinCircleStyle,
  pinLabelStyle,
  pinTextStyle,
  sectionTitleStyle,
} from './RoutePreview.css.ts'

const VIEW_WIDTH = 100
const VIEW_HEIGHT = 75
const MARGIN_X = 14
const ROW_TOP = 24
const ROW_BOTTOM = 52

function buildPoints(count: number) {
  if (count <= 1) return [{ x: VIEW_WIDTH / 2, y: (ROW_TOP + ROW_BOTTOM) / 2 }]

  const step = (VIEW_WIDTH - MARGIN_X * 2) / (count - 1)
  return Array.from({ length: count }, (_, index) => ({
    x: MARGIN_X + step * index,
    y: index % 2 === 0 ? ROW_TOP : ROW_BOTTOM,
  }))
}

export type RoutePreviewProps = {
  places: VisitedPlaceRecord[]
}

/**
 * STEP 08.11: 여행 경로. 실제 지도 SDK 연동 전까지의 자리표시자 시각화
 * (ExplorePathPreview와 동일한 접근으로, 방문 순서에 따라 좌표를 합성한다)
 */
export function RoutePreview({ places }: RoutePreviewProps) {
  if (places.length === 0) return null

  const points = buildPoints(places.length)
  const pathD = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x},${point.y}`)
    .join(' ')

  return (
    <section>
      <h2 className={sectionTitleStyle}>여행 경로</h2>
      <div className={mapAreaStyle}>
        <span className={mapLabelStyle}>지도 API 연동 영역 · Kakao Map</span>
        <svg
          className={pathSvgStyle}
          viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
          role="img"
          aria-label="방문 장소 경로"
        >
          {points.length > 1 ? <path className={pathLineStyle} d={pathD} /> : null}
          {points.map((point, index) => (
            <g key={places[index].placeId}>
              <circle className={pinCircleStyle} cx={point.x} cy={point.y} r={3.4} />
              <text className={pinTextStyle} x={point.x} y={point.y}>
                {index + 1}
              </text>
              <text
                className={pinLabelStyle}
                x={point.x}
                y={point.y + (point.y === ROW_TOP ? -6 : 8)}
              >
                {places[index].placeName}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </section>
  )
}
