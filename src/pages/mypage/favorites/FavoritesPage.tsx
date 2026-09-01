import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { SearchBar } from '@/components/ui/SearchBar/SearchBar'
import { Empty } from '@/components/ui/Empty/Empty'
import { ROUTES } from '@/constants'
import { useMyProfileQuery } from '@/features/auth/hooks'
import type { FavoritePlace } from '@/pages/mypage/data/mockMyPage'
import {
  categoryStyle,
  itemStyle,
  listStyle,
  metaStyle,
  nameStyle,
  pageStyle,
} from './FavoritesPage.css.ts'

export function FavoritesPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const { data: profile } = useMyProfileQuery()

  const favorites = useMemo<FavoritePlace[]>(() => [], [])
  const filteredFavorites = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return favorites
    return favorites.filter(
      (place) =>
        place.name.toLowerCase().includes(q) ||
        place.region.toLowerCase().includes(q) ||
        place.category.toLowerCase().includes(q),
    )
  }, [favorites, query])

  const emptyTitle =
    (profile?.favoriteCount ?? 0) > 0
      ? '즐겨찾기 목록 API가 준비 중이에요'
      : '즐겨찾기한 장소가 없어요'
  const emptyDescription =
    (profile?.favoriteCount ?? 0) > 0
      ? '개수는 프로필에서 확인할 수 있어요.'
      : '마음에 드는 장소를 저장해 보세요.'

  return (
    <div className={pageStyle}>
      <PageHeader title="즐겨찾기 장소" showBack onBack={() => navigate(ROUTES.my)} />
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="즐겨찾기에서 검색"
        onClear={() => setQuery('')}
      />

      {filteredFavorites.length === 0 ? (
        <Empty title={emptyTitle} description={emptyDescription} />
      ) : (
        <ul className={listStyle}>
          {filteredFavorites.map((place) => (
            <li key={place.id}>
              <button
                type="button"
                className={itemStyle}
                onClick={() => navigate(`/place/${place.id}`)}
              >
                <span className={nameStyle}>{place.name}</span>
                <span className={metaStyle}>
                  {place.region}
                  <span className={categoryStyle}>{place.category}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
