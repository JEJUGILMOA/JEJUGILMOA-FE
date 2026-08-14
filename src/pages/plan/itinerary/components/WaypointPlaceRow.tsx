import { Button } from '@/components/ui/Button/Button'
import {
  categoryStyle,
  infoColumnStyle,
  rowStyle,
  thumbnailStyle,
  titleStyle,
  toggleButtonStyle,
} from './WaypointPlaceRow.css.ts'

export type WaypointPlaceRowProps = {
  title: string
  category: string
  added: boolean
  onToggle: () => void
}

/** STEP 02 경유지 추천 목록의 장소 1개 행 */
export function WaypointPlaceRow({ title, category, added, onToggle }: WaypointPlaceRowProps) {
  return (
    <div className={rowStyle}>
      <div className={thumbnailStyle} aria-hidden />
      <div className={infoColumnStyle}>
        <span className={titleStyle}>{title}</span>
        <span className={categoryStyle}>{category}</span>
      </div>
      <Button
        variant={added ? 'primary' : 'outline'}
        size="sm"
        className={toggleButtonStyle}
        onClick={onToggle}
      >
        {added ? '담김 ✓' : '+ 담기'}
      </Button>
    </div>
  )
}
