import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
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
  doneLinkStyle,
  emptyStateStyle,
  infoColumnStyle,
  listStyle,
  pageStyle,
  rowAddressStyle,
  rowStyle,
  rowTitleStyle,
  searchBarGrowStyle,
  topBarStyle,
} from './PlanSearchPage.css.ts'

export function PlanSearchPage() {
  const { planId = '' } = useParams<{ planId: string }>()
  const navigate = useNavigate()
  const { data: plan, isLoading } = usePlanQuery(planId)
  const updateWaypointsMutation = useUpdatePlanWaypointsMutation()

  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    if (!keyword) return []
    return MOCK_PLACES.filter(
      (place) =>
        place.title.toLowerCase().includes(keyword) || place.location.toLowerCase().includes(keyword),
    )
  }, [query])

  const toggleAdd = (placeId: string) => {
    if (!plan) return
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
  const goDone = () => navigate(ROUTES.plan)

  return (
    <div>
      <PageHeader title="장소 검색" showBack onBack={goBack} />

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
            <button type="button" className={doneLinkStyle} onClick={goDone}>
              완료
            </button>
          </div>

          <div className={listStyle}>
            {query.trim() === '' ? null : results.length === 0 ? (
              <p className={emptyStateStyle}>검색 결과가 없어요.</p>
            ) : (
              results.map((place) => {
                const added = plan.waypointPlaceIds.includes(place.id)
                return (
                  <div key={place.id} className={rowStyle}>
                    <div className={infoColumnStyle}>
                      <span className={rowTitleStyle}>{place.title}</span>
                      <span className={rowAddressStyle}>{place.location}</span>
                    </div>
                    <button
                      type="button"
                      className={added ? addedLinkStyle : addLinkStyle}
                      onClick={() => toggleAdd(place.id)}
                    >
                      {added ? '담김 ✓' : '추가'}
                    </button>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
