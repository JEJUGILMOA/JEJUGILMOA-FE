import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { nativeBridge } from '@/bridge/nativeBridge'
import { PlaceCard } from '@/components/ui/PlaceCard/PlaceCard'
import type { VisitedPlaceRecord } from '@/features/records/types'
import { VisitedPlaceSheet } from './VisitedPlaceSheet'
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

function hasPlaceSheetContent(place: VisitedPlaceRecord) {
  return place.photoUrls.length > 0 || Boolean(place.note.trim())
}

/** STEP 08.10: 방문 장소 카드 — 네이티브면 네이티브 시트, 아니면 웹 바텀시트 */
export function VisitedPlaceList({ places }: VisitedPlaceListProps) {
  const [openPlaceId, setOpenPlaceId] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(false)
  const openPlace = places.find((place) => place.placeId === openPlaceId) ?? null
  const isNative = nativeBridge.isNativeWebView()

  if (places.length === 0) return null

  const hasMore = places.length > PREVIEW_COUNT
  const visiblePlaces = expanded ? places : places.slice(0, PREVIEW_COUNT)

  const openPlaceDetail = (place: VisitedPlaceRecord) => {
    if (!hasPlaceSheetContent(place)) return

    if (isNative) {
      nativeBridge.postToNative({
        type: 'OPEN_VISITED_PLACE_SHEET',
        place: {
          placeId: place.placeId,
          placeName: place.placeName,
          address: place.address,
          visitDate: place.visitDate,
          note: place.note,
          photoUrls: place.photoUrls,
        },
      })
      return
    }
    setOpenPlaceId(place.placeId)
  }

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
            caption={place.note || undefined}
            rating={place.rating ?? undefined}
            onClick={hasPlaceSheetContent(place) ? () => openPlaceDetail(place) : undefined}
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

      {!isNative && openPlace ? (
        <VisitedPlaceSheet
          place={openPlace}
          open
          onOpenChange={(nextOpen) => {
            if (!nextOpen) setOpenPlaceId(null)
          }}
        />
      ) : null}
    </section>
  )
}
