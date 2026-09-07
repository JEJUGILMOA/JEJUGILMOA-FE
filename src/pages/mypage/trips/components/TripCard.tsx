import type { PlanTripCardModel } from '@/features/plans/types'
import {
  bodyStyle,
  bodyTitleStyle,
  cardStyle,
  dayProgressStyle,
  dDayBadgeStyle,
  headerStyle,
  headerTitleStyle,
  headerTopStyle,
  metaRowStyle,
  metaTextStyle,
  progressFillStyle,
  progressTrackStyle,
  statusBadgeStyle,
} from './TripCard.css.ts'

export type TripCardProps = {
  trip: PlanTripCardModel
  onClick?: () => void
}

export function TripCard({ trip, onClick }: TripCardProps) {
  const isClickable = Boolean(onClick)
  const isOngoing = trip.status === 'ongoing'
  const titleInHeader = isOngoing

  return (
    <button
      type="button"
      className={cardStyle}
      onClick={onClick}
      disabled={!isClickable}
    >
      <div className={headerStyle({ tone: trip.status })}>
        <div className={headerTopStyle}>
          <span className={statusBadgeStyle({ tone: trip.status })}>
            {trip.statusBadge}
            {trip.dayProgressLabel ? (
              <span className={dayProgressStyle}>{trip.dayProgressLabel}</span>
            ) : null}
          </span>
          {trip.dDayBadge ? <span className={dDayBadgeStyle}>{trip.dDayBadge}</span> : null}
        </div>
        {titleInHeader ? <p className={headerTitleStyle}>{trip.title}</p> : null}
      </div>

      <div className={bodyStyle}>
        {!titleInHeader ? <p className={bodyTitleStyle}>{trip.title}</p> : null}
        <div className={metaRowStyle}>
          <p className={metaTextStyle}>{trip.dateLine}</p>
          <p className={metaTextStyle}>{trip.waypointLabel}</p>
        </div>
        {isOngoing && trip.progress != null ? (
          <div className={progressTrackStyle} aria-hidden>
            <div
              className={progressFillStyle}
              style={{ width: `${Math.round(Math.min(1, Math.max(0, trip.progress)) * 100)}%` }}
            />
          </div>
        ) : null}
      </div>
    </button>
  )
}
