import type { VisitedPlaceRecord } from '@/features/records/types'
import { ExploreRecordMiniMap } from '@/pages/record/components/ExploreRecordMiniMap'
import { mapAreaStyle, sectionTitleStyle } from './RoutePreview.css.ts'

export type RoutePreviewProps = {
  places: VisitedPlaceRecord[]
  /** 접근성 라벨용 기록 제목 */
  title?: string
}

/** 방문 장소 좌표를 Leaflet 미니맵으로 표시 */
export function RoutePreview({ places, title = '여행 기록' }: RoutePreviewProps) {
  if (places.length === 0) return null

  return (
    <section>
      <h2 className={sectionTitleStyle}>여행 경로</h2>
      <div className={mapAreaStyle}>
        <ExploreRecordMiniMap
          title={title}
          places={places.map((place) => ({
            id: place.placeId,
            latitude: place.latitude,
            longitude: place.longitude,
          }))}
        />
      </div>
    </section>
  )
}
