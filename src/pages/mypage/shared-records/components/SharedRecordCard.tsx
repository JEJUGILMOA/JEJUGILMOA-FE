import type { SharedRecord } from '@/pages/mypage/data/mockMyPage'
import { Eye, Heart, MessageCircle } from 'lucide-react'
import {
  actionsStyle,
  badgeStyle,
  cardStyle,
  coverStyle,
  metaStyle,
  outlineButtonStyle,
  secondaryButtonStyle,
  statItemStyle,
  statsRowStyle,
  titleStyle,
} from './SharedRecordCard.css.ts'

export type SharedRecordCardProps = {
  record: SharedRecord
  onCopyLink: () => void
  onViewDetail: () => void
}

export function SharedRecordCard({
  record,
  onCopyLink,
  onViewDetail,
}: SharedRecordCardProps) {
  return (
    <article className={cardStyle}>
      <div className={coverStyle({ tone: record.coverTone })}>
        <span className={badgeStyle}>공개 링크</span>
      </div>
      <h3 className={titleStyle}>{record.title}</h3>
      <p className={metaStyle}>
        {record.date} 공유 · 경유지 {record.stops}곳
      </p>
      <div className={statsRowStyle}>
        <span className={statItemStyle}>
          <Eye size={12} strokeWidth={2} aria-hidden /> {record.views}
        </span>
        <span className={statItemStyle}>
          <Heart size={12} strokeWidth={2} aria-hidden /> {record.likes}
        </span>
        <span className={statItemStyle}>
          <MessageCircle size={12} strokeWidth={2} aria-hidden /> {record.comments}
        </span>
      </div>
      <div className={actionsStyle}>
        <button type="button" className={secondaryButtonStyle} onClick={onCopyLink}>
          링크 복사
        </button>
        <button type="button" className={outlineButtonStyle} onClick={onViewDetail}>
          자세히 보기
        </button>
      </div>
    </article>
  )
}
