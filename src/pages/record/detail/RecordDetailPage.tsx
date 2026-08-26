import { useNavigate, useParams } from 'react-router'
import { ChevronLeft, ChevronRight, Share2, ThumbsDown, ThumbsUp } from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Badge } from '@/components/ui/Badge/Badge'
import { Button } from '@/components/ui/Button/Button'
import { Empty } from '@/components/ui/Empty/Empty'
import { Loading } from '@/components/ui/Loading/Loading'
import { toast } from '@/components/ui/Toast/Toast'
import { ROUTES } from '@/constants'
import {
  useExploreRecordsQuery,
  useMyRecordsQuery,
  useReactToExploreRecordMutation,
  useReactToRecordMutation,
  useToggleExploreRecordBookmarkMutation,
  useToggleRecordBookmarkMutation,
} from '@/features/records/hooks'
import type { ExploreRecord, ReactionType, SavedRecord } from '@/features/records/types'
import { useAuthStore } from '@/stores/authStore'
import { RecordManageSheet } from '@/pages/record/components/RecordManageSheet'
import { PhotoCarousel } from './components/PhotoCarousel'
import { RoutePreview } from './components/RoutePreview'
import { VisitedPlaceList } from './components/VisitedPlaceList'
import {
  actionRowStyle,
  authorNameStyle,
  authorRowStyle,
  authorTimeStyle,
  avatarStyle,
  backButtonStyle,
  badgeRowStyle,
  bodyStyle,
  createdAtStyle,
  dateRangeStyle,
  infoStyle,
  linkedPlanButtonStyle,
  metaStyle,
  pageStyle,
  reactionButtonRecipe,
  shareButtonStyle,
  subHeaderStyle,
  summaryStyle,
  titleGroupStyle,
  titleStyle,
} from './RecordDetailPage.css.ts'

/** 내 기록 / 둘러보기 기록을 같은 상세 레이아웃으로 그리기 위한 공통 뷰 모델 */
type DetailViewModel = {
  id: string
  title: string
  summary: string
  photoUrls: string[]
  tripDateRangeLabel: string
  visitedPlaces: SavedRecord['visitedPlaces']
  createdAt: string
  isBookmarked: boolean
  likeCount: number
  dislikeCount: number
  myReaction: ReactionType | null
  authorName: string
  visibilityLabel: string
  linkedPlanLabel: string | null
  isOwn: boolean
}

function fromOwnRecord(record: SavedRecord, nickname: string): DetailViewModel {
  return {
    id: record.id,
    title: record.title,
    summary: record.summary,
    photoUrls: record.photoUrls,
    tripDateRangeLabel: record.tripDateRangeLabel,
    visitedPlaces: record.visitedPlaces,
    createdAt: record.createdAt,
    isBookmarked: record.isBookmarked,
    likeCount: record.likeCount,
    dislikeCount: record.dislikeCount,
    myReaction: record.myReaction,
    authorName: nickname,
    visibilityLabel: record.visibility === 'public' ? '전체 공개' : '비공개',
    linkedPlanLabel: record.tripDateRangeLabel ? `${record.title} 계획 보기` : null,
    isOwn: true,
  }
}

function fromExploreRecord(record: ExploreRecord): DetailViewModel {
  return {
    id: record.id,
    title: record.title,
    summary: record.summary,
    photoUrls: record.photoUrls,
    tripDateRangeLabel: record.tripDateRangeLabel,
    visitedPlaces: record.visitedPlaces,
    createdAt: record.createdAt,
    isBookmarked: record.isBookmarked,
    likeCount: record.likeCount,
    dislikeCount: record.dislikeCount,
    myReaction: record.myReaction,
    authorName: record.authorName,
    visibilityLabel: '전체 공개',
    linkedPlanLabel: record.linkedPlanTitle ? `${record.linkedPlanTitle} 계획 보기` : null,
    isOwn: false,
  }
}

/** STEP 08: 기록 상세보기 — 내 기록·둘러보기 카드 클릭 시 진입 (본인 기록만 관리 메뉴 노출) */
export function RecordDetailPage() {
  const { recordId } = useParams<{ recordId: string }>()
  const navigate = useNavigate()
  const nickname = useAuthStore((state) => state.user?.nickname) ?? '나'

  const myRecordsQuery = useMyRecordsQuery()
  const exploreRecordsQuery = useExploreRecordsQuery()

  const ownRecord = myRecordsQuery.data?.find((item) => item.id === recordId) ?? null
  const exploreRecord = ownRecord
    ? null
    : (exploreRecordsQuery.data?.find((item) => item.id === recordId) ?? null)

  const isLoading = myRecordsQuery.isLoading || (!ownRecord && exploreRecordsQuery.isLoading)

  const view = ownRecord
    ? fromOwnRecord(ownRecord, nickname)
    : exploreRecord
      ? fromExploreRecord(exploreRecord)
      : null

  const bookmarkMutation = useToggleRecordBookmarkMutation()
  const reactMutation = useReactToRecordMutation()
  const exploreBookmarkMutation = useToggleExploreRecordBookmarkMutation()
  const exploreReactMutation = useReactToExploreRecordMutation()

  const goBack = () => navigate(ROUTES.record)

  const handleToggleBookmark = () => {
    if (!view) return
    if (view.isOwn) bookmarkMutation.mutate(view.id)
    else exploreBookmarkMutation.mutate(view.id)
  }

  const handleReact = (reaction: ReactionType) => {
    if (!view) return
    if (view.isOwn) reactMutation.mutate({ id: view.id, reaction })
    else exploreReactMutation.mutate({ id: view.id, reaction })
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
      {ownRecord ? <RecordManageSheet record={ownRecord} inline onDeleted={goBack} /> : null}
    </div>
  )

  if (isLoading) {
    return (
      <div>
        {header}
        <Loading label="기록을 불러오는 중…" />
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
        <PhotoCarousel
          photoUrls={view.photoUrls}
          isBookmarked={view.isBookmarked}
          onToggleBookmark={handleToggleBookmark}
        />

        <div className={bodyStyle}>
          <div className={infoStyle}>
            <div className={badgeRowStyle}>
              <Badge status={view.visibilityLabel === '전체 공개' ? 'success' : 'neutral'}>
                {view.visibilityLabel}
              </Badge>
              <span className={createdAtStyle}>
                {format(new Date(view.createdAt), 'yyyy.MM.dd')} 작성
              </span>
            </div>

            <div className={titleGroupStyle}>
              <h1 className={titleStyle}>{view.title}</h1>
              {view.tripDateRangeLabel ? (
                <p className={dateRangeStyle}>{view.tripDateRangeLabel}</p>
              ) : null}
            </div>

            {view.linkedPlanLabel ? (
              <Button
                variant="ghost"
                size="sm"
                className={linkedPlanButtonStyle}
                onClick={() => navigate(ROUTES.recordPlan(view.id))}
              >
                {view.linkedPlanLabel} <ChevronRight size={14} aria-hidden />
              </Button>
            ) : null}

            <p className={summaryStyle}>{view.summary}</p>

            <div className={authorRowStyle}>
              <span className={avatarStyle} aria-hidden>
                {view.authorName[0]}
              </span>
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
          <RoutePreview places={view.visitedPlaces} />
        </div>
      </div>
    </div>
  )
}
