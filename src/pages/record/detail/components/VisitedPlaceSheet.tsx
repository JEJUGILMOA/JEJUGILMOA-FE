import { useState } from 'react'
import { MapPin } from 'lucide-react'
import { BottomSheet } from '@/components/ui/BottomSheet/BottomSheet'
import { ImagePlaceholder, SafeImage } from '@/components/ui/ImagePlaceholder/ImagePlaceholder'
import type { VisitedPlaceRecord } from '@/features/records/types'
import { PlacePhotoModal } from './PlacePhotoModal'
import {
  addressIconStyle,
  addressRowStyle,
  contentStyle,
  dateStyle,
  dividerStyle,
  memoLabelStyle,
  memoSectionStyle,
  memoTextStyle,
  photoButtonStyle,
  photoEmptyStyle,
  photoImageStyle,
  photoRowStyle,
  placeNameStyle,
  sheetBodyStyle,
} from './VisitedPlaceSheet.css.ts'

export type VisitedPlaceSheetProps = {
  place: VisitedPlaceRecord
  open: boolean
  onOpenChange: (open: boolean) => void
}

function formatVisitDate(visitDate: string) {
  return visitDate.replaceAll('-', '.')
}

/** 방문 장소 상세 바텀시트. 사진 탭 시 전체화면 캐러셀을 연다 */
export function VisitedPlaceSheet({ place, open, onOpenChange }: VisitedPlaceSheetProps) {
  const [viewerIndex, setViewerIndex] = useState<number | null>(null)
  const hasPhotos = place.photoUrls.length > 0
  const hasNote = Boolean(place.note.trim())

  return (
    <>
      <BottomSheet
        open={open}
        onOpenChange={onOpenChange}
        initialHeight={0.72}
        minHeight={0.5}
        maxHeight={0.92}
      >
        <div className={sheetBodyStyle}>
          {hasPhotos ? (
            <div className={photoRowStyle}>
              {place.photoUrls.map((url, index) => (
                <button
                  key={`${url}-${index}`}
                  type="button"
                  className={photoButtonStyle}
                  aria-label={`${place.placeName} 사진 ${index + 1} 크게 보기`}
                  onClick={() => setViewerIndex(index)}
                >
                  <SafeImage
                    src={url}
                    className={photoImageStyle}
                    placeholderSize="md"
                    draggable={false}
                  />
                </button>
              ))}
            </div>
          ) : (
            <div className={photoEmptyStyle}>
              <ImagePlaceholder size="md" />
            </div>
          )}

          <div className={contentStyle}>
            <h2 className={placeNameStyle}>{place.placeName}</h2>
            {place.visitDate ? <p className={dateStyle}>{formatVisitDate(place.visitDate)}</p> : null}
            {place.address ? (
              <p className={addressRowStyle}>
                <MapPin size={16} strokeWidth={2} className={addressIconStyle} aria-hidden />
                <span>{place.address}</span>
              </p>
            ) : null}

            {hasNote ? (
              <>
                <hr className={dividerStyle} />
                <section className={memoSectionStyle} aria-label="메모">
                  <p className={memoLabelStyle}>메모</p>
                  <p className={memoTextStyle}>{place.note}</p>
                </section>
              </>
            ) : null}
          </div>
        </div>
      </BottomSheet>

      {viewerIndex != null && hasPhotos ? (
        <PlacePhotoModal
          photoUrls={place.photoUrls}
          placeName={place.placeName}
          initialIndex={viewerIndex}
          onClose={() => setViewerIndex(null)}
        />
      ) : null}
    </>
  )
}
