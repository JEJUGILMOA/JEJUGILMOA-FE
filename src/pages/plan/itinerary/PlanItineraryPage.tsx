import { addDays, differenceInCalendarDays, format, parse } from 'date-fns'
import { ko } from 'date-fns/locale'
import { ChevronLeft } from 'lucide-react'
import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import { Button } from '@/components/ui/Button/Button'
import { Chip } from '@/components/ui/Chip/Chip'
import { HorizontalScrollArea } from '@/components/ui/HorizontalScrollArea/HorizontalScrollArea'
import { Loading } from '@/components/ui/Loading/Loading'
import { Modal } from '@/components/ui/Modal/Modal'
import { SearchBar } from '@/components/ui/SearchBar/SearchBar'
import { toast } from '@/components/ui/Toast/Toast'
import { PLACE_CATEGORY_LABELS, ROUTES } from '@/constants'
import { MOCK_COURSES, MOCK_PLACES, type MockCourse } from '@/data/mockExplore'
import { usePlanQuery, useUpdatePlanItineraryMutation } from '@/features/plans/hooks'
import { rankNearbyPlaces } from '@/features/plans/nearbyPlaces'
import { ARRIVAL_POINT_BY_TRANSPORT_MODE } from '@/features/plans/transportMode'
import { GATEWAY_ARRIVAL_ID, GATEWAY_DEPARTURE_ID } from '@/utils/mapPinPositions'
import {
  backButtonStyle,
  chipRowStyle,
  courseRowStyle,
  dayPagerFloatStyle,
  emptyTextStyle,
  fieldCloseButtonStyle,
  fieldEditorHeaderStyle,
  fieldEditorStyle,
  fieldHintStyle,
  fieldResultListStyle,
  fieldResultMetaStyle,
  fieldResultRowStyle,
  fieldResultTitleStyle,
  fieldRowStyle,
  gatewayLabelStyle,
  gatewayRowStyle,
  gatewayTimeStyle,
  nextButtonStyle,
  pageRootStyle,
  sectionMetaStyle,
  sectionStyle,
  tabButtonRecipe,
  tabRowStyle,
} from './PlanItineraryPage.css.ts'
import { DayPager } from './components/DayPager'
import { ItineraryBottomSheet } from './components/ItineraryBottomSheet'
import { ItineraryDayMap } from './components/ItineraryDayMap'
import { RecommendedCourseChip } from './components/RecommendedCourseChip'
import { ScheduleList } from './components/ScheduleList'
import { WaypointPlaceRow } from './components/WaypointPlaceRow'

const DATE_FORMAT = 'yyyy.MM.dd'
const ALL_CATEGORY = '전체'
const CATEGORY_FILTERS = [ALL_CATEGORY, ...PLACE_CATEGORY_LABELS]

type RecommendMode = 'popular' | 'nearby'
type SheetTab = 'schedule' | 'recommend'

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
  const [sheetTab, setSheetTab] = useState<SheetTab>('schedule')
  const [recommendQuery, setRecommendQuery] = useState('')
  const [recommendMode, setRecommendMode] = useState<RecommendMode>('popular')
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY)
  const [pendingCourse, setPendingCourse] = useState<MockCourse | null>(null)
  const [isEditingDeparture, setIsEditingDeparture] = useState(false)
  const [departureQuery, setDepartureQuery] = useState('')

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

  const currentDayEntry = plan.itinerary[selectedDay]
  const currentDayPlaceIds = currentDayEntry?.placeIds ?? []

  // 이 Day가 첫/마지막 Day면 공항·항구 도착·출발 지점을 지도 핀으로도 함께 보여준다.
  // (실제 일정 데이터인 plan.itinerary에는 넣지 않고 화면 표시에만 끼워 넣는다 —
  // 드래그·삭제·시간수정 대상이 아니라 위치만 고정된 앵커라서 별도 취급한다.)
  const isFirstDay = selectedDay === 1
  const isLastDay = selectedDay === dayCount
  const gatewayLabel = ARRIVAL_POINT_BY_TRANSPORT_MODE[plan.transportMode]

  const departurePlace = currentDayEntry?.departurePlaceId
    ? { id: currentDayEntry.departurePlaceId, title: placeTitle(currentDayEntry.departurePlaceId) }
    : null

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

  // 이미 어느 Day엔가(장소·출발지·필수 장소로) 쓰인 곳은 추천/검색 후보에서 뺀다 —
  // 같은 장소가 여러 Day에 중복 배정되는 걸 막는다.
  const assignedEverywhere = new Set(
    Object.values(plan.itinerary).flatMap((day) => [
      ...(day.departurePlaceId ? [day.departurePlaceId] : []),
      ...(day.mustVisitPlaceId ? [day.mustVisitPlaceId] : []),
      ...day.placeIds,
    ]),
  )
  const candidatePlaces = MOCK_PLACES.filter((place) => !assignedEverywhere.has(place.id))

  // "가까운 장소"는 이 Day의 출발지·필수 장소·이미 담은 장소를 기준으로 추천한다.
  const referencePlaceIds = [
    ...(currentDayEntry?.departurePlaceId ? [currentDayEntry.departurePlaceId] : []),
    ...(currentDayEntry?.mustVisitPlaceId ? [currentDayEntry.mustVisitPlaceId] : []),
    ...currentDayPlaceIds,
  ]
  const nearbyRanked = rankNearbyPlaces(referencePlaceIds, candidatePlaces)
  const travelLabelByPlaceId = new Map(nearbyRanked.map((item) => [item.place.id, item.travelLabel]))

  const matchesCategory = (category: string) => activeCategory === ALL_CATEGORY || category === activeCategory

  const trimmedRecommendQuery = recommendQuery.trim()
  const recommendSearchResults = trimmedRecommendQuery
    ? candidatePlaces.filter((place) => {
        const keyword = trimmedRecommendQuery.toLowerCase()
        return (
          place.title.toLowerCase().includes(keyword) || place.location.toLowerCase().includes(keyword)
        )
      })
    : null

  const recommendedPlaces =
    recommendSearchResults ??
    (recommendMode === 'popular'
      ? candidatePlaces.filter((place) => matchesCategory(place.category))
      : nearbyRanked.filter((item) => matchesCategory(item.place.category)).map((item) => item.place))

  const showTravelLabel = !trimmedRecommendQuery && recommendMode === 'nearby'

  const mapStops = [
    ...(isFirstDay ? [{ id: GATEWAY_ARRIVAL_ID, title: `${gatewayLabel} 도착` }] : []),
    ...stops,
    ...(isLastDay ? [{ id: GATEWAY_DEPARTURE_ID, title: `${gatewayLabel} 출발` }] : []),
  ]
  // 탭은 바텀시트 안 내용만 나눈다 — 지도 자체는 네이버맵처럼 어느 탭에 있든 늘
  // 오늘 동선 + 추천 핀을 함께 보여준다.
  const unassignedPlacesForMap = recommendedPlaces.map((place) => ({ id: place.id, title: place.title }))

  const persistDay = (
    updates: Partial<{
      departurePlaceId: string | null
      mustVisitPlaceId: string | null
      placeIds: string[]
    }>,
    onSuccessMessage?: string,
  ) => {
    const nextItinerary = {
      ...plan.itinerary,
      [selectedDay]: {
        departurePlaceId: currentDayEntry?.departurePlaceId ?? null,
        mustVisitPlaceId: currentDayEntry?.mustVisitPlaceId ?? null,
        placeIds: currentDayPlaceIds,
        ...updates,
      },
    }
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
    persistDay({ placeIds: nextOrderIds })
  }

  const handleRemove = (id: string) => {
    persistDay(
      { placeIds: currentDayPlaceIds.filter((placeId) => placeId !== id) },
      `${placeTitle(id)}를 Day ${selectedDay} 일정에서 뺐어요`,
    )
  }

  const handleAssign = (id: string) => {
    if (currentDayPlaceIds.includes(id)) return
    persistDay({ placeIds: [...currentDayPlaceIds, id] }, `${placeTitle(id)}를 Day ${selectedDay}에 담았어요`)
  }

  const confirmAddCourse = () => {
    if (!pendingCourse) return
    const coursePlaceIds = pendingCourse.steps
      .map((step) => step.placeId)
      .filter(
        (placeId) =>
          MOCK_PLACES.some((place) => place.id === placeId) && !currentDayPlaceIds.includes(placeId),
      )

    if (coursePlaceIds.length > 0) {
      persistDay(
        { placeIds: [...currentDayPlaceIds, ...coursePlaceIds] },
        `${pendingCourse.title}의 경유지를 Day ${selectedDay}에 담았어요`,
      )
    }
    setPendingCourse(null)
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
    persistDay({ placeIds: sortedPlaceIds })
  }

  const trimmedDepartureQuery = departureQuery.trim()
  const departureSearchResults = trimmedDepartureQuery
    ? MOCK_PLACES.filter((place) => {
        const keyword = trimmedDepartureQuery.toLowerCase()
        return (
          place.title.toLowerCase().includes(keyword) || place.location.toLowerCase().includes(keyword)
        )
      })
    : []

  const handleSelectDeparture = (id: string) => {
    persistDay({ departurePlaceId: id }, '출발지를 저장했어요')
    setIsEditingDeparture(false)
    setDepartureQuery('')
  }

  const finishEditing = () => {
    toast.success('일정을 저장했어요')
    navigate(fromPreview ? ROUTES.planPreview(planId) : ROUTES.planBudget(planId))
  }

  // 마지막 Day가 아니면 '다음'은 이 화면 안에서 다음 Day로만 넘기고(출발지·필수 장소는
  // 이 화면 안에서 언제든 인라인으로 정할 수 있다), 마지막 Day에서 눌러야 이 화면을
  // 마치고 다음 단계(또는 미리보기)로 넘어간다.
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
      <ItineraryDayMap
        departurePlace={departurePlace}
        stops={mapStops}
        unassignedPlaces={unassignedPlacesForMap}
        unassignedPinKind={recommendMode}
        onAssignPlace={handleAssign}
      />

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
        <div className={tabRowStyle}>
          <button
            type="button"
            className={tabButtonRecipe({ active: sheetTab === 'schedule' })}
            onClick={() => setSheetTab('schedule')}
          >
            일정
          </button>
          <button
            type="button"
            className={tabButtonRecipe({ active: sheetTab === 'recommend' })}
            onClick={() => setSheetTab('recommend')}
          >
            추천·검색
          </button>
        </div>

        {sheetTab === 'schedule' ? (
          <div className={sectionStyle}>
            {isFirstDay ? (
              <div className={gatewayRowStyle}>
                <span className={gatewayLabelStyle}>🛬 {gatewayLabel} 도착</span>
                <span className={gatewayTimeStyle}>{plan.arrivalTime}</span>
              </div>
            ) : null}

            {isEditingDeparture ? (
              <div className={fieldEditorStyle}>
                <div className={fieldEditorHeaderStyle}>
                  <span className={sectionMetaStyle}>Day {selectedDay}, 어디서 출발하시나요?</span>
                  <button
                    type="button"
                    className={fieldCloseButtonStyle}
                    onClick={() => {
                      setIsEditingDeparture(false)
                      setDepartureQuery('')
                    }}
                  >
                    닫기
                  </button>
                </div>
                <SearchBar
                  value={departureQuery}
                  onChange={setDepartureQuery}
                  placeholder="장소, 주소를 검색해보세요"
                  autoFocus
                />
                {trimmedDepartureQuery ? (
                  <div className={fieldResultListStyle}>
                    {departureSearchResults.length === 0 ? (
                      <p className={emptyTextStyle}>검색 결과가 없어요.</p>
                    ) : (
                      departureSearchResults.map((place) => (
                        <button
                          key={place.id}
                          type="button"
                          className={fieldResultRowStyle}
                          onClick={() => handleSelectDeparture(place.id)}
                        >
                          <span className={fieldResultTitleStyle}>{place.title}</span>
                          <span className={fieldResultMetaStyle}>{place.location}</span>
                        </button>
                      ))
                    )}
                  </div>
                ) : null}
              </div>
            ) : (
              <button type="button" className={fieldRowStyle} onClick={() => setIsEditingDeparture(true)}>
                <span className={gatewayLabelStyle}>
                  {departurePlace ? `🚩 출발지: ${departurePlace.title}` : '🚩 출발지 설정하기'}
                </span>
                <span className={fieldHintStyle}>{departurePlace ? '변경' : '설정'}</span>
              </button>
            )}

            {scheduleItems.length === 0 ? (
              <p className={emptyTextStyle}>아직 배정된 장소가 없어요. "추천·검색" 탭에서 담아보세요.</p>
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
        ) : (
          <div className={sectionStyle}>
            <span className={sectionMetaStyle}>고르면 바로 Day {selectedDay}에 담겨요</span>

            <SearchBar
              value={recommendQuery}
              onChange={setRecommendQuery}
              placeholder="장소, 주소를 검색해보세요"
            />

            {!trimmedRecommendQuery ? (
              <>
                <HorizontalScrollArea>
                  <div className={courseRowStyle}>
                    {MOCK_COURSES.map((course) => (
                      <RecommendedCourseChip
                        key={course.id}
                        title={course.title}
                        meta={course.summary}
                        onClick={() => setPendingCourse(course)}
                      />
                    ))}
                  </div>
                </HorizontalScrollArea>

                <div className={chipRowStyle}>
                  <Chip
                    colorScheme="primary"
                    isSelected={recommendMode === 'popular'}
                    onClick={() => setRecommendMode('popular')}
                  >
                    유명한 장소
                  </Chip>
                  <Chip
                    colorScheme="primary"
                    isSelected={recommendMode === 'nearby'}
                    onClick={() => setRecommendMode('nearby')}
                    disabled={referencePlaceIds.length === 0}
                  >
                    가까운 장소
                  </Chip>
                </div>

                <HorizontalScrollArea>
                  <div className={courseRowStyle}>
                    {CATEGORY_FILTERS.map((category) => (
                      <Chip
                        key={category}
                        colorScheme="primary"
                        isSelected={category === activeCategory}
                        onClick={() => setActiveCategory(category)}
                      >
                        {category}
                      </Chip>
                    ))}
                  </div>
                </HorizontalScrollArea>
              </>
            ) : null}

            {recommendMode === 'nearby' && !trimmedRecommendQuery && referencePlaceIds.length === 0 ? (
              <p className={emptyTextStyle}>출발지나 장소를 먼저 담아야 가까운 장소를 추천해드릴 수 있어요.</p>
            ) : recommendedPlaces.length === 0 ? (
              <p className={emptyTextStyle}>표시할 장소가 없어요.</p>
            ) : (
              recommendedPlaces.map((place) => (
                <WaypointPlaceRow
                  key={place.id}
                  title={place.title}
                  category={
                    showTravelLabel && travelLabelByPlaceId.get(place.id)
                      ? `${place.categoryLabel ?? place.category} · ${travelLabelByPlaceId.get(place.id)}`
                      : (place.categoryLabel ?? place.category)
                  }
                  added={false}
                  onToggle={() => handleAssign(place.id)}
                />
              ))
            )}
          </div>
        )}

        <Button fullWidth size="lg" isLoading={updateItineraryMutation.isPending} onClick={handleNext}>
          {nextLabel}
        </Button>
      </ItineraryBottomSheet>

      <Modal
        open={pendingCourse !== null}
        title={pendingCourse ? `${pendingCourse.title}의 경유지를 모두 담을까요?` : ''}
        description={pendingCourse?.summary}
        onClose={() => setPendingCourse(null)}
        actions={[
          { label: '취소', variant: 'ghost', onClick: () => setPendingCourse(null) },
          { label: '담기', variant: 'primary', onClick: confirmAddCourse },
        ]}
      />
    </div>
  )
}
