import { Image, Star } from 'lucide-react'
import type { VisitedPlaceRecord } from '@/features/records/types'
import {
  addressStyle,
  listStyle,
  metaRowStyle,
  metaTextStyle,
  noteStyle,
  placeNameStyle,
  ratingIconStyle,
  ratingStyle,
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
              {place.address ? <p className={addressStyle}>{place.address}</p> : null}
              {place.rating !== null || place.stayMinutes !== null ? (
                <div className={metaRowStyle}>
                  {place.rating !== null ? (
                    <span className={ratingStyle}>
                      <Star size={12} className={ratingIconStyle} fill="currentColor" strokeWidth={0} />
                      {place.rating.toFixed(1)}
                    </span>
                  ) : null}
                  {place.stayMinutes !== null ? (
                    <span className={metaTextStyle}>{place.stayMinutes}분 머묾</span>
                  ) : null}
                </div>
              ) : null}
              {place.note ? <p className={noteStyle}>{place.note}</p> : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
