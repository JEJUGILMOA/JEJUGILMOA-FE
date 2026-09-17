import { Bookmark, ChevronRight, MoreVertical, ThumbsDown, ThumbsUp } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/Button/Button'
import { SafeImage } from '@/components/ui/ImagePlaceholder/ImagePlaceholder'
import { Popover } from '@/components/ui/Popover/Popover'
import { toast } from '@/components/ui/Toast/Toast'
import { ROUTES } from '@/constants'
import { requireLogin } from '@/features/auth/requireLogin'
import {
  useReactToExploreRecordMutation,
  useToggleExploreRecordBookmarkMutation,
} from '@/features/records/hooks'
import type { ExploreRecord } from '@/features/records/types'
import { useBlockUserMutation } from '@/features/users/hooks'
import { ExploreRecordMiniMap } from './ExploreRecordMiniMap'
import { ReportRecordModal } from './ReportRecordModal'
import {
  authorNameStyle,
  authorRowStyle,
  avatarImageStyle,
  avatarStyle,
  bodyStyle,
  cardStyle,
  linkedPlanButtonStyle,
  menuItemDangerStyle,
  menuItemStyle,
  menuListStyle,
  overlayActionsStyle,
  overlayButtonStyle,
  reactionButtonRecipe,
  reactionRowStyle,
  summaryStyle,
  thumbnailImageStyle,
  thumbnailWrapStyle,
  titleStyle,
} from './ExploreRecordCard.css.ts'

export type ExploreRecordCardMedia = 'photos' | 'map'

export type ExploreRecordCardProps = {
  record: ExploreRecord
  /** 카드형 사진 썸네일 / 지도형 Leaflet 미니맵 */
  media?: ExploreRecordCardMedia
  /** true면 본인 기록 — 서버가 본인 기록엔 반응을 허용하지 않아 클릭 시 안내만 띄운다 */
  isOwn?: boolean
}

/** STEP 06: 둘러보기 카드형의 카드 한 장 (STEP 07: 좋아요·싫어요 반응 포함). 클릭하면 STEP 08 상세보기로 이동한다 */
export function ExploreRecordCard({ record, media = 'photos', isOwn = false }: ExploreRecordCardProps) {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const reactMutation = useReactToExploreRecordMutation()
  const bookmarkMutation = useToggleExploreRecordBookmarkMutation()
  const blockUserMutation = useBlockUserMutation()

  const handleReact = (reaction: 'like' | 'dislike') => {
    if (isOwn) {
      toast.error(reaction === 'like' ? '내 기록엔 좋아요를 누를 수 없어요' : '내 기록엔 싫어요를 누를 수 없어요')
      return
    }
    if (
      !requireLogin({
        returnTo: ROUTES.recordTab('search'),
        description: '좋아요·싫어요는 로그인 후 이용할 수 있어요.',
      })
    ) {
      return
    }
    reactMutation.mutate({ id: record.id, reaction, currentReaction: record.myReaction })
  }

  const goToDetail = () =>
    navigate(ROUTES.recordDetail(record.id), { state: { fromTab: 'search' } })

  const handleToggleBookmark = () => {
    if (
      !requireLogin({
        returnTo: ROUTES.recordTab('search'),
        description: '즐겨찾기는 로그인 후 이용할 수 있어요.',
      })
    ) {
      return
    }
    bookmarkMutation.mutate({
      id: record.id,
      nextFavorite: !record.isBookmarked,
    })
  }

  const handleReport = () => {
    if (
      !requireLogin({
        returnTo: ROUTES.recordTab('search'),
        description: '신고하려면 로그인해 주세요.',
      })
    ) {
      return
    }
    setMenuOpen(false)
    setReportOpen(true)
  }

  const handleBlockAuthor = () => {
    if (
      !requireLogin({
        returnTo: ROUTES.recordTab('search'),
        description: '사용자를 차단하려면 로그인해 주세요.',
      })
    ) {
      return
    }
    setMenuOpen(false)
    blockUserMutation.mutate({
      targetUserId: record.authorId,
      authorName: record.authorName,
    })
  }

  return (
    <>
    <article
      className={cardStyle}
      role="link"
      tabIndex={0}
      onClick={goToDetail}
      onKeyDown={(event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return
        const target = event.target
        if (target instanceof Element) {
          const interactive = target.closest(
            'a, button, input, select, textarea, [role="button"], [role="menu"]',
          )
          if (interactive && interactive !== event.currentTarget) return
        }
        event.preventDefault()
        goToDetail()
      }}
    >
      <div className={thumbnailWrapStyle}>
        {media === 'map' ? (
          <ExploreRecordMiniMap
            title={record.title}
            places={record.visitedPlaces.map((place) => ({
              id: place.placeId,
              latitude: place.latitude,
              longitude: place.longitude,
            }))}
          />
        ) : (
          <SafeImage
            src={record.photoUrls[0]}
            className={thumbnailImageStyle}
            placeholderSize="lg"
          />
        )}

        <div
          className={overlayActionsStyle}
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
        >
          {isOwn ? null : (
            <button
              type="button"
              className={overlayButtonStyle}
              aria-label={record.isBookmarked ? '즐겨찾기 해제' : '즐겨찾기 추가'}
              aria-pressed={record.isBookmarked}
              disabled={bookmarkMutation.isPending}
              onClick={handleToggleBookmark}
            >
              <Bookmark
                size={16}
                strokeWidth={1.75}
                fill={record.isBookmarked ? 'currentColor' : 'none'}
              />
            </button>
          )}

          {isOwn ? null : (
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
                <button type="button" role="menuitem" className={menuItemStyle} onClick={handleReport}>
                  신고하기
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className={menuItemDangerStyle}
                  disabled={blockUserMutation.isPending}
                  onClick={handleBlockAuthor}
                >
                  작성자 차단하기
                </button>
              </div>
            </Popover>
          )}
        </div>
      </div>

      <div className={bodyStyle}>
        <h3 className={titleStyle}>{record.title}</h3>
        <p className={summaryStyle}>{record.summary}</p>
        <div className={authorRowStyle}>
          {record.authorProfileImageUrl ? (
            <img className={avatarImageStyle} src={record.authorProfileImageUrl} alt="" />
          ) : (
            <span className={avatarStyle} aria-hidden>
              {record.authorName[0]}
            </span>
          )}
          <span className={authorNameStyle}>{record.authorName}</span>
          {record.linkedPlanTitle ? (
            <Button
              variant="ghost"
              size="sm"
              className={linkedPlanButtonStyle}
              onClick={(event) => {
                event.stopPropagation()
                navigate(ROUTES.recordPlan(record.id))
              }}
            >
              연결된 계획 보기 <ChevronRight size={14} aria-hidden />
            </Button>
          ) : null}
        </div>

        <div className={reactionRowStyle}>
          <button
            type="button"
            className={reactionButtonRecipe({ tone: 'like', active: record.myReaction === 'like' })}
            aria-pressed={record.myReaction === 'like'}
            onClick={(event) => {
              event.stopPropagation()
              handleReact('like')
            }}
          >
            <ThumbsUp size={14} aria-hidden />
            좋아요 {record.likeCount}
          </button>
          <button
            type="button"
            className={reactionButtonRecipe({
              tone: 'dislike',
              active: record.myReaction === 'dislike',
            })}
            aria-pressed={record.myReaction === 'dislike'}
            onClick={(event) => {
              event.stopPropagation()
              handleReact('dislike')
            }}
          >
            <ThumbsDown size={14} aria-hidden />
            싫어요 {record.dislikeCount}
          </button>
        </div>
      </div>
    </article>
    <ReportRecordModal
      open={reportOpen}
      recordId={record.id}
      onClose={() => setReportOpen(false)}
    />
    </>
  )
}
