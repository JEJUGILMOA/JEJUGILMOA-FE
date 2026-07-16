import { Link } from 'react-router'
import type { Place } from '../types'
import { cardStyle, nameStyle, metaStyle } from './PlaceCard.css.ts'

type PlaceCardProps = {
  place: Place
}

export function PlaceCard({ place }: PlaceCardProps) {
  return (
    <Link to={`/place/${place.id}`} className={cardStyle}>
      <strong className={nameStyle}>{place.name}</strong>
      {place.address ? <span className={metaStyle}>{place.address}</span> : null}
      {place.category ? <span className={metaStyle}>{place.category}</span> : null}
    </Link>
  )
}
