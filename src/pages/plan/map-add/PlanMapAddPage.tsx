import { differenceInCalendarDays, parse } from 'date-fns'
import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Button } from '@/components/ui/Button/Button'
import { Chip } from '@/components/ui/Chip/Chip'
import { Loading } from '@/components/ui/Loading/Loading'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { toast } from '@/components/ui/Toast/Toast'
import { ROUTES } from '@/constants'
import { MOCK_PLACES } from '@/data/mockExplore'
import { usePlanQuery, useUpdatePlanItineraryMutation } from '@/features/plans/hooks'
import {
  dayRowStyle,
  detailCardStyle,
  detailCategoryStyle,
  detailTitleStyle,
  emptyMapStateStyle,
  emptyStateStyle,
  emptyStateTextStyle,
  mapAreaStyle,
  pageStyle,
  pinButtonRecipe,
  pinDotStyle,
} from './PlanMapAddPage.css.ts'

const DATE_FORMAT = 'yyyy.MM.dd'

function pinPosition(placeId: string, salt: number) {
  let hash = 0
  for (let i = 0; i < placeId.length; i += 1) {
    hash = (hash * 31 + placeId.charCodeAt(i) + salt) >>> 0
  }
  return 15 + (hash % 70)
}

export function PlanMapAddPage() {
  const { planId = '' } = useParams<{ planId: string }>()
  const navigate = useNavigate()
  const { data: plan, isLoading } = usePlanQuery(planId)
  const updateItineraryMutation = useUpdatePlanItineraryMutation()

  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null)
  const [selectedDay, setSelectedDay] = useState(1)

  const dayCount = useMemo(() => {
    if (!plan) return 1
    const start = parse(plan.startDate, DATE_FORMAT, new Date())
    const end = parse(plan.endDate, DATE_FORMAT, new Date())
    return Math.max(differenceInCalendarDays(end, start) + 1, 1)
  }, [plan])

  const unassignedPlaceIds = useMemo(() => {
    if (!plan) return []
    const assigned = new Set(Object.values(plan.itinerary).flat())
    return plan.waypointPlaceIds.filter((placeId) => !assigned.has(placeId))
  }, [plan])

  const activeSelectedPlaceId =
    selectedPlaceId && unassignedPlaceIds.includes(selectedPlaceId)
      ? selectedPlaceId
      : (unassignedPlaceIds[0] ?? null)

  const selectedPlace = activeSelectedPlaceId
    ? MOCK_PLACES.find((place) => place.id === activeSelectedPlaceId)
    : undefined

  const goBack = () => navigate(-1)
  const goDone = () => navigate(ROUTES.plan)

  const handleAdd = () => {
    if (!plan || !selectedPlace) return
    const nextItinerary: Record<number, string[]> = { ...plan.itinerary }
    const dayPlaceIds = nextItinerary[selectedDay] ?? []
    nextItinerary[selectedDay] = dayPlaceIds.includes(selectedPlace.id)
      ? dayPlaceIds
      : [...dayPlaceIds, selectedPlace.id]

    updateItineraryMutation.mutate(
      { planId, itinerary: nextItinerary },
      {
        onSuccess: () => {
          toast.success(`${selectedPlace.title}를 Day ${selectedDay}에 추가했어요`)
        },
        onError: () => {
          toast.error('장소 추가에 실패했어요. 다시 시도해 주세요.')
        },
      },
    )
  }

  return (
    <div>
      <PageHeader title="지도추가" showBack onBack={goBack} />

      {isLoading || !plan ? (
        <Loading label="여행 계획을 불러오는 중…" />
      ) : (
        <div className={pageStyle}>
          <div className={mapAreaStyle}>
            {unassignedPlaceIds.length === 0 ? (
              <span className={emptyMapStateStyle}>배정할 장소가 없어요</span>
            ) : (
              unassignedPlaceIds.map((placeId) => {
                const place = MOCK_PLACES.find((item) => item.id === placeId)
                if (!place) return null
                return (
                  <button
                    key={placeId}
                    type="button"
                    aria-label={place.title}
                    className={pinButtonRecipe({ selected: placeId === activeSelectedPlaceId })}
                    style={{
                      left: `${pinPosition(placeId, 1)}%`,
                      top: `${pinPosition(placeId, 2)}%`,
                    }}
                    onClick={() => setSelectedPlaceId(placeId)}
                  >
                    <span className={pinDotStyle} aria-hidden />
                  </button>
                )
              })
            )}
          </div>

          {selectedPlace ? (
            <>
              <div className={detailCardStyle}>
                <span className={detailTitleStyle}>{selectedPlace.title}</span>
                <span className={detailCategoryStyle}>
                  {selectedPlace.categoryLabel ?? selectedPlace.category}
                </span>
              </div>

              <div className={dayRowStyle}>
                {Array.from({ length: dayCount }, (_, index) => index + 1).map((day) => (
                  <Chip
                    key={day}
                    colorScheme="primary"
                    isSelected={day === selectedDay}
                    onClick={() => setSelectedDay(day)}
                  >
                    Day {day}
                  </Chip>
                ))}
              </div>

              <Button
                fullWidth
                size="lg"
                isLoading={updateItineraryMutation.isPending}
                onClick={handleAdd}
              >
                이 장소 추가하기
              </Button>
            </>
          ) : (
            <div className={emptyStateStyle}>
              <p className={emptyStateTextStyle}>모든 장소를 날짜에 배정했어요.</p>
              <Button fullWidth size="lg" onClick={goDone}>
                완료
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
