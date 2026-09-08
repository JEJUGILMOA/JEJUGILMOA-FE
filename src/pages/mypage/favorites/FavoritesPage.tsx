import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { Image } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { SearchBar } from '@/components/ui/SearchBar/SearchBar'
import { Empty } from '@/components/ui/Empty/Empty'
import { ErrorState } from '@/components/ui/ErrorState/ErrorState'
import { Skeleton } from '@/components/ui/Skeleton/Skeleton'
import { ROUTES, placePath } from '@/constants'
import { useFavoritesQuery } from '@/features/favorites/hooks'
import {
  addressStyle,
  categoryStyle,
  coverImageStyle,
  coverPlaceholderStyle,
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
  const [query, setQuery] = useState('')
  const favoritesQuery = useFavoritesQuery({ page: 0, size: 50 })

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

  return (
    <div className={pageStyle}>
      <PageHeader title="즐겨찾기 장소" showBack onBack={() => navigate(ROUTES.my)} />
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
                    {place.imageUrl ? (
                      <img src={place.imageUrl} alt="" className={coverImageStyle} />
                    ) : (
                      <div className={coverPlaceholderStyle} aria-hidden>
                        <Image size={24} strokeWidth={1.5} />
                      </div>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )
      ) : null}
    </div>
  )
}
