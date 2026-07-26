import { useState } from 'react'
import { Image, MoreVertical } from 'lucide-react'
import { Badge } from '@/components/ui/Badge/Badge'
import { BottomSheet } from '@/components/ui/BottomSheet/BottomSheet'
import type { SavedRecord } from '@/features/records/types'
import { RecordManageSheet } from './RecordManageSheet'
import {
  badgeWrapStyle,
  bodyStyle,
  cardStyle,
  manageButtonStyle,
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
  const [manageOpen, setManageOpen] = useState(false)

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
        <button
          type="button"
          className={manageButtonStyle}
          aria-label="기록 관리"
          onClick={() => setManageOpen(true)}
        >
          <MoreVertical size={16} aria-hidden />
        </button>
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

      <BottomSheet open={manageOpen} onOpenChange={setManageOpen} title="기록 관리">
        <RecordManageSheet record={record} open={manageOpen} onClose={() => setManageOpen(false)} />
      </BottomSheet>
    </article>
  )
}
