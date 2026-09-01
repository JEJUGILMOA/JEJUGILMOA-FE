import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { Chip } from '@/components/ui/Chip/Chip'
import { Empty } from '@/components/ui/Empty/Empty'
import { ErrorState } from '@/components/ui/ErrorState/ErrorState'
import { HorizontalScrollArea } from '@/components/ui/HorizontalScrollArea/HorizontalScrollArea'
import { Loading } from '@/components/ui/Loading/Loading'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import {
  PLACE_CATEGORY_LABELS,
  getPlaceCategoryApiName,
  placePath,
  type PlaceCategoryLabel,
} from '@/constants'
import { usePlacesQuery, usePopularPlacesQuery } from '@/features/places/hooks'
import type { PlaceListItem, PopularPlace } from '@/features/places/types'
import { PopularPlaceListCard } from './components/PopularPlaceListCard/PopularPlaceListCard'
import { chipRowStyle, listStyle, pageStyle } from './PopularPlacesPage.css.ts'

const FILTERS = ['전체', ...PLACE_CATEGORY_LABELS] as const
const POPULAR_PAGE_LIMIT = 20

type PlaceFilter = (typeof FILTERS)[number]

type PopularPlaceListItem = {
  id: string
  title: string
  category?: string
  distance?: string
  address?: string
  imageUrls: string[]
}

function isPlaceFilter(value: unknown): value is PlaceFilter {
  return typeof value === 'string' && (FILTERS as readonly string[]).includes(value)
}

function mapPopularPlace(place: PopularPlace): PopularPlaceListItem {
  return {
    id: place.placeId,
    title: place.name,
    distance:
      place.visitCount != null
        ? `${place.visitCount.toLocaleString('ko-KR')}회 방문`
        : undefined,
    imageUrls: place.imageUrl ? [place.imageUrl] : [],
  }
}

function mapBrowsePlace(place: PlaceListItem): PopularPlaceListItem {
  return {
    id: place.id,
    title: place.name,
    category: place.categoryName,
    address: place.address,
    imageUrls: place.imageUrl ? [place.imageUrl] : [],
  }
}

export function PopularPlacesPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const initialFilter = isPlaceFilter(location.state?.category) ? location.state.category : '전체'
  const [filter, setFilter] = useState<PlaceFilter>(initialFilter)

  useEffect(() => {
    if (isPlaceFilter(location.state?.category)) {
      setFilter(location.state.category)
    }
  }, [location.state?.category])

  const isAllFilter = filter === '전체'
  const apiCategoryName = isAllFilter
    ? undefined
    : getPlaceCategoryApiName(filter as PlaceCategoryLabel)
  const isUnsupportedCategory = !isAllFilter && !apiCategoryName

  const popularQuery = usePopularPlacesQuery(
    { limit: POPULAR_PAGE_LIMIT },
    { enabled: isAllFilter },
  )
  const placesQuery = usePlacesQuery(
    { category: apiCategoryName, page: 0, size: POPULAR_PAGE_LIMIT },
    { enabled: !isAllFilter && Boolean(apiCategoryName) },
  )

  const activeQuery = isAllFilter ? popularQuery : placesQuery

  const places = useMemo(() => {
    if (isUnsupportedCategory) return []

    if (isAllFilter) {
      return (popularQuery.data ?? []).map(mapPopularPlace)
    }

    return (placesQuery.data ?? []).map(mapBrowsePlace)
  }, [isAllFilter, isUnsupportedCategory, placesQuery.data, popularQuery.data])

  const emptyTitle = isUnsupportedCategory
    ? '아직 지원하지 않는 카테고리예요'
    : '해당 카테고리 장소가 없어요'
  const emptyDescription = isUnsupportedCategory
    ? '다른 카테고리를 선택해 보세요.'
    : '다른 카테고리를 선택하거나 전체를 눌러 보세요.'

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

      {!isUnsupportedCategory && activeQuery.isLoading ? (
        <Loading label="인기 관광지 불러오는 중" />
      ) : null}

      {!isUnsupportedCategory && activeQuery.isError ? (
        <ErrorState onRetry={() => void activeQuery.refetch()} />
      ) : null}

      {!isUnsupportedCategory && !activeQuery.isLoading && !activeQuery.isError ? (
        places.length > 0 ? (
          <div className={listStyle} role="list" aria-label="인기 관광지 목록">
            {places.map((place) => (
              <PopularPlaceListCard
                key={place.id}
                title={place.title}
                category={place.category ?? '인기'}
                distance={place.distance}
                address={place.address ?? ''}
                imageUrls={place.imageUrls}
                onClick={() => navigate(placePath(place.id))}
              />
            ))}
          </div>
        ) : (
          <Empty title={emptyTitle} description={emptyDescription} />
        )
      ) : null}

      {isUnsupportedCategory ? (
        <Empty title={emptyTitle} description={emptyDescription} />
      ) : null}
    </div>
  )
}
