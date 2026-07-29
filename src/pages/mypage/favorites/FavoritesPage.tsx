import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { SearchBar } from '@/components/ui/SearchBar/SearchBar'
import { Empty } from '@/components/ui/Empty/Empty'
import { ROUTES } from '@/constants'
import { mockFavorites } from '@/pages/mypage/data/mockMyPage'
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

  const favorites = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return mockFavorites
    return mockFavorites.filter(
      (place) =>
        place.name.toLowerCase().includes(q) ||
        place.region.toLowerCase().includes(q) ||
        place.category.toLowerCase().includes(q),
    )
  }, [query])

  return (
    <div className={pageStyle}>
      <PageHeader title="즐겨찾기 장소" showBack onBack={() => navigate(ROUTES.my)} />
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="즐겨찾기에서 검색"
        onClear={() => setQuery('')}
      />

      {favorites.length === 0 ? (
        <Empty title="검색 결과가 없어요" description="다른 키워드로 찾아보세요." />
      ) : (
        <ul className={listStyle}>
          {favorites.map((place) => (
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
