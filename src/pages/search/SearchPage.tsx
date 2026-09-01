import { useMemo, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { Clock, Coffee, MapPin, X, type LucideIcon } from 'lucide-react'
import { Chip } from '@/components/ui/Chip/Chip'
import { Empty } from '@/components/ui/Empty/Empty'
import { ErrorState } from '@/components/ui/ErrorState/ErrorState'
import { Loading } from '@/components/ui/Loading/Loading'
import { SearchBar } from '@/components/ui/SearchBar/SearchBar'
import { placePath } from '@/constants'
import { usePlacesQuery } from '@/features/places/hooks'
import type { PlaceListItem } from '@/features/places/types'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import {
  bodyStyle,
  cancelButtonStyle,
  chipWrapStyle,
  matchStyle,
  pageStyle,
  recentButtonStyle,
  recentIconStyle,
  recentItemStyle,
  recentLabelStyle,
  recentListStyle,
  removeButtonStyle,
  resultContentStyle,
  resultIconStyle,
  resultItemStyle,
  resultListStyle,
  resultMetaStyle,
  resultTitleStyle,
  searchFieldWrapStyle,
  sectionStyle,
  sectionTitleStyle,
  topBarStyle,
} from './SearchPage.css.ts'

const SEARCH_DEBOUNCE_MS = 300
const SEARCH_PAGE_SIZE = 20

const INITIAL_RECENT = ['협재 해수욕장', '오설록 티뮤지엄', '성산일출봉', '애월 카페거리']

const POPULAR_KEYWORDS = ['성산일출봉', '애월 카페거리', '동문시장', '한라산', '흑돼지 맛집']

function shortAddress(address?: string) {
  if (!address) return ''
  const parts = address.split(/\s+/).filter(Boolean)
  if (parts.length >= 3) return `${parts[1]} ${parts[2]}`
  if (parts.length >= 2) return parts[1]
  return address
}

function getResultIcon(categoryName?: string): LucideIcon {
  if (categoryName === '카페') return Coffee
  return MapPin
}

function highlightMatch(text: string, query: string): ReactNode {
  const trimmed = query.trim()
  if (!trimmed) return text

  const lowerText = text.toLowerCase()
  const lowerQuery = trimmed.toLowerCase()
  const index = lowerText.indexOf(lowerQuery)
  if (index < 0) return text

  return (
    <>
      {text.slice(0, index)}
      <span className={matchStyle}>{text.slice(index, index + trimmed.length)}</span>
      {text.slice(index + trimmed.length)}
    </>
  )
}

export function SearchPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [recentSearches, setRecentSearches] = useState(INITIAL_RECENT)

  const trimmedQuery = query.trim()
  const debouncedKeyword = useDebouncedValue(trimmedQuery, SEARCH_DEBOUNCE_MS)
  const showResults = trimmedQuery.length > 0
  const isDebouncing = trimmedQuery !== debouncedKeyword

  const placesQuery = usePlacesQuery(
    { keyword: debouncedKeyword, page: 0, size: SEARCH_PAGE_SIZE },
    { enabled: debouncedKeyword.length > 0 },
  )

  const results = useMemo(() => placesQuery.data ?? [], [placesQuery.data])

  const pushRecent = (term: string) => {
    const next = term.trim()
    if (!next) return
    setRecentSearches((prev) => [next, ...prev.filter((item) => item !== next)].slice(0, 8))
  }

  const handleCancel = () => {
    navigate(-1)
  }

  const handleSelectKeyword = (term: string) => {
    setQuery(term)
    pushRecent(term)
  }

  const handleSelectResult = (place: PlaceListItem) => {
    pushRecent(place.name)
    navigate(placePath(place.id))
  }

  const handleRemoveRecent = (term: string) => {
    setRecentSearches((prev) => prev.filter((item) => item !== term))
  }

  const isLoadingResults =
    debouncedKeyword.length > 0 && (placesQuery.isLoading || placesQuery.isFetching)
  const showLoading = showResults && (isDebouncing || isLoadingResults)

  const renderSearchResults = () => {
    if (showLoading) {
      return <Loading label="검색 중" />
    }

    if (debouncedKeyword.length > 0 && placesQuery.isError) {
      return <ErrorState onRetry={() => void placesQuery.refetch()} />
    }

    if (debouncedKeyword.length > 0 && results.length > 0) {
      return (
        <ul className={resultListStyle}>
          {results.map((place) => {
            const Icon = getResultIcon(place.categoryName)
            const location = shortAddress(place.address)
            const meta = [place.categoryName, location].filter(Boolean).join(' · ')

            return (
              <li key={place.id}>
                <button
                  type="button"
                  className={resultItemStyle}
                  onClick={() => handleSelectResult(place)}
                >
                  <span className={resultIconStyle} aria-hidden>
                    <Icon size={18} strokeWidth={1.75} />
                  </span>
                  <span className={resultContentStyle}>
                    <span className={resultTitleStyle}>
                      {highlightMatch(place.name, trimmedQuery)}
                    </span>
                    {meta ? <span className={resultMetaStyle}>{meta}</span> : null}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )
    }

    if (debouncedKeyword.length > 0 && placesQuery.isSuccess) {
      return <Empty title="검색 결과가 없어요" description="다른 키워드로 다시 찾아보세요." />
    }

    return <Loading label="검색 중" />
  }

  return (
    <div className={pageStyle}>
      <div className={topBarStyle}>
        <div className={searchFieldWrapStyle}>
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="어디로 떠나고 싶으신가요?"
            autoFocus
          />
        </div>
        <button type="button" className={cancelButtonStyle} onClick={handleCancel}>
          취소
        </button>
      </div>

      <div className={bodyStyle}>
        {showResults ? (
          renderSearchResults()
        ) : (
          <>
            <section className={sectionStyle} aria-labelledby="search-popular-title">
              <h2 id="search-popular-title" className={sectionTitleStyle}>
                인기 검색어
              </h2>
              <div className={chipWrapStyle}>
                {POPULAR_KEYWORDS.map((keyword) => (
                  <Chip
                    key={keyword}
                    size="md"
                    colorScheme="neutral"
                    isSelected
                    onClick={() => handleSelectKeyword(keyword)}
                  >
                    {keyword}
                  </Chip>
                ))}
              </div>
            </section>

            {recentSearches.length > 0 ? (
              <section className={sectionStyle} aria-labelledby="search-recent-title">
                <h2 id="search-recent-title" className={sectionTitleStyle}>
                  최근 검색
                </h2>
                <ul className={recentListStyle}>
                  {recentSearches.map((term) => (
                    <li key={term} className={recentItemStyle}>
                      <button
                        type="button"
                        className={recentButtonStyle}
                        onClick={() => handleSelectKeyword(term)}
                      >
                        <span className={recentIconStyle} aria-hidden>
                          <Clock size={18} strokeWidth={1.75} />
                        </span>
                        <span className={recentLabelStyle}>{term}</span>
                      </button>
                      <button
                        type="button"
                        className={removeButtonStyle}
                        aria-label={`${term} 삭제`}
                        onClick={() => handleRemoveRecent(term)}
                      >
                        <X size={14} aria-hidden />
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </>
        )}
      </div>
    </div>
  )
}
