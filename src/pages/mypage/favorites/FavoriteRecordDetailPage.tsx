import { useNavigate, useParams } from 'react-router'
import { ChevronLeft, Share2, ThumbsDown, ThumbsUp } from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Empty } from '@/components/ui/Empty/Empty'
import { ErrorState } from '@/components/ui/ErrorState/ErrorState'
import { Loading } from '@/components/ui/Loading/Loading'
import { toast } from '@/components/ui/Toast/Toast'
import { ROUTES } from '@/constants'
import { requireLogin } from '@/features/auth/requireLogin'
import {
  useReactToExploreRecordMutation,
  useRecordDetailQuery,
  useToggleRecordBookmarkMutation,
} from '@/features/records/hooks'
import type { ReactionType } from '@/features/records/types'
import { ExpandableMemo } from '@/pages/record/detail/components/ExpandableMemo'
import { PhotoCarousel } from '@/pages/record/detail/components/PhotoCarousel'
import { RoutePreview } from '@/pages/record/detail/components/RoutePreview'
import { VisitedPlaceList } from '@/pages/record/detail/components/VisitedPlaceList'
import {
  actionRowStyle,
  authorNameStyle,
  authorRowStyle,
  authorTimeStyle,
  avatarImageStyle,
  avatarStyle,
  backButtonStyle,
  bodyStyle,
  createdAtStyle,
  dateRangeStyle,
  infoStyle,
  metaStyle,
  pageStyle,
  photoBleedStyle,
  reactionButtonRecipe,
  shareButtonStyle,
  subHeaderStyle,
  titleGroupStyle,
  titleStyle,
} from '@/pages/record/detail/RecordDetailPage.css.ts'

/** 마이 > 즐겨찾기 기록 상세 — 즐겨찾기 토글만 노출 (관리/신고 드롭다운 없음) */
export function FavoriteRecordDetailPage() {
  const { recordId } = useParams<{ recordId: string }>()
  const navigate = useNavigate()
  const detailQuery = useRecordDetailQuery(recordId)
  const bookmarkMutation = useToggleRecordBookmarkMutation()
  const reactMutation = useReactToExploreRecordMutation()

  const view = detailQuery.data ?? null

  const goBack = () => {
    navigate(ROUTES.myFavoritesTab('records'))
  }

  const handleToggleBookmark = () => {
    if (!view) return
    if (
      !requireLogin({
        returnTo: ROUTES.myFavoriteRecord(view.id),
        description: '즐겨찾기는 로그인 후 이용할 수 있어요.',
      })
    ) {
      return
    }
    bookmarkMutation.mutate({
      id: view.id,
      nextFavorite: !view.isBookmarked,
    })
  }

  const handleReact = (reaction: ReactionType) => {
    if (!view) return
    if (
      !requireLogin({
        returnTo: ROUTES.myFavoriteRecord(view.id),
        description: '좋아요·싫어요는 로그인 후 이용할 수 있어요.',
      })
    ) {
      return
    }
    reactMutation.mutate({ id: view.id, reaction, currentReaction: view.myReaction })
  }

  const handleShare = async () => {
    if (!view) return
    const shareData = { title: view.title, text: view.summary, url: window.location.href }
    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch {
        // 공유 취소 등은 무시
      }
      return
    }
    await navigator.clipboard.writeText(window.location.href)
    toast.success('링크를 복사했어요')
  }

  const header = (
    <div className={subHeaderStyle}>
      <button type="button" className={backButtonStyle} onClick={goBack} aria-label="뒤로 가기">
        <ChevronLeft size={22} strokeWidth={2} />
      </button>
    </div>
  )

  if (detailQuery.isLoading) {
    return (
      <div>
        {header}
        <Loading label="기록을 불러오는 중…" />
      </div>
    )
  }

  if (detailQuery.isError) {
    return (
      <div>
        {header}
        <ErrorState onRetry={() => void detailQuery.refetch()} />
      </div>
    )
  }

  if (!view) {
    return (
      <div>
        {header}
        <Empty title="기록을 찾을 수 없어요" description="삭제되었거나 존재하지 않는 기록이에요." />
      </div>
    )
  }

  return (
    <div>
      {header}

      <div className={pageStyle}>
        <div className={photoBleedStyle}>
          <PhotoCarousel
            photoUrls={view.photoUrls}
            title={view.title}
            isBookmarked={view.isBookmarked}
            onToggleBookmark={handleToggleBookmark}
          />
        </div>

        <div className={bodyStyle}>
          <div className={infoStyle}>
            <p className={createdAtStyle}>{format(new Date(view.createdAt), 'yyyy.MM.dd')} 작성</p>

            <div className={titleGroupStyle}>
              <h1 className={titleStyle}>{view.title}</h1>
              {view.tripDateRangeLabel ? (
                <p className={dateRangeStyle}>{view.tripDateRangeLabel}</p>
              ) : null}
            </div>

            {view.summary ? <ExpandableMemo text={view.summary} /> : null}

            <div className={authorRowStyle}>
              {view.authorProfileImageUrl ? (
                <img className={avatarImageStyle} src={view.authorProfileImageUrl} alt="" />
              ) : (
                <span className={avatarStyle} aria-hidden>
                  {view.authorName[0]}
                </span>
              )}
              <span className={authorNameStyle}>{view.authorName}</span>
              <span className={authorTimeStyle}>
                {formatDistanceToNow(new Date(view.createdAt), { locale: ko, addSuffix: true })}
              </span>
            </div>

            <p className={metaStyle}>
              방문 장소 {view.visitedPlaces.length}곳 · 사진 {view.photoUrls.length}장
            </p>

            <div className={actionRowStyle}>
              <button
                type="button"
                className={reactionButtonRecipe({
                  tone: 'like',
                  active: view.myReaction === 'like',
                })}
                aria-pressed={view.myReaction === 'like'}
                onClick={() => handleReact('like')}
              >
                <ThumbsUp size={14} aria-hidden />
                좋아요 {view.likeCount}
              </button>
              <button
                type="button"
                className={reactionButtonRecipe({
                  tone: 'dislike',
                  active: view.myReaction === 'dislike',
                })}
                aria-pressed={view.myReaction === 'dislike'}
                onClick={() => handleReact('dislike')}
              >
                <ThumbsDown size={14} aria-hidden />
                싫어요 {view.dislikeCount}
              </button>
              <button type="button" className={shareButtonStyle} onClick={handleShare}>
                <Share2 size={14} aria-hidden />
                공유
              </button>
            </div>
          </div>

          <VisitedPlaceList places={view.visitedPlaces} />
          <RoutePreview places={view.visitedPlaces} title={view.title} />
        </div>
      </div>
    </div>
  )
}
