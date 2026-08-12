import { addDays, differenceInCalendarDays, format, parse } from 'date-fns'
import { ko } from 'date-fns/locale'
import { ChevronLeft } from 'lucide-react'
import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import { Button } from '@/components/ui/Button/Button'
import { Loading } from '@/components/ui/Loading/Loading'
import { toast } from '@/components/ui/Toast/Toast'
import { ROUTES } from '@/constants'
import { MOCK_PLACES } from '@/data/mockExplore'
import { usePlanQuery, useUpdatePlanItineraryMutation } from '@/features/plans/hooks'
import {
  assignButtonStyle,
  backButtonStyle,
  dayPagerFloatStyle,
  emptyTextStyle,
  pageRootStyle,
  sectionHeaderStyle,
  sectionMetaStyle,
  sectionStyle,
  sectionTitleStyle,
  unassignedCategoryStyle,
  unassignedInfoStyle,
  unassignedRowStyle,
  unassignedTitleStyle,
} from './PlanItineraryPage.css.ts'
import { DayPager } from './components/DayPager'
import { ItineraryBottomSheet } from './components/ItineraryBottomSheet'
import { ItineraryDayMap } from './components/ItineraryDayMap'
import { ScheduleList } from './components/ScheduleList'

const DATE_FORMAT = 'yyyy.MM.dd'

function formatStopTime(index: number) {
  const totalMinutes = 9 * 60 + index * 90
  const hours = Math.floor(totalMinutes / 60) % 24
  const minutes = totalMinutes % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

function placeTitle(placeId: string) {
  return MOCK_PLACES.find((place) => place.id === placeId)?.title ?? placeId
}

export function PlanItineraryPage() {
  const { planId = '' } = useParams<{ planId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { data: plan, isLoading } = usePlanQuery(planId)
  const updateItineraryMutation = useUpdatePlanItineraryMutation()

  const [selectedDay, setSelectedDay] = useState(1)
  const [customTimes, setCustomTimes] = useState<Record<string, string>>({})

  // 미리보기의 연필 아이콘으로 들어왔으면 저장 후 다음 STEP(예산입력)으로 이어가지 않고
  // 미리보기로 바로 돌아간다 — 이 화면만 고쳐달라고 들어온 거라 나머지 단계를 강제로 거칠 필요가 없다.
  const fromPreview = Boolean((location.state as { fromPreview?: boolean } | null)?.fromPreview)

  const goBack = () => navigate(-1)

  if (isLoading || !plan) {
    return (
      <div className={pageRootStyle}>
        <Loading label="여행 계획을 불러오는 중…" />
      </div>
    )
  }

  const startDate = parse(plan.startDate, DATE_FORMAT, new Date())
  const endDate = parse(plan.endDate, DATE_FORMAT, new Date())
  const dayCount = Math.max(differenceInCalendarDays(endDate, startDate) + 1, 1)
  const dayDateLabel = format(addDays(startDate, selectedDay - 1), 'M.d(EEE)', { locale: ko })

  const currentDayPlaceIds = plan.itinerary[selectedDay] ?? []
  const assignedPlaceIds = new Set(Object.values(plan.itinerary).flat())
  const unassignedPlaceIds = plan.waypointPlaceIds.filter((id) => !assignedPlaceIds.has(id))

  const stops = currentDayPlaceIds.map((id) => ({ id, title: placeTitle(id) }))
  const scheduleItems = stops.map((stop, index) => ({
    id: stop.id,
    title: stop.title,
    time: customTimes[stop.id] ?? formatStopTime(index),
  }))
  const unassignedPlaces = unassignedPlaceIds.map((id) => ({ id, title: placeTitle(id) }))

  const persistItinerary = (nextDayPlaceIds: string[], onSuccessMessage?: string) => {
    const nextItinerary = { ...plan.itinerary, [selectedDay]: nextDayPlaceIds }
    updateItineraryMutation.mutate(
      { planId, itinerary: nextItinerary },
      {
        onSuccess: () => {
          if (onSuccessMessage) toast.success(onSuccessMessage)
        },
        onError: () => {
          toast.error('일정 변경에 실패했어요. 다시 시도해 주세요.')
        },
      },
    )
  }

  const handleReorder = (nextOrderIds: string[]) => {
    persistItinerary(nextOrderIds)
  }

  const handleRemove = (id: string) => {
    persistItinerary(
      currentDayPlaceIds.filter((placeId) => placeId !== id),
      `${placeTitle(id)}를 Day ${selectedDay} 일정에서 뺐어요`,
    )
  }

  const handleAssign = (id: string) => {
    if (currentDayPlaceIds.includes(id)) return
    persistItinerary([...currentDayPlaceIds, id], `${placeTitle(id)}를 Day ${selectedDay}에 담았어요`)
  }

  const handleTimeChange = (id: string, time: string) => {
    // 이 Day의 모든 장소 시간을 먼저 확정(고정)한 뒤, 시간순으로 정렬해서 저장한다.
    // 그래야 순서가 바뀌어도 아직 수정 안 한 장소들의 시간이 인덱스 기반으로 다시
    // 계산되며 흔들리지 않는다.
    const timesById: Record<string, string> = {}
    currentDayPlaceIds.forEach((placeId, index) => {
      timesById[placeId] = placeId === id ? time : (customTimes[placeId] ?? formatStopTime(index))
    })

    setCustomTimes((prev) => ({ ...prev, ...timesById }))

    const sortedPlaceIds = [...currentDayPlaceIds].sort((a, b) =>
      timesById[a].localeCompare(timesById[b]),
    )
    persistItinerary(sortedPlaceIds)
  }

  const handleNext = () => {
    toast.success('일정을 저장했어요')
    navigate(fromPreview ? ROUTES.planPreview(planId) : ROUTES.planBudget(planId))
  }

  return (
    <div className={pageRootStyle}>
      <ItineraryDayMap stops={stops} unassignedPlaces={unassignedPlaces} onAssignPlace={handleAssign} />

      <button type="button" className={backButtonStyle} onClick={goBack} aria-label="뒤로 가기">
        <ChevronLeft size={22} />
      </button>

      <div className={dayPagerFloatStyle}>
        <DayPager
          day={selectedDay}
          totalDays={dayCount}
          dateLabel={dayDateLabel}
          onPrev={() => setSelectedDay((day) => Math.max(day - 1, 1))}
          onNext={() => setSelectedDay((day) => Math.min(day + 1, dayCount))}
        />
      </div>

      <ItineraryBottomSheet title={`Day ${selectedDay} 일정 (${stops.length}곳)`}>
        <div className={sectionStyle}>
          {scheduleItems.length === 0 ? (
            <p className={emptyTextStyle}>아직 배정된 장소가 없어요. 아래에서 담아보세요.</p>
          ) : (
            <ScheduleList
              items={scheduleItems}
              onReorder={handleReorder}
              onRemove={handleRemove}
              onTimeChange={handleTimeChange}
            />
          )}
        </div>

        <div className={sectionStyle}>
          <div className={sectionHeaderStyle}>
            <span className={sectionTitleStyle}>미배정 장소</span>
            <span className={sectionMetaStyle}>{unassignedPlaceIds.length}곳</span>
          </div>

          {unassignedPlaceIds.length === 0 ? (
            <p className={emptyTextStyle}>모든 장소를 Day에 배정했어요.</p>
          ) : (
            unassignedPlaceIds.map((id) => {
              const place = MOCK_PLACES.find((item) => item.id === id)
              if (!place) return null
              return (
                <div key={id} className={unassignedRowStyle}>
                  <div className={unassignedInfoStyle}>
                    <span className={unassignedTitleStyle}>{place.title}</span>
                    <span className={unassignedCategoryStyle}>
                      {place.categoryLabel ?? place.category}
                    </span>
                  </div>
                  <button type="button" className={assignButtonStyle} onClick={() => handleAssign(id)}>
                    Day {selectedDay}에 담기
                  </button>
                </div>
              )
            })
          )}
        </div>

        <Button fullWidth size="lg" isLoading={updateItineraryMutation.isPending} onClick={handleNext}>
          {fromPreview ? '저장하기' : '다음'}
        </Button>
      </ItineraryBottomSheet>
    </div>
  )
}
