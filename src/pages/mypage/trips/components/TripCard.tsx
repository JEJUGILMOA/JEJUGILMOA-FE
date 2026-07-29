import type { MyTrip } from '@/pages/mypage/data/mockMyPage'
import {
  badgeStyle,
  cardStyle,
  detailStyle,
  progressBarStyle,
  progressFillStyle,
  summaryStyle,
  titleStyle,
  ongoingHeaderStyle,
} from './TripCard.css.ts'

export type TripCardProps = {
  trip: MyTrip
  onClick?: () => void
}

export function TripCard({ trip, onClick }: TripCardProps) {
  const isOngoing = trip.status === 'ongoing'

  return (
    <button type="button" className={cardStyle({ ongoing: isOngoing })} onClick={onClick}>
      {isOngoing ? (
        <div className={ongoingHeaderStyle}>
          <p className={summaryStyle}>{trip.summary}</p>
          <p className={titleStyle}>{trip.title}</p>
        </div>
      ) : (
        <>
          {trip.badge ? <span className={badgeStyle}>{trip.badge}</span> : null}
          <p className={titleStyle}>{trip.title}</p>
          <p className={summaryStyle}>{trip.summary}</p>
        </>
      )}

      {isOngoing && trip.detail ? (
        <div>
          <p className={detailStyle}>{trip.detail}</p>
          <div className={progressBarStyle}>
            <div
              className={progressFillStyle}
              style={{ width: `${Math.round((trip.progress ?? 0) * 100)}%` }}
            />
          </div>
        </div>
      ) : null}
    </button>
  )
}
