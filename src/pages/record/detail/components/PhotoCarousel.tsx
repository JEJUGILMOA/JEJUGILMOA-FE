import { Bookmark, ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { nativeBridge } from '@/bridge/nativeBridge'
import { ImagePlaceholder, SafeImage } from '@/components/ui/ImagePlaceholder/ImagePlaceholder'
import { Popover } from '@/components/ui/Popover/Popover'
import { cn } from '@/utils/cn'
import { PlacePhotoModal } from './PlacePhotoModal'
import { useDragCarousel } from './useDragCarousel'
import {
  bookmarkActiveStyle,
  counterStyle,
  menuItemDangerStyle,
  menuItemStyle,
  menuListStyle,
  navButtonNextStyle,
  navButtonPrevStyle,
  overlayActionsStyle,
  overlayButtonStyle,
  placeholderStyle,
  slideImageStyle,
  trackStyle,
  wrapStyle,
} from './PhotoCarousel.css.ts'

export type PhotoCarouselProps = {
  photoUrls: string[]
  /** 사진 전체보기 팝업의 aria-label에 쓰는 제목 */
  title: string
  isBookmarked?: boolean
  /** 없으면 즐겨찾기 버튼을 숨긴다 (본인 기록 등) */
  onToggleBookmark?: () => void
  /** 즐겨찾기 옆에 붙는 추가 액션 (지도 버튼 등) */
  extraActions?: ReactNode
  /** 타인의 기록일 때 신고/차단 메뉴 표시 */
  moderation?: {
    authorName: string
    onReport: () => void
    onBlockAuthor: () => void
  }
}

function openPhotoViewer(photoUrls: string[], initialIndex: number) {
  if (nativeBridge.isNativeWebView()) {
    nativeBridge.postToNative({
      type: 'OPEN_NATIVE_PHOTO_VIEWER',
      photoUrls,
      initialIndex,
    })
    return true
  }
  return false
}

/** 대표 사진 캐러셀 + 우측 상단 액션. 드래그로 사진을 넘기고, 탭하면 전체화면으로 본다 */
export function PhotoCarousel({
  photoUrls,
  title,
  isBookmarked = false,
  onToggleBookmark,
  extraActions,
  moderation,
}: PhotoCarouselProps) {
  const [index, setIndex] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [viewerOpen, setViewerOpen] = useState(false)
  const total = photoUrls.length
  const { dragOffset, isDragging, trackHandlers } = useDragCarousel({
    total,
    index,
    onIndexChange: setIndex,
    onTap: () => {
      if (total === 0) return
      if (openPhotoViewer(photoUrls, index)) return
      setViewerOpen(true)
    },
  })

  return (
    <div className={wrapStyle}>
      {total > 0 ? (
        <div
          className={trackStyle}
          style={{
            transform: `translateX(calc(${-index * 100}% + ${dragOffset}px))`,
            transition: isDragging ? 'none' : undefined,
          }}
          onContextMenu={(event) => event.preventDefault()}
          {...trackHandlers}
        >
          {photoUrls.map((url, i) => (
            <SafeImage
              key={`${url}-${i}`}
              src={url}
              className={slideImageStyle}
              placeholderSize="lg"
              draggable={false}
            />
          ))}
        </div>
      ) : (
        <div className={placeholderStyle}>
          <ImagePlaceholder size="lg" />
        </div>
      )}

      <div className={overlayActionsStyle}>
        {onToggleBookmark ? (
          <button
            type="button"
            className={cn(overlayButtonStyle, isBookmarked && bookmarkActiveStyle)}
            aria-label={isBookmarked ? '즐겨찾기 해제' : '즐겨찾기 추가'}
            aria-pressed={isBookmarked}
            onClick={onToggleBookmark}
          >
            <Bookmark size={16} strokeWidth={1.75} fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
        ) : null}

        {extraActions}

        {moderation ? (
          <Popover
            open={menuOpen}
            onOpenChange={setMenuOpen}
            align="end"
            ariaLabel="기록 더보기 메뉴"
            trigger={
              <button
                type="button"
                className={overlayButtonStyle}
                aria-label="더보기"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((prev) => !prev)}
              >
                <MoreVertical size={16} aria-hidden />
              </button>
            }
          >
            <div className={menuListStyle}>
              <button
                type="button"
                role="menuitem"
                className={menuItemStyle}
                onClick={() => {
                  setMenuOpen(false)
                  moderation.onReport()
                }}
              >
                신고하기
              </button>
              <button
                type="button"
                role="menuitem"
                className={menuItemDangerStyle}
                onClick={() => {
                  setMenuOpen(false)
                  moderation.onBlockAuthor()
                }}
              >
                작성자 차단하기
              </button>
            </div>
          </Popover>
        ) : null}
      </div>

      {total > 0 ? (
        <span className={counterStyle}>
          {index + 1} / {total}
        </span>
      ) : null}

      {index > 0 ? (
        <button
          type="button"
          className={navButtonPrevStyle}
          aria-label="이전 사진"
          onClick={() => setIndex((prev) => prev - 1)}
        >
          <ChevronLeft size={18} aria-hidden />
        </button>
      ) : null}

      {index < total - 1 ? (
        <button
          type="button"
          className={navButtonNextStyle}
          aria-label="다음 사진"
          onClick={() => setIndex((prev) => prev + 1)}
        >
          <ChevronRight size={18} aria-hidden />
        </button>
      ) : null}

      {viewerOpen ? (
        <PlacePhotoModal
          photoUrls={photoUrls}
          placeName={title}
          initialIndex={index}
          onClose={() => setViewerOpen(false)}
        />
      ) : null}
    </div>
  )
}
