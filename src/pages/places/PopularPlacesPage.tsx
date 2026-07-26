import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { Chip } from '@/components/ui/Chip/Chip'
import { Empty } from '@/components/ui/Empty/Empty'
import { HorizontalScrollArea } from '@/components/ui/HorizontalScrollArea/HorizontalScrollArea'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { PlaceCard } from '@/components/ui/PlaceCard/PlaceCard'
import { PLACE_CATEGORY_LABELS, placePath, type PlaceCategoryLabel } from '@/constants'
import { MOCK_PLACES } from '@/data/mockExplore'
import { cardStyle, chipRowStyle, gridStyle, pageStyle } from './PopularPlacesPage.css.ts'

const FILTERS = ['전체', ...PLACE_CATEGORY_LABELS] as const
type PlaceFilter = (typeof FILTERS)[number]

function isPlaceFilter(value: unknown): value is PlaceFilter {
  return typeof value === 'string' && (FILTERS as readonly string[]).includes(value)
}

export function PopularPlacesPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const initialFilter = isPlaceFilter(location.state?.category) ? location.state.category : '전체'
  const [filter, setFilter] = useState<PlaceFilter>(initialFilter)

  const places = useMemo(
    () =>
      filter === '전체'
        ? MOCK_PLACES
        : MOCK_PLACES.filter((place) => place.category === (filter as PlaceCategoryLabel)),
    [filter],
  )

  return (
    <div className={pageStyle}>
      <PageHeader title="인기 관광지" showBack onBack={() => navigate(-1)} />

      <HorizontalScrollArea
        className={chipRowStyle}
        role="tablist"
        aria-label="카테고리 필터"
      >
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
      </HorizontalScrollArea>

      {places.length > 0 ? (
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
      ) : (
        <Empty title="해당 카테고리 장소가 없어요" description="다른 카테고리를 선택해 보세요." />
      )}
    </div>
  )
}
