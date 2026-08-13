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
import { ARRIVAL_POINT_BY_TRANSPORT_MODE } from '@/features/plans/transportMode'
import { GATEWAY_ARRIVAL_ID, GATEWAY_DEPARTURE_ID } from '@/utils/mapPinPositions'
import {
  assignButtonStyle,
  backButtonStyle,
  dayPagerFloatStyle,
  emptyTextStyle,
  gatewayLabelStyle,
  gatewayRowStyle,
  gatewayTimeStyle,
  nextButtonStyle,
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

const DAY_START_MINUTES = 9 * 60
const STOP_INTERVAL_MINUTES = 90
/** 도착 직후 바로 일정을 시작하지 않도록 두는 여유 시간(수하물 수령·이동 등) */
const ARRIVAL_BUFFER_MINUTES = 60
/** 출발 전 공항/항구에 도착해 있어야 하는 여유 시간 */
const DEPARTURE_BUFFER_MINUTES = 90

function parseTimeToMinutes(time: string) {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

function formatMinutesToTime(totalMinutes: number) {
  const dayMinutes = 24 * 60
  const normalized = ((totalMinutes % dayMinutes) + dayMinutes) % dayMinutes
  const hours = Math.floor(normalized / 60)
  const minutes = normalized % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

/**
 * Day 일정의 기본(자동) 방문 시각을 계산한다.
 * 첫째 날은 도착 시각 이후로, 마지막 날은 출발 시각 전에 끝나도록(필요하면 방문
 * 간격을 좁혀서) 맞춘다. 첫날이자 마지막 날(당일치기)이면 두 제약을 함께 적용한다.
 */
function computeScheduleTimes(
  stopCount: number,
  options: { isFirstDay: boolean; isLastDay: boolean; arrivalTime: string; departureTime: string },
) {
  if (stopCount === 0) return []

  const { isFirstDay, isLastDay, arrivalTime, departureTime } = options

  let dayStart = isFirstDay
    ? Math.max(DAY_START_MINUTES, parseTimeToMinutes(arrivalTime) + ARRIVAL_BUFFER_MINUTES)
    : DAY_START_MINUTES

  let interval = STOP_INTERVAL_MINUTES

  if (isLastDay) {
    const dayEndLimit = parseTimeToMinutes(departureTime) - DEPARTURE_BUFFER_MINUTES

    if (stopCount === 1) {
      dayStart = Math.min(dayStart, dayEndLimit)
    } else {
      const span = dayEndLimit - dayStart
      interval = Math.max(30, Math.min(STOP_INTERVAL_MINUTES, Math.floor(span / (stopCount - 1))))
    }
  }

  return Array.from({ length: stopCount }, (_, index) => formatMinutesToTime(dayStart + index * interval))
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

  // 이 Day가 첫/마지막 Day면 공항·항구 도착·출발 지점을 지도 핀으로도 함께 보여준다.
  // (실제 일정 데이터인 plan.itinerary에는 넣지 않고 화면 표시에만 끼워 넣는다 —
  // 드래그·삭제·시간수정 대상이 아니라 위치만 고정된 앵커라서 별도 취급한다.)
  const isFirstDay = selectedDay === 1
  const isLastDay = selectedDay === dayCount
  const gatewayLabel = ARRIVAL_POINT_BY_TRANSPORT_MODE[plan.transportMode]

  const stops = currentDayPlaceIds.map((id) => ({ id, title: placeTitle(id) }))
  const stopTimes = computeScheduleTimes(currentDayPlaceIds.length, {
    isFirstDay,
    isLastDay,
    arrivalTime: plan.arrivalTime,
    departureTime: plan.departureTime,
  })
  const scheduleItems = stops.map((stop, index) => ({
    id: stop.id,
    title: stop.title,
    time: customTimes[stop.id] ?? stopTimes[index],
  }))
  const unassignedPlaces = unassignedPlaceIds.map((id) => ({ id, title: placeTitle(id) }))

  const mapStops = [
    ...(isFirstDay ? [{ id: GATEWAY_ARRIVAL_ID, title: `${gatewayLabel} 도착` }] : []),
    ...stops,
    ...(isLastDay ? [{ id: GATEWAY_DEPARTURE_ID, title: `${gatewayLabel} 출발` }] : []),
  ]

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
      timesById[placeId] = placeId === id ? time : (customTimes[placeId] ?? stopTimes[index])
    })

    setCustomTimes((prev) => ({ ...prev, ...timesById }))

    const sortedPlaceIds = [...currentDayPlaceIds].sort((a, b) =>
      timesById[a].localeCompare(timesById[b]),
    )
    persistItinerary(sortedPlaceIds)
  }

  const finishEditing = () => {
    toast.success('일정을 저장했어요')
    navigate(fromPreview ? ROUTES.planPreview(planId) : ROUTES.planBudget(planId))
  }

  // 마지막 Day가 아니면 '다음'은 다음 Day로 이동만 하고, 마지막 Day에서 눌러야
  // 이 화면을 마치고 다음 단계(또는 미리보기)로 넘어간다 — 그래야 각 Day를
  // 다 훑어보고 나서 저장하게 된다.
  const handleNext = () => {
    if (!isLastDay) {
      setSelectedDay((day) => Math.min(day + 1, dayCount))
      return
    }
    finishEditing()
  }

  const nextLabel = isLastDay && fromPreview ? '저장하기' : '다음'

  return (
    <div className={pageRootStyle}>
      <ItineraryDayMap stops={mapStops} unassignedPlaces={unassignedPlaces} onAssignPlace={handleAssign} />

      <button type="button" className={backButtonStyle} onClick={goBack} aria-label="뒤로 가기">
        <ChevronLeft size={22} />
      </button>

      <button type="button" className={nextButtonStyle} onClick={handleNext}>
        {nextLabel}
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
          {isFirstDay ? (
            <div className={gatewayRowStyle}>
              <span className={gatewayLabelStyle}>🛬 {gatewayLabel} 도착</span>
              <span className={gatewayTimeStyle}>{plan.arrivalTime}</span>
            </div>
          ) : null}

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

          {isLastDay ? (
            <div className={gatewayRowStyle}>
              <span className={gatewayLabelStyle}>🛫 {gatewayLabel} 출발</span>
              <span className={gatewayTimeStyle}>{plan.departureTime}</span>
            </div>
          ) : null}
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
          {nextLabel}
        </Button>
      </ItineraryBottomSheet>
    </div>
  )
}
