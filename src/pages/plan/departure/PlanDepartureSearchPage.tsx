import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Loading } from '@/components/ui/Loading/Loading'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { SearchBar } from '@/components/ui/SearchBar/SearchBar'
import { toast } from '@/components/ui/Toast/Toast'
import { ROUTES } from '@/constants'
import { MOCK_PLACES } from '@/data/mockExplore'
import { usePlanQuery, useUpdatePlanItineraryMutation } from '@/features/plans/hooks'
import {
  descriptionStyle,
  doneLinkStyle,
  emptyTextStyle,
  headerBlockStyle,
  infoColumnStyle,
  listStyle,
  pageStyle,
  rowMetaStyle,
  rowStyle,
  rowTitleStyle,
  selectedCardMetaStyle,
  selectedCardStyle,
  selectedCardTitleStyle,
  thumbnailStyle,
  titleStyle,
} from './PlanDepartureSearchPage.css.ts'

function placeById(placeId: string) {
  return MOCK_PLACES.find((place) => place.id === placeId)
}

/** Day의 출발 장소(숙소 등)를 검색해서 고르는 화면. 계획을 처음 만든 직후엔 Day 1을 위해,
 * 이후엔 일정편집에서 한 Day를 마치고 "다음"을 누를 때마다 다음 Day를 위해 들어온다.
 * 해당 Day의 departurePlaceId로 저장되고, "가까운 장소" 추천 기준으로 쓰인다. */
export function PlanDepartureSearchPage() {
  const { planId = '', day: dayParam } = useParams<{ planId: string; day: string }>()
  const day = Math.max(Number(dayParam) || 1, 1)
  const navigate = useNavigate()
  const { data: plan, isLoading } = usePlanQuery(planId)
  const updateItineraryMutation = useUpdatePlanItineraryMutation()

  const [query, setQuery] = useState('')
  const trimmedQuery = query.trim()

  const goBack = () => navigate(-1)
  // 일정편집으로 돌아갈 때 지금 정하던 Day가 그대로 보이게 넘겨준다.
  const goToItinerary = () =>
    navigate(ROUTES.planItinerary(planId), { state: { selectedDay: day } })

  const results = useMemo(() => {
    if (!trimmedQuery) return []
    const keyword = trimmedQuery.toLowerCase()
    return MOCK_PLACES.filter(
      (place) =>
        place.title.toLowerCase().includes(keyword) || place.location.toLowerCase().includes(keyword),
    )
  }, [trimmedQuery])

  if (isLoading || !plan) {
    return (
      <div>
        <PageHeader title={`Day ${day} 출발 장소 검색`} showBack onBack={goBack} />
        <Loading label="여행 계획을 불러오는 중…" />
      </div>
    )
  }

  const selectedPlaceId = plan.itinerary[day]?.departurePlaceId ?? null
  const selectedPlace = selectedPlaceId ? placeById(selectedPlaceId) : null

  const handleSelect = (placeId: string) => {
    const currentDayEntry = plan.itinerary[day]
    const nextItinerary = {
      ...plan.itinerary,
      [day]: {
        departurePlaceId: placeId,
        mustVisitPlaceId: currentDayEntry?.mustVisitPlaceId ?? null,
        placeIds: currentDayEntry?.placeIds ?? [],
      },
    }
    updateItineraryMutation.mutate(
      { planId, itinerary: nextItinerary },
      {
        onSuccess: () => {
          toast.success('출발 장소를 저장했어요')
          goToItinerary()
        },
        onError: () => {
          toast.error('저장에 실패했어요. 다시 시도해 주세요.')
        },
      },
    )
  }

  return (
    <div>
      <PageHeader
        title={`Day ${day} 출발 장소 검색`}
        showBack
        onBack={goBack}
        rightSlot={
          <button type="button" className={doneLinkStyle} onClick={goToItinerary}>
            건너뛰기
          </button>
        }
      />

      <div className={pageStyle}>
        <div className={headerBlockStyle}>
          <h2 className={titleStyle}>Day {day}, 어디서 출발하시나요?</h2>
          <p className={descriptionStyle}>
            {day === 1
              ? '숙소나 이 여행의 시작 지점을 검색해주세요.'
              : '전날 묵은 숙소나 그날 시작할 지점을 검색해주세요.'}{' '}
            가까운 장소를 추천할 때 기준으로 써요.
          </p>
        </div>

        <SearchBar value={query} onChange={setQuery} placeholder="장소, 주소를 검색해보세요" autoFocus />

        {selectedPlace && !trimmedQuery ? (
          <div className={selectedCardStyle}>
            <span className={selectedCardTitleStyle}>{selectedPlace.title}</span>
            <span className={selectedCardMetaStyle}>{selectedPlace.location}</span>
          </div>
        ) : null}

        {trimmedQuery ? (
          <div className={listStyle}>
            {results.length === 0 ? (
              <p className={emptyTextStyle}>검색 결과가 없어요.</p>
            ) : (
              results.map((place) => (
                <button
                  key={place.id}
                  type="button"
                  className={rowStyle}
                  onClick={() => handleSelect(place.id)}
                >
                  <span className={thumbnailStyle} aria-hidden />
                  <span className={infoColumnStyle}>
                    <span className={rowTitleStyle}>{place.title}</span>
                    <span className={rowMetaStyle}>{place.location}</span>
                  </span>
                </button>
              ))
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}
