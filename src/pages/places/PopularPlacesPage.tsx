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
import { usePopularPlacesInfiniteQuery } from '@/features/places/hooks'
import type { PopularPlace } from '@/features/places/types'
import { useLoadMoreSentinel } from '@/hooks/useLoadMoreSentinel'
import { PopularPlaceListCard } from './components/PopularPlaceListCard/PopularPlaceListCard'
import {
  chipRowStyle,
  listStyle,
  loadMoreSentinelStyle,
  loadMoreStatusStyle,
  pageStyle,
} from './PopularPlacesPage.css.ts'

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
  const imageUrls =
    place.imageUrls.length > 0
      ? place.imageUrls
      : place.imageUrl
        ? [place.imageUrl]
        : []

  return {
    id: place.placeId,
    title: place.name,
    category: place.hashtags[0],
    address: place.region,
    distance:
      place.visitCount != null
        ? `${place.visitCount.toLocaleString('ko-KR')}회 방문`
        : undefined,
    imageUrls,
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

  const popularQuery = usePopularPlacesInfiniteQuery(
    { category: apiCategoryName, size: POPULAR_PAGE_LIMIT },
    { enabled: !isUnsupportedCategory },
  )

  const places = useMemo(() => {
    if (isUnsupportedCategory) return []
    return (popularQuery.data?.pages.flatMap((page) => page.content) ?? []).map(mapPopularPlace)
  }, [isUnsupportedCategory, popularQuery.data])

  const sentinelRef = useLoadMoreSentinel({
    enabled: !isUnsupportedCategory && places.length > 0,
    hasNextPage: Boolean(popularQuery.hasNextPage),
    isFetchingNextPage: popularQuery.isFetchingNextPage,
    onLoadMore: () => {
      void popularQuery.fetchNextPage()
    },
  })

  const emptyTitle = isUnsupportedCategory
    ? '아직 지원하지 않는 카테고리예요'
    : '해당 카테고리 장소가 없어요'
  const emptyDescription = isUnsupportedCategory
    ? '다른 카테고리를 선택해 보세요.'
    : '다른 카테고리를 선택하거나 전체를 눌러 보세요.'

  const showInitialLoading =
    !isUnsupportedCategory && popularQuery.isPending && places.length === 0

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

      {showInitialLoading ? <Loading label="인기 관광지 불러오는 중" /> : null}

      {!isUnsupportedCategory && popularQuery.isError && places.length === 0 ? (
        <ErrorState onRetry={() => void popularQuery.refetch()} />
      ) : null}

      {!isUnsupportedCategory && !showInitialLoading && !popularQuery.isError ? (
        places.length > 0 ? (
          <>
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
            <div ref={sentinelRef} className={loadMoreSentinelStyle} aria-hidden />
            {popularQuery.isFetchingNextPage ? (
              <p className={loadMoreStatusStyle}>더 불러오는 중…</p>
            ) : null}
          </>
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
