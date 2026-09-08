import { Star } from 'lucide-react'
import { Button } from '@/components/ui/Button/Button'
import {
  categoryStyle,
  infoColumnStyle,
  mustVisitButtonRecipe,
  rowStyle,
  thumbnailImageStyle,
  thumbnailStyle,
  titleStyle,
  toggleButtonStyle,
} from './WaypointPlaceRow.css.ts'

export type WaypointPlaceRowProps = {
  title: string
  category: string
  imageUrl?: string | null
  added: boolean
  onToggle: () => void
  /** 이 장소가 그 Day의 "꼭 가고 싶은 장소"로 정해져 있는지 */
  isMustVisit: boolean
  /** 별을 누르면 담기와 별개로 꼭 가고 싶은 장소로 정한다(아직 안 담았으면 함께 담는다) */
  onToggleMustVisit: () => void
  /** true면 담기·별표 둘 다 비활성화 — 아직 DB에 없는 TourAPI 폴백 장소용 */
  disabled?: boolean
}

/** STEP 02 경유지 추천 목록의 장소 1개 행 */
export function WaypointPlaceRow({
  title,
  category,
  imageUrl,
  added,
  onToggle,
  isMustVisit,
  onToggleMustVisit,
  disabled = false,
}: WaypointPlaceRowProps) {
  return (
    <div className={rowStyle}>
      {imageUrl ? (
        <img src={imageUrl} alt="" className={thumbnailImageStyle} />
      ) : (
        <div className={thumbnailStyle} aria-hidden />
      )}
      <div className={infoColumnStyle}>
        <span className={titleStyle}>{title}</span>
        <span className={categoryStyle}>{disabled ? '아직 담을 수 없는 장소예요' : category}</span>
      </div>
      <button
        type="button"
        className={mustVisitButtonRecipe({ active: isMustVisit })}
        onClick={onToggleMustVisit}
        disabled={disabled}
        aria-label={isMustVisit ? `${title} 꼭 가고 싶은 장소 해제` : `${title}를 꼭 가고 싶은 장소로 정하기`}
      >
        <Star size={16} fill={isMustVisit ? 'currentColor' : 'none'} />
      </button>
      <Button
        variant={added ? 'primary' : 'outline'}
        size="sm"
        className={toggleButtonStyle}
        onClick={onToggle}
        disabled={disabled}
      >
        {added ? '담김 ✓' : '+ 담기'}
      </Button>
    </div>
  )
}
