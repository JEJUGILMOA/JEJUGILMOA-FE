import { ChevronRight, Image, ThumbsDown, ThumbsUp } from 'lucide-react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/Button/Button'
import { ROUTES } from '@/constants'
import { useReactToExploreRecordMutation } from '@/features/records/hooks'
import type { ExploreRecord } from '@/features/records/types'
import {
  authorNameStyle,
  authorRowStyle,
  avatarImageStyle,
  avatarStyle,
  bodyStyle,
  cardStyle,
  linkedPlanButtonStyle,
  reactionButtonRecipe,
  reactionRowStyle,
  summaryStyle,
  thumbnailImageStyle,
  thumbnailWrapStyle,
  titleStyle,
} from './ExploreRecordCard.css.ts'

export type ExploreRecordCardProps = {
  record: ExploreRecord
}

/** STEP 06: 둘러보기 카드형의 카드 한 장 (STEP 07: 좋아요·싫어요 반응 포함). 클릭하면 STEP 08 상세보기로 이동한다 */
export function ExploreRecordCard({ record }: ExploreRecordCardProps) {
  const navigate = useNavigate()
  const reactMutation = useReactToExploreRecordMutation()

  const handleReact = (reaction: 'like' | 'dislike') => {
    reactMutation.mutate({ id: record.id, reaction })
  }

  const goToDetail = () => navigate(ROUTES.recordDetail(record.id))

  return (
    <article
      className={cardStyle}
      role="link"
      tabIndex={0}
      onClick={goToDetail}
      onKeyDown={(event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return
        event.preventDefault()
        goToDetail()
      }}
    >
      <div className={thumbnailWrapStyle}>
        {record.photoUrls[0] ? (
          <img className={thumbnailImageStyle} src={record.photoUrls[0]} alt="" />
        ) : (
          <Image size={24} aria-hidden />
        )}
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
  )
}
