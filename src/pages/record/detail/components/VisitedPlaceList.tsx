import { useState } from 'react'
import { Image, Star } from 'lucide-react'
import type { VisitedPlaceRecord } from '@/features/records/types'
import { PlacePhotoModal } from './PlacePhotoModal'
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
  thumbnailButtonStyle,
  thumbnailImageStyle,
  thumbnailStyle,
} from './VisitedPlaceList.css.ts'

export type VisitedPlaceListProps = {
  places: VisitedPlaceRecord[]
}

/** STEP 08.10: 방문 장소별 메모 (사진 + 글). 사진 클릭 시 그 장소의 사진 전체를 팝업으로 본다 */
export function VisitedPlaceList({ places }: VisitedPlaceListProps) {
  const [openPlaceId, setOpenPlaceId] = useState<string | null>(null)
  const openPlace = places.find((place) => place.placeId === openPlaceId) ?? null

  if (places.length === 0) return null

  return (
    <section>
      <h2 className={sectionTitleStyle}>방문 장소</h2>
      <div className={listStyle}>
        {places.map((place) => (
          <div key={place.placeId} className={rowStyle}>
            {place.photoUrls[0] ? (
              <button
                type="button"
                className={thumbnailButtonStyle}
                aria-label={`${place.placeName} 사진 보기`}
                onClick={() => setOpenPlaceId(place.placeId)}
              >
                <img className={thumbnailImageStyle} src={place.photoUrls[0]} alt="" />
              </button>
            ) : (
              <div className={thumbnailStyle}>
                <Image size={20} aria-hidden />
              </div>
            )}
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

      {openPlace ? (
        <PlacePhotoModal
          photoUrls={openPlace.photoUrls}
          placeName={openPlace.placeName}
          onClose={() => setOpenPlaceId(null)}
        />
      ) : null}
    </section>
  )
}
