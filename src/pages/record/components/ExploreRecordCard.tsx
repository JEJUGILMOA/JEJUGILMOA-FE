import { ChevronRight, Image } from 'lucide-react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/Button/Button'
import { ROUTES } from '@/constants'
import type { ExploreRecord } from '@/features/records/types'
import {
  authorNameStyle,
  authorRowStyle,
  avatarStyle,
  bodyStyle,
  cardStyle,
  linkedPlanButtonStyle,
  summaryStyle,
  thumbnailWrapStyle,
  titleStyle,
} from './ExploreRecordCard.css.ts'

export type ExploreRecordCardProps = {
  record: ExploreRecord
}

/** STEP 06: 둘러보기 카드형의 카드 한 장 */
export function ExploreRecordCard({ record }: ExploreRecordCardProps) {
  const navigate = useNavigate()

  return (
    <article className={cardStyle}>
      <div className={thumbnailWrapStyle}>
        <Image size={24} aria-hidden />
      </div>

      <div className={bodyStyle}>
        <h3 className={titleStyle}>{record.title}</h3>
        <p className={summaryStyle}>{record.summary}</p>
        <div className={authorRowStyle}>
          <span className={avatarStyle} aria-hidden>
            {record.authorName[0]}
          </span>
          <span className={authorNameStyle}>{record.authorName}</span>
          {record.linkedPlanTitle ? (
            <Button
              variant="ghost"
              size="sm"
              className={linkedPlanButtonStyle}
              onClick={() => navigate(ROUTES.plan)}
            >
              연결된 계획 보기 <ChevronRight size={14} aria-hidden />
            </Button>
          ) : null}
        </div>
      </div>
    </article>
  )
}
