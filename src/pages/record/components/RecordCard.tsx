import { Image } from 'lucide-react'
import { Badge } from '@/components/ui/Badge/Badge'
import type { SavedRecord } from '@/features/records/types'
import { RecordManageSheet } from './RecordManageSheet'
import {
  badgeWrapStyle,
  bodyStyle,
  cardStyle,
  metaStyle,
  reactionStyle,
  summaryStyle,
  thumbnailImageStyle,
  thumbnailPlaceholderStyle,
  thumbnailWrapStyle,
  titleStyle,
} from './RecordCard.css.ts'

export type RecordCardProps = {
  record: SavedRecord
}

/** STEP 05: 내 기록 목록의 카드 한 장 */
export function RecordCard({ record }: RecordCardProps) {
  return (
    <article className={cardStyle}>
      <div className={thumbnailWrapStyle}>
        {record.thumbnailUrl ? (
          <img className={thumbnailImageStyle} src={record.thumbnailUrl} alt="" />
        ) : (
          <span className={thumbnailPlaceholderStyle}>
            <Image size={24} aria-hidden />
          </span>
        )}
        <span className={badgeWrapStyle}>
          <Badge status={record.visibility === 'public' ? 'success' : 'neutral'}>
            {record.visibility === 'public' ? '전체공개' : '비공개'}
          </Badge>
        </span>
        <RecordManageSheet record={record} />
      </div>

      <div className={bodyStyle}>
        <h3 className={titleStyle}>{record.title}</h3>
        <p className={summaryStyle}>{record.summary}</p>
        <p className={metaStyle}>
          방문 장소 {record.visitedPlaceCount}곳 · 사진 {record.photoCount}장
        </p>
        <p className={reactionStyle}>
          좋아요 {record.likeCount} · 싫어요 {record.dislikeCount}
        </p>
      </div>
    </article>
  )
}
