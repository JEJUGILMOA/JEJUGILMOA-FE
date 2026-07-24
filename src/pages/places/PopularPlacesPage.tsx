import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { Chip } from '@/components/ui/Chip/Chip'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { PlaceCard } from '@/components/ui/PlaceCard/PlaceCard'
import { placePath } from '@/constants'
import { MOCK_PLACES } from '@/data/mockExplore'
import { cardStyle, chipRowStyle, gridStyle, pageStyle } from './PopularPlacesPage.css.ts'

const FILTERS = ['전체', '식당', '카페', '자연'] as const

export function PopularPlacesPage() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('전체')

  const places = useMemo(
    () =>
      filter === '전체'
        ? MOCK_PLACES
        : MOCK_PLACES.filter((place) => place.category === filter),
    [filter],
  )

  return (
    <div className={pageStyle}>
      <PageHeader title="인기 관광지" showBack onBack={() => navigate(-1)} />

      <div className={chipRowStyle} role="tablist" aria-label="카테고리 필터">
        {FILTERS.map((item) => (
          <Chip
            key={item}
            size="md"
            colorScheme="primary"
            isSelected={filter === item}
            onClick={() => setFilter(item)}
          >
            {item}
          </Chip>
        ))}
      </div>

      <div className={gridStyle}>
        {places.map((place) => (
          <PlaceCard
            key={place.id}
            className={cardStyle}
            variant="vertical"
            width="100%"
            title={place.title}
            meta={place.location}
            rating={place.rating}
            onClick={() => navigate(placePath(place.id))}
          />
        ))}
      </div>
    </div>
  )
}
