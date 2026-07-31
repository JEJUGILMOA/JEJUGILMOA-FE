import { ChevronLeft, ChevronRight } from 'lucide-react'
import { arrowButtonStyle, labelStyle, rootStyle } from './DayPager.css.ts'

export type DayPagerProps = {
  day: number
  totalDays: number
  dateLabel: string
  onPrev: () => void
  onNext: () => void
}

/** STEP 05 상단 Day 전환 페이저 */
export function DayPager({ day, totalDays, dateLabel, onPrev, onNext }: DayPagerProps) {
  return (
    <div className={rootStyle}>
      <button
        type="button"
        className={arrowButtonStyle}
        onClick={onPrev}
        disabled={day <= 1}
        aria-label="이전 Day"
      >
        <ChevronLeft size={18} />
      </button>
      <span className={labelStyle}>
        Day {day} · {dateLabel}
      </span>
      <button
        type="button"
        className={arrowButtonStyle}
        onClick={onNext}
        disabled={day >= totalDays}
        aria-label="다음 Day"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  )
}
