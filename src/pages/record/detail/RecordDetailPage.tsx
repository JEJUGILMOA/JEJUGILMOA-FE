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
  useMyRecordsQuery,
  useReactToRecordMutation,
  useToggleRecordBookmarkMutation,
} from '@/features/records/hooks'
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

/** STEP 08: 내 기록 상세보기 — 내 기록 목록에서 카드 클릭 시 진입 */
export function RecordDetailPage() {
  const { recordId } = useParams<{ recordId: string }>()
  const navigate = useNavigate()
  const nickname = useAuthStore((state) => state.user?.nickname) ?? '나'

  const { data: records = [], isLoading } = useMyRecordsQuery()
  const record = records.find((item) => item.id === recordId) ?? null

  const bookmarkMutation = useToggleRecordBookmarkMutation()
  const reactMutation = useReactToRecordMutation()

  const goBack = () => navigate(ROUTES.record)

  const handleShare = async () => {
    if (!record) return
    const shareData = { title: record.title, text: record.summary, url: window.location.href }
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
        <ChevronLeft size={24} strokeWidth={2} />
      </button>
      {record ? <RecordManageSheet record={record} inline onDeleted={goBack} /> : null}
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

  if (!record) {
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
          photoUrls={record.photoUrls}
          isBookmarked={record.isBookmarked}
          onToggleBookmark={() => bookmarkMutation.mutate(record.id)}
        />

        <div className={infoStyle}>
          <div className={badgeRowStyle}>
            <Badge status={record.visibility === 'public' ? 'success' : 'neutral'}>
              {record.visibility === 'public' ? '전체 공개' : '비공개'}
            </Badge>
            <span className={createdAtStyle}>
              {format(new Date(record.createdAt), 'yyyy.MM.dd')} 작성
            </span>
          </div>

          <div className={titleGroupStyle}>
            <h1 className={titleStyle}>{record.title}</h1>
            {record.tripDateRangeLabel ? (
              <p className={dateRangeStyle}>{record.tripDateRangeLabel}</p>
            ) : null}
          </div>

          {record.tripDateRangeLabel ? (
            <Button
              variant="ghost"
              size="sm"
              className={linkedPlanButtonStyle}
              onClick={() => navigate(ROUTES.plan)}
            >
              {record.title} 계획 보기 <ChevronRight size={14} aria-hidden />
            </Button>
          ) : null}

          <p className={summaryStyle}>{record.summary}</p>

          <div className={authorRowStyle}>
            <span className={avatarStyle} aria-hidden>
              {nickname[0]}
            </span>
            <span className={authorNameStyle}>{nickname}</span>
            <span className={authorTimeStyle}>
              {formatDistanceToNow(new Date(record.createdAt), { locale: ko, addSuffix: true })}
            </span>
          </div>

          <p className={metaStyle}>
            방문 장소 {record.visitedPlaceCount}곳 · 사진 {record.photoCount}장
          </p>

          <div className={actionRowStyle}>
            <button
              type="button"
              className={reactionButtonRecipe({
                tone: 'like',
                active: record.myReaction === 'like',
              })}
              aria-pressed={record.myReaction === 'like'}
              onClick={() => reactMutation.mutate({ id: record.id, reaction: 'like' })}
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
              onClick={() => reactMutation.mutate({ id: record.id, reaction: 'dislike' })}
            >
              <ThumbsDown size={14} aria-hidden />
              싫어요 {record.dislikeCount}
            </button>
            <button type="button" className={shareButtonStyle} onClick={handleShare}>
              <Share2 size={14} aria-hidden />
              공유
            </button>
          </div>
        </div>

        <VisitedPlaceList places={record.visitedPlaces} />
        <RoutePreview places={record.visitedPlaces} />
      </div>
    </div>
  )
}
