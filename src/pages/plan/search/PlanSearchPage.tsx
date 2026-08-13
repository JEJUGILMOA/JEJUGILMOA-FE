import { useMemo, useState, type ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Clock, MapPin, X } from 'lucide-react'
import { Chip } from '@/components/ui/Chip/Chip'
import { Empty } from '@/components/ui/Empty/Empty'
import { Loading } from '@/components/ui/Loading/Loading'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { SearchBar } from '@/components/ui/SearchBar/SearchBar'
import { toast } from '@/components/ui/Toast/Toast'
import { ROUTES } from '@/constants'
import { MOCK_PLACES } from '@/data/mockExplore'
import { usePlanQuery, useUpdatePlanWaypointsMutation } from '@/features/plans/hooks'
import {
  addedLinkStyle,
  addLinkStyle,
  chipWrapStyle,
  doneLinkStyle,
  infoColumnStyle,
  listStyle,
  matchStyle,
  pageStyle,
  recentButtonStyle,
  recentIconStyle,
  recentItemStyle,
  recentLabelStyle,
  removeButtonStyle,
  recentListStyle,
  resultIconStyle,
  rowAddressStyle,
  rowStyle,
  rowTitleStyle,
  searchBarGrowStyle,
  sectionStyle,
  sectionTitleStyle,
  topBarStyle,
} from './PlanSearchPage.css.ts'

const POPULAR_KEYWORDS = ['성산일출봉', '협재 해수욕장', '애월 카페거리', '동문 시장', '한라산']

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

export function PlanSearchPage() {
  const { planId = '' } = useParams<{ planId: string }>()
  const navigate = useNavigate()
  const { data: plan, isLoading } = usePlanQuery(planId)
  const updateWaypointsMutation = useUpdatePlanWaypointsMutation()

  const [query, setQuery] = useState('')
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  const trimmedQuery = query.trim()
  const showResults = trimmedQuery.length > 0

  const results = useMemo(() => {
    if (!showResults) return []
    const keyword = trimmedQuery.toLowerCase()
    return MOCK_PLACES.filter(
      (place) =>
        place.title.toLowerCase().includes(keyword) || place.location.toLowerCase().includes(keyword),
    )
  }, [showResults, trimmedQuery])

  const pushRecent = (term: string) => {
    const next = term.trim()
    if (!next) return
    setRecentSearches((prev) => [next, ...prev.filter((item) => item !== next)].slice(0, 8))
  }

  const handleSelectKeyword = (term: string) => {
    setQuery(term)
    pushRecent(term)
  }

  const handleRemoveRecent = (term: string) => {
    setRecentSearches((prev) => prev.filter((item) => item !== term))
  }

  const toggleAdd = (placeId: string, placeTitle: string) => {
    if (!plan) return
    pushRecent(placeTitle)
    const nextWaypointPlaceIds = plan.waypointPlaceIds.includes(placeId)
      ? plan.waypointPlaceIds.filter((id) => id !== placeId)
      : [...plan.waypointPlaceIds, placeId]

    updateWaypointsMutation.mutate(
      { planId, waypointPlaceIds: nextWaypointPlaceIds },
      {
        onError: () => {
          toast.error('장소 추가에 실패했어요. 다시 시도해 주세요.')
        },
      },
    )
  }

  const goBack = () => navigate(-1)
  const goDone = () => navigate(ROUTES.planMapAdd(planId))

  return (
    <div>
      <PageHeader
        title="장소 검색"
        showBack
        onBack={goBack}
        rightSlot={
          <button type="button" className={doneLinkStyle} onClick={goDone}>
            완료
          </button>
        }
      />

      {isLoading || !plan ? (
        <Loading label="여행 계획을 불러오는 중…" />
      ) : (
        <div className={pageStyle}>
          <div className={topBarStyle}>
            <SearchBar
              className={searchBarGrowStyle}
              value={query}
              onChange={setQuery}
              placeholder="장소, 주소를 검색해보세요"
              autoFocus
            />
          </div>

          {showResults ? (
            <div className={listStyle}>
              {results.length === 0 ? (
                <Empty title="검색 결과가 없어요" description="다른 키워드로 다시 찾아보세요." />
              ) : (
                results.map((place) => {
                  const added = plan.waypointPlaceIds.includes(place.id)
                  return (
                    <div key={place.id} className={rowStyle}>
                      <span className={resultIconStyle} aria-hidden>
                        <MapPin size={18} strokeWidth={1.75} />
                      </span>
                      <div className={infoColumnStyle}>
                        <span className={rowTitleStyle}>{highlightMatch(place.title, trimmedQuery)}</span>
                        <span className={rowAddressStyle}>
                          {place.categoryLabel ?? place.category} · {place.location}
                        </span>
                      </div>
                      <button
                        type="button"
                        className={added ? addedLinkStyle : addLinkStyle}
                        onClick={() => toggleAdd(place.id, place.title)}
                      >
                        {added ? '담김 ✓' : '추가'}
                      </button>
                    </div>
                  )
                })
              )}
            </div>
          ) : (
            <>
              <section className={sectionStyle} aria-labelledby="plan-search-popular-title">
                <h2 id="plan-search-popular-title" className={sectionTitleStyle}>
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
                <section className={sectionStyle} aria-labelledby="plan-search-recent-title">
                  <h2 id="plan-search-recent-title" className={sectionTitleStyle}>
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
      )}
    </div>
  )
}
