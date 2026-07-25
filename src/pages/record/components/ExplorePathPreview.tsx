import type { ExploreRecord } from '@/features/records/types'
import { cardStyle, mapAreaStyle, pathDotStyle, pathLineStyle, titleStyle } from './ExplorePathPreview.css.ts'

const VIEW_WIDTH = 100
const VIEW_HEIGHT = 56

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
  const pathD = points.map((point) => `${point.x},${point.y}`).join(' ')

  return (
    <div className={cardStyle}>
      <h3 className={titleStyle}>{record.title}</h3>
      <svg
        className={mapAreaStyle}
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        role="img"
        aria-label={`${record.title} 방문 경로`}
      >
        <polyline className={pathLineStyle} points={pathD} />
        {points.map((point, index) => (
          <circle
            key={`${record.id}-${index}`}
            className={pathDotStyle}
            cx={point.x}
            cy={point.y}
            r={2}
          />
        ))}
      </svg>
    </div>
  )
}
