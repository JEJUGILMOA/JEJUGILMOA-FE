import { Star } from 'lucide-react'
import { badgeTextStyle, rowStyle, starIconStyle, viewAllStyle, wrapStyle } from './EarnedBadgeCallout.css.ts'

export type EarnedBadgeCalloutProps = {
  /** 새로 딴 배지 중 대표로 보여줄 이름 */
  badgeName: string
  /** 그 외에 같이 딴 배지 개수. 0이면 "외 N개" 없이 이름만 */
  additionalCount: number
  onViewAll: () => void
}

/** 기록 상세 상단 메타 줄 아래에 "이번에 새로 딴 배지"를 한 줄로 보여준다 (배지 디자인 옵션 H) */
export function EarnedBadgeCallout({ badgeName, additionalCount, onViewAll }: EarnedBadgeCalloutProps) {
  const label = additionalCount > 0 ? `${badgeName} 외 ${additionalCount}개 배지 획득` : `${badgeName} 배지 획득`

  return (
    <div className={wrapStyle}>
      <button type="button" className={rowStyle} onClick={onViewAll}>
        <Star size={13} className={starIconStyle} fill="currentColor" strokeWidth={0} aria-hidden />
        <span className={badgeTextStyle}>{label}</span>
        <span className={viewAllStyle}>· 전체보기</span>
      </button>
    </div>
  )
}
