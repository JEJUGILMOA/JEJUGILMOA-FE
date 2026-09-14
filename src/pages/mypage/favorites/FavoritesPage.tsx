import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { SearchBar } from '@/components/ui/SearchBar/SearchBar'
import { SegmentedControl, type SegmentedControlItem } from '@/components/ui/SegmentedControl/SegmentedControl'
import { Empty } from '@/components/ui/Empty/Empty'
import { ErrorState } from '@/components/ui/ErrorState/ErrorState'
import { Loading } from '@/components/ui/Loading/Loading'
import { SafeImage } from '@/components/ui/ImagePlaceholder/ImagePlaceholder'
import { Skeleton } from '@/components/ui/Skeleton/Skeleton'
import { ROUTES, placePath, savedCoursePath } from '@/constants'
import { useFavoritesQuery } from '@/features/favorites/hooks'
import { mapSavedCourseToListCard } from '@/features/courses/format'
import { useSavedCoursesQuery } from '@/features/courses/hooks'
import { CourseListCard } from '@/pages/courses/components/CourseListCard/CourseListCard'
import {
  addressStyle,
  categoryStyle,
  coverImageStyle,
  coverStyle,
  itemStyle,
  listItemStyle,
  listStyle,
  metaStyle,
  nameStyle,
  pageStyle,
  skeletonCoverStyle,
  skeletonItemStyle,
  skeletonMetaStyle,
  titleRowStyle,
} from './FavoritesPage.css.ts'

type FavoritesTab = 'places' | 'courses'

const TABS: SegmentedControlItem[] = [
  { value: 'places', label: '즐겨찾기 장소' },
  { value: 'courses', label: '저장한 코스' },
]

function FavoritesSkeleton() {
  return (
    <ul className={listStyle} aria-hidden>
      {Array.from({ length: 4 }, (_, index) => (
        <li key={index} className={skeletonItemStyle}>
          <div className={skeletonMetaStyle}>
            <Skeleton width="56%" height={18} />
            <Skeleton width="72%" height={14} />
          </div>
          <Skeleton width="100%" height={100} className={skeletonCoverStyle} />
        </li>
      ))}
    </ul>
  )
}

export function FavoritesPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<FavoritesTab>('places')
  const [query, setQuery] = useState('')
  const favoritesQuery = useFavoritesQuery({ page: 0, size: 50 })
  const savedCoursesQuery = useSavedCoursesQuery()

  const favorites = favoritesQuery.data?.content ?? []
  const filteredFavorites = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return favorites
    return favorites.filter(
      (place) =>
        place.name.toLowerCase().includes(q) ||
        (place.address?.toLowerCase().includes(q) ?? false) ||
        (place.category?.toLowerCase().includes(q) ?? false),
    )
  }, [favorites, query])
  const savedCourses = savedCoursesQuery.data ?? []

  const isPlacesTab = tab === 'places'

  return (
    <div className={pageStyle}>
      <PageHeader title="즐겨찾기" showBack onBack={() => navigate(ROUTES.my)} />

      <SegmentedControl
        items={TABS}
        value={tab}
        onChange={(value) => setTab(value as FavoritesTab)}
        aria-label="즐겨찾기 보기 전환"
        fullWidth
      />

      {isPlacesTab ? (
        <>
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="즐겨찾기에서 검색"
            onClear={() => setQuery('')}
          />

          {favoritesQuery.isLoading ? <FavoritesSkeleton /> : null}
          {favoritesQuery.isError ? (
            <ErrorState onRetry={() => void favoritesQuery.refetch()} />
          ) : null}

          {!favoritesQuery.isLoading && !favoritesQuery.isError ? (
            filteredFavorites.length === 0 ? (
              <Empty
                title={query.trim() ? '검색 결과가 없어요' : '즐겨찾기한 장소가 없어요'}
                description={
                  query.trim() ? '다른 키워드로 검색해 보세요.' : '마음에 드는 장소를 저장해 보세요.'
                }
              />
            ) : (
              <ul className={listStyle}>
                {filteredFavorites.map((place) => (
                  <li key={place.placeId} className={listItemStyle}>
                    <button
                      type="button"
                      className={itemStyle}
                      onClick={() => navigate(placePath(place.placeId))}
                    >
                      <div className={metaStyle}>
                        <div className={titleRowStyle}>
                          <span className={nameStyle}>{place.name}</span>
                          {place.category ? (
                            <span className={categoryStyle}>{place.category}</span>
                          ) : null}
                        </div>
                        <p className={addressStyle}>{place.address ?? '주소 없음'}</p>
                      </div>
                      <div className={coverStyle}>
                        <SafeImage
                          src={place.imageUrl}
                          className={coverImageStyle}
                          placeholderSize="sm"
                          showPlaceholderLabel={false}
                        />
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )
          ) : null}
        </>
      ) : (
        <>
          {savedCoursesQuery.isLoading ? <Loading label="코스를 불러오는 중…" /> : null}
          {savedCoursesQuery.isError ? (
            <ErrorState onRetry={() => void savedCoursesQuery.refetch()} />
          ) : null}

          {!savedCoursesQuery.isLoading && !savedCoursesQuery.isError ? (
            savedCourses.length === 0 ? (
              <Empty title="저장한 코스가 없어요" description="마음에 드는 코스를 저장해 보세요." />
            ) : (
              <div className={listStyle}>
                {savedCourses.map((course) => (
                  <CourseListCard
                    key={course.savedCourseId}
                    {...mapSavedCourseToListCard(course)}
                    onViewClick={() => navigate(savedCoursePath(course.savedCourseId))}
                  />
                ))}
              </div>
            )
          ) : null}
        </>
      )}
    </div>
  )
}
