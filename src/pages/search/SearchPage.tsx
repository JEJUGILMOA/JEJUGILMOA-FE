import { useMemo, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { Car, Clock, Coffee, MapPin, X, type LucideIcon } from 'lucide-react'
import { Chip } from '@/components/ui/Chip/Chip'
import { Empty } from '@/components/ui/Empty/Empty'
import { SearchBar } from '@/components/ui/SearchBar/SearchBar'
import { placePath } from '@/constants'
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
  resultDistanceStyle,
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

type SearchResultKind = 'attraction' | 'cafe' | 'parking'

type SearchResult = {
  id: string
  placeId: string
  title: string
  category: string
  location: string
  distance: string
  kind: SearchResultKind
}

const INITIAL_RECENT = ['협재 해수욕장', '오설록 티뮤지엄', '성산일출봉', '애월 카페거리']

const POPULAR_KEYWORDS = ['성산일출봉', '애월 카페거리', '동문시장', '한라산', '흑돼지 맛집']

const MOCK_SEARCH_RESULTS: SearchResult[] = [
  {
    id: 'hyeopjae-beach',
    placeId: 'hyeopjae-beach',
    title: '협재 해수욕장',
    category: '관광지',
    location: '제주 한림읍',
    distance: '2.1km',
    kind: 'attraction',
  },
  {
    id: 'hyeopjae-cafe-street',
    placeId: 'hallim-cafe',
    title: '협재 카페거리',
    category: '카페',
    location: '제주 한림읍',
    distance: '2.4km',
    kind: 'cafe',
  },
  {
    id: 'hyeopjae-parking',
    placeId: 'hyeopjae-beach',
    title: '협재 해수욕장 주차장',
    category: '주차장',
    location: '제주 한림읍',
    distance: '2.0km',
    kind: 'parking',
  },
  {
    id: 'hyeopjae-coast',
    placeId: 'olle-trail',
    title: '협재 해안도로',
    category: '관광지',
    location: '제주 한림읍',
    distance: '3.5km',
    kind: 'attraction',
  },
  {
    id: 'dongmun',
    placeId: 'dongmun',
    title: '동문 시장',
    category: '전통시장',
    location: '제주시 일도일동',
    distance: '12.4km',
    kind: 'attraction',
  },
  {
    id: 'hallim-cafe',
    placeId: 'hallim-cafe',
    title: '한림 해안 카페',
    category: '카페',
    location: '제주 한림읍',
    distance: '2.8km',
    kind: 'cafe',
  },
]

const KIND_ICON: Record<SearchResultKind, LucideIcon> = {
  attraction: MapPin,
  cafe: Coffee,
  parking: Car,
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
  const showResults = trimmedQuery.length > 0

  const results = useMemo(() => {
    if (!showResults) return []
    const lower = trimmedQuery.toLowerCase()
    return MOCK_SEARCH_RESULTS.filter((item) => item.title.toLowerCase().includes(lower))
  }, [showResults, trimmedQuery])

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

  const handleSelectResult = (result: SearchResult) => {
    pushRecent(result.title)
    navigate(placePath(result.placeId))
  }

  const handleRemoveRecent = (term: string) => {
    setRecentSearches((prev) => prev.filter((item) => item !== term))
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
          results.length > 0 ? (
            <ul className={resultListStyle}>
              {results.map((result) => {
                const Icon = KIND_ICON[result.kind]
                return (
                  <li key={result.id}>
                    <button
                      type="button"
                      className={resultItemStyle}
                      onClick={() => handleSelectResult(result)}
                    >
                      <span className={resultIconStyle} aria-hidden>
                        <Icon size={18} strokeWidth={1.75} />
                      </span>
                      <span className={resultContentStyle}>
                        <span className={resultTitleStyle}>
                          {highlightMatch(result.title, trimmedQuery)}
                        </span>
                        <span className={resultMetaStyle}>
                          {result.category} · {result.location}
                        </span>
                      </span>
                      <span className={resultDistanceStyle}>{result.distance}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          ) : (
            <Empty
              title="검색 결과가 없어요"
              description="다른 키워드로 다시 찾아보세요."
            />
          )
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
