import { Image } from 'lucide-react'
import type { VisitedPlaceRecord } from '@/features/records/types'
import {
  listStyle,
  noteStyle,
  placeNameStyle,
  rowStyle,
  sectionTitleStyle,
  thumbnailImageStyle,
  thumbnailStyle,
} from './VisitedPlaceList.css.ts'

export type VisitedPlaceListProps = {
  places: VisitedPlaceRecord[]
}

/** STEP 08.10: 방문 장소별 메모 (사진 + 글) */
export function VisitedPlaceList({ places }: VisitedPlaceListProps) {
  if (places.length === 0) return null

  return (
    <section>
      <h2 className={sectionTitleStyle}>방문 장소</h2>
      <div className={listStyle}>
        {places.map((place) => (
          <div key={place.placeId} className={rowStyle}>
            <div className={thumbnailStyle}>
              {place.photoUrls[0] ? (
                <img className={thumbnailImageStyle} src={place.photoUrls[0]} alt="" />
              ) : (
                <Image size={20} aria-hidden />
              )}
            </div>
            <div>
              <p className={placeNameStyle}>{place.placeName}</p>
              {place.note ? <p className={noteStyle}>{place.note}</p> : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
