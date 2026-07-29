import type { TripDayPlan } from '@/features/records/types'
import {
  dayBadgeStyle,
  dayDateStyle,
  dayHeaderStyle,
  dayLabelStyle,
  dayRowStyle,
  itemActivityStyle,
  itemListStyle,
  itemRowStyle,
  itemTimeStyle,
  listStyle,
} from './TripItinerary.css.ts'

export type TripItineraryProps = {
  itinerary: TripDayPlan[]
}

/** STEP 09.3: 일자별 일정 (Day 1~N, 시간순 나열) */
export function TripItinerary({ itinerary }: TripItineraryProps) {
  if (itinerary.length === 0) return null

  return (
    <div className={listStyle}>
      {itinerary.map((day) => (
        <div key={day.day} className={dayRowStyle}>
          <div className={dayHeaderStyle}>
            <span className={dayBadgeStyle} aria-hidden>
              {day.day}
            </span>
            <span className={dayLabelStyle}>Day {day.day}</span>
            <span className={dayDateStyle}>{day.dateLabel}</span>
          </div>
          <div className={itemListStyle}>
            {day.items.map((item, index) => (
              <div key={`${day.day}-${index}`} className={itemRowStyle}>
                <span className={itemTimeStyle}>{item.time}</span>
                <span className={itemActivityStyle}>{item.activity}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
