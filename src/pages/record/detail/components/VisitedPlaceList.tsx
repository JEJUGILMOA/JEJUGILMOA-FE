import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { PlaceCard } from '@/components/ui/PlaceCard/PlaceCard'
import type { VisitedPlaceRecord } from '@/features/records/types'
import { PlacePhotoModal } from './PlacePhotoModal'
import {
  collapseButtonStyle,
  countStyle,
  gridStyle,
  headerRowStyle,
  sectionTitleStyle,
} from './VisitedPlaceList.css.ts'

export type VisitedPlaceListProps = {
  places: VisitedPlaceRecord[]
}

/** 접었을 때 보여주는 카드 개수. 넘치면 "전체보기"로 나머지를 같은 자리에서 펼친다 */
const PREVIEW_COUNT = 4

/** STEP 08.10: 방문 장소 카드 그리드 (사진 클릭 시 그 장소의 사진 전체를 팝업으로 본다) */
export function VisitedPlaceList({ places }: VisitedPlaceListProps) {
  const [openPlaceId, setOpenPlaceId] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(false)
  const openPlace = places.find((place) => place.placeId === openPlaceId) ?? null

  if (places.length === 0) return null

  const hasMore = places.length > PREVIEW_COUNT
  const visiblePlaces = expanded ? places : places.slice(0, PREVIEW_COUNT)

  return (
    <section>
      <div className={headerRowStyle}>
        <h2 className={sectionTitleStyle}>
          방문 장소 <span className={countStyle}>{places.length}</span>
        </h2>
      </div>

      <div className={gridStyle}>
        {visiblePlaces.map((place) => (
          <PlaceCard
            key={place.placeId}
            title={place.placeName}
            imageUrl={place.photoUrls[0]}
            meta={place.address || undefined}
            rating={place.rating ?? undefined}
            onClick={() => setOpenPlaceId(place.placeId)}
          />
        ))}
      </div>

      {hasMore ? (
        <button
          type="button"
          className={collapseButtonStyle}
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? (
            <>
              접기 <ChevronUp size={14} aria-hidden />
            </>
          ) : (
            <>
              전체보기 <ChevronDown size={14} aria-hidden />
            </>
          )}
        </button>
      ) : null}

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
