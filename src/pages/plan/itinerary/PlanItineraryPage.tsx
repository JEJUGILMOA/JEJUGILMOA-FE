import { addDays, differenceInCalendarDays, format, parse } from 'date-fns'
import { ko } from 'date-fns/locale'
import { ChevronLeft, Search, X } from 'lucide-react'
import { useRef, useState } from 'react'
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
import {
  backButtonStyle,
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
  headerSearchBarStyle,
  headerSearchClearButtonStyle,
  headerSearchIconStyle,
  headerSearchInputStyle,
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
/** Day당 "꼭 가고 싶은 장소"로 정할 수 있는 최대 개수 — 너무 많아지면 앵커의 의미가 없어져 4개로 제한 */
const MAX_MUST_VISIT_PLACES = 4

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

  return Array.from({ length: stopCount }, (_, index) =>
    formatMinutesToTime(dayStart + index * interval),
  )
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
  const [showAnchorPrompt, setShowAnchorPrompt] = useState(false)
  const headerSearchInputRef = useRef<HTMLInputElement>(null)
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

  const isFirstDay = selectedDay === 1
  const isLastDay = selectedDay === dayCount

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
      ...day.mustVisitPlaceIds,
      ...day.placeIds,
    ]),
  )
  const candidatePlaces = MOCK_PLACES.filter((place) => !assignedEverywhere.has(place.id))

  // "가까운 장소"는 이 Day에 꼭 가고 싶은 장소(앵커)를 정해뒀으면 그곳들 기준으로만 추천해서
  // 하루 일정이 그 앵커 주변으로 짜이게 하고, 아직 안 정했으면 출발지·이미 담은 장소로 대신한다.
  const currentDayMustVisitIds = currentDayEntry?.mustVisitPlaceIds ?? []
  // 출발지·필수 장소·일정 중 아무것도 안 정해졌으면 이 Day는 아직 "빈 상태" —
  // 추천이 기준점 없이 막 나오니, 먼저 앵커부터 잡으라고 안내한다.
  const hasAnyDayContent =
    Boolean(departurePlace) || currentDayMustVisitIds.length > 0 || currentDayPlaceIds.length > 0
  const fallbackReferencePlaceIds = [
    ...(currentDayEntry?.departurePlaceId ? [currentDayEntry.departurePlaceId] : []),
    ...currentDayPlaceIds,
  ]
  const referencePlaceIds =
    currentDayMustVisitIds.length > 0 ? currentDayMustVisitIds : fallbackReferencePlaceIds
  const nearbyRanked = rankNearbyPlaces(referencePlaceIds, candidatePlaces)
  const travelLabelByPlaceId = new Map(
    nearbyRanked.map((item) => [item.place.id, item.travelLabel]),
  )
  const nearestPlaceTitleByPlaceId = new Map(
    nearbyRanked.map((item) => [item.place.id, placeTitle(item.nearestToPlaceId)]),
  )

  const matchesCategory = (category: string) =>
    activeCategory === ALL_CATEGORY || category === activeCategory

  const trimmedRecommendQuery = recommendQuery.trim()
  const recommendSearchResults = trimmedRecommendQuery
    ? candidatePlaces.filter((place) => {
        const keyword = trimmedRecommendQuery.toLowerCase()
        return (
          place.title.toLowerCase().includes(keyword) ||
          place.location.toLowerCase().includes(keyword)
        )
      })
    : null

  const recommendedPlaces =
    recommendSearchResults ??
    (recommendMode === 'popular'
      ? candidatePlaces.filter((place) => matchesCategory(place.category))
      : nearbyRanked
          .filter((item) => matchesCategory(item.place.category))
          .map((item) => item.place))

  const showTravelLabel = !trimmedRecommendQuery && recommendMode === 'nearby'

  const mapStops = stops
  // 탭은 바텀시트 안 내용만 나눈다 — 지도 자체는 네이버맵처럼 어느 탭에 있든 늘
  // 오늘 동선 + 추천 핀을 함께 보여준다.
  const unassignedPlacesForMap = recommendedPlaces.map((place) => ({
    id: place.id,
    title: place.title,
  }))

  const persistDay = (
    updates: Partial<{
      departurePlaceId: string | null
      mustVisitPlaceIds: string[]
      placeIds: string[]
    }>,
    onSuccessMessage?: string,
  ) => {
    const nextItinerary = {
      ...plan.itinerary,
      [selectedDay]: {
        departurePlaceId: currentDayEntry?.departurePlaceId ?? null,
        mustVisitPlaceIds: currentDayMustVisitIds,
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

  // "유명한 장소"(전역) 모드에서 담는 건 곧 "1단계에서 고른 꼭 가고 싶은 장소"라, 별도로
  // 별표를 안 찍어도 자동으로 필수 장소가 된다(최대 개수까지). "가까운 장소" 모드로
  // 넘어간 뒤에는 그냥 일반 경유지로만 담긴다.
  const handleAssign = (id: string) => {
    if (currentDayPlaceIds.includes(id)) return
    const shouldMarkMustVisit =
      recommendMode === 'popular' && currentDayMustVisitIds.length < MAX_MUST_VISIT_PLACES
    persistDay(
      {
        placeIds: [...currentDayPlaceIds, id],
        mustVisitPlaceIds: shouldMarkMustVisit
          ? [...currentDayMustVisitIds, id]
          : currentDayMustVisitIds,
      },
      shouldMarkMustVisit
        ? `${placeTitle(id)}를 Day ${selectedDay}의 꼭 가고 싶은 장소로 담았어요`
        : `${placeTitle(id)}를 Day ${selectedDay}에 담았어요`,
    )
  }

  const confirmAddCourse = () => {
    if (!pendingCourse) return
    const coursePlaceIds = pendingCourse.steps
      .map((step) => step.placeId)
      .filter(
        (placeId) =>
          MOCK_PLACES.some((place) => place.id === placeId) &&
          !currentDayPlaceIds.includes(placeId),
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

  // 별 토글: 이미 담긴 장소면 그대로 꼭 가고 싶은 장소로만 정하고, 아직 안 담은
  // 추천/검색 결과면 담으면서 함께 정한다. 같은 곳을 다시 누르면 해제된다.
  // 하루에 너무 많아지면 오히려 "꼭 가야 할 곳"이라는 의미가 흐려지니 최대 MAX_MUST_VISIT_PLACES개까지만 허용한다.
  const handleToggleMustVisit = (id: string) => {
    const isUnsetting = currentDayMustVisitIds.includes(id)

    if (!isUnsetting && currentDayMustVisitIds.length >= MAX_MUST_VISIT_PLACES) {
      toast.error(`꼭 가고 싶은 장소는 Day당 ${MAX_MUST_VISIT_PLACES}곳까지만 정할 수 있어요`)
      return
    }

    const nextMustVisitPlaceIds = isUnsetting
      ? currentDayMustVisitIds.filter((placeId) => placeId !== id)
      : [...currentDayMustVisitIds, id]
    const nextPlaceIds =
      isUnsetting || currentDayPlaceIds.includes(id)
        ? currentDayPlaceIds
        : [...currentDayPlaceIds, id]
    persistDay(
      { mustVisitPlaceIds: nextMustVisitPlaceIds, placeIds: nextPlaceIds },
      isUnsetting
        ? '꼭 가고 싶은 장소 설정을 해제했어요'
        : `${placeTitle(id)}를 Day ${selectedDay}의 꼭 가고 싶은 장소로 정했어요`,
    )
  }

  const trimmedDepartureQuery = departureQuery.trim()
  const departureSearchResults = trimmedDepartureQuery
    ? MOCK_PLACES.filter((place) => {
        const keyword = trimmedDepartureQuery.toLowerCase()
        return (
          place.title.toLowerCase().includes(keyword) ||
          place.location.toLowerCase().includes(keyword)
        )
      })
    : []

  const handleSelectDeparture = (id: string) => {
    persistDay({ departurePlaceId: id }, '출발지를 저장했어요')
    setIsEditingDeparture(false)
    setDepartureQuery('')
  }

  // 헤더 검색창은 탭과 무관하게 항상 떠 있어서, "일정" 탭을 보다가 검색을 시작해도
  // 결과가 바로 보이도록 "추천·검색" 탭으로 전환해준다.
  const handleRecommendQueryChange = (value: string) => {
    setRecommendQuery(value)
    if (value.trim()) setSheetTab('recommend')
  }

  // 네이버맵처럼 지도를 탭하면 검색에서 빠져나가 일반 추천 탭으로 돌아간다.
  const handleTapMap = () => {
    if (!recommendQuery) return
    setRecommendQuery('')
    headerSearchInputRef.current?.blur()
  }

  const finishEditing = () => {
    toast.success('일정을 저장했어요')
    navigate(fromPreview ? ROUTES.planPreview(planId) : ROUTES.planBudget(planId))
  }

  // Day를 옮길 때는 이전 Day에서 "가까운 장소"(주변 추천) 단계까지 갔었더라도, 새 Day는
  // 아직 앵커(꼭 가고 싶은 장소)를 안 정한 상태이니 "유명한 장소"(전역 추천) 단계로 되돌린다.
  const changeDay = (day: number) => {
    setSelectedDay(day)
    setRecommendMode('popular')
  }

  // 마지막 Day가 아니면 '다음'은 이 화면 안에서 다음 Day로만 넘기고(출발지·필수 장소는
  // 이 화면 안에서 언제든 인라인으로 정할 수 있다), 마지막 Day에서 눌러야 이 화면을
  // 마치고 다음 단계(또는 미리보기)로 넘어간다.
  const proceedNext = () => {
    if (!isLastDay) {
      changeDay(Math.min(selectedDay + 1, dayCount))
      return
    }
    finishEditing()
  }

  // 아직 "유명한 장소"(전역) 모드에 머물러 있는데 꼭 가고 싶은 장소를 골라뒀으면,
  // 다음으로 넘어가기 전에 그 장소 주변 추천(2단계)을 보고 갈지 먼저 물어본다.
  const handleNext = () => {
    if (recommendMode === 'popular' && currentDayMustVisitIds.length > 0) {
      setShowAnchorPrompt(true)
      return
    }
    proceedNext()
  }

  const handleShowAnchorRecommendations = () => {
    setShowAnchorPrompt(false)
    setRecommendMode('nearby')
    setSheetTab('recommend')
  }

  const handleSkipAnchorRecommendations = () => {
    setShowAnchorPrompt(false)
    proceedNext()
  }

  const nextLabel = isLastDay && fromPreview ? '저장하기' : '다음'
  // 탭 이름 자체가 지금 몇 단계인지 알려준다 — 앵커(꼭 가고 싶은 장소) 기준으로
  // "가까운 장소" 모드에 들어섰으면 "주변 추천"으로, 아직 전역으로 둘러보는 중이면
  // 기존 "추천·검색"으로 보여준다.
  const recommendTabLabel = recommendMode === 'nearby' ? '주변 추천' : '추천·검색'

  return (
    <div className={pageRootStyle}>
      <ItineraryDayMap
        departurePlace={departurePlace}
        stops={mapStops}
        mustVisitIds={currentDayMustVisitIds}
        unassignedPlaces={unassignedPlacesForMap}
        unassignedPinKind={recommendMode}
        onAssignPlace={handleAssign}
        onTapMap={handleTapMap}
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
          onPrev={() => changeDay(Math.max(selectedDay - 1, 1))}
          onNext={() => changeDay(Math.min(selectedDay + 1, dayCount))}
        />
      </div>

      <div className={headerSearchBarStyle}>
        <Search size={16} className={headerSearchIconStyle} aria-hidden />
        <input
          ref={headerSearchInputRef}
          type="text"
          className={headerSearchInputStyle}
          value={recommendQuery}
          onChange={(event) => handleRecommendQueryChange(event.target.value)}
          placeholder="장소, 주소를 검색해보세요"
          aria-label="장소, 주소 검색"
        />
        {recommendQuery ? (
          <button
            type="button"
            className={headerSearchClearButtonStyle}
            onClick={() => setRecommendQuery('')}
            aria-label="검색어 지우기"
          >
            <X size={12} />
          </button>
        ) : null}
      </div>

      <ItineraryBottomSheet
        title={`Day ${selectedDay} 일정 (${stops.length}곳)`}
        expandTrigger={Boolean(trimmedRecommendQuery)}
      >
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
            {recommendTabLabel}
          </button>
        </div>

        {sheetTab === 'schedule' ? (
          <div className={sectionStyle}>
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
              <button
                type="button"
                className={fieldRowStyle}
                onClick={() => setIsEditingDeparture(true)}
              >
                <span className={gatewayLabelStyle}>
                  {departurePlace ? `🚩 출발지: ${departurePlace.title}` : '🚩 출발지 설정하기'}
                </span>
                <span className={fieldHintStyle}>{departurePlace ? '변경' : '설정'}</span>
              </button>
            )}

            {scheduleItems.length === 0 ? (
              <p className={emptyTextStyle}>
                {hasAnyDayContent
                  ? `아직 배정된 장소가 없어요. "${recommendTabLabel}" 탭에서 담아보세요.`
                  : '먼저 이 Day의 출발지나 꼭 가고 싶은 장소를 정해보세요. 그 장소를 기준으로 근처를 추천해드려요.'}
              </p>
            ) : (
              <ScheduleList
                items={scheduleItems}
                mustVisitIds={currentDayMustVisitIds}
                onReorder={handleReorder}
                onRemove={handleRemove}
                onTimeChange={handleTimeChange}
                onToggleMustVisit={handleToggleMustVisit}
              />
            )}
          </div>
        ) : (
          <div className={sectionStyle}>
            <span className={sectionMetaStyle}>고르면 바로 Day {selectedDay}에 담겨요</span>

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

            {recommendMode === 'nearby' &&
            !trimmedRecommendQuery &&
            referencePlaceIds.length === 0 ? (
              <p className={emptyTextStyle}>
                출발지나 장소를 먼저 담아야 가까운 장소를 추천해드릴 수 있어요.
              </p>
            ) : recommendedPlaces.length === 0 ? (
              <p className={emptyTextStyle}>표시할 장소가 없어요.</p>
            ) : (
              recommendedPlaces.map((place) => (
                <WaypointPlaceRow
                  key={place.id}
                  title={place.title}
                  category={
                    showTravelLabel && travelLabelByPlaceId.get(place.id)
                      ? `${place.categoryLabel ?? place.category} · ${nearestPlaceTitleByPlaceId.get(place.id)} 근처 · ${travelLabelByPlaceId.get(place.id)}`
                      : (place.categoryLabel ?? place.category)
                  }
                  added={false}
                  onToggle={() => handleAssign(place.id)}
                  isMustVisit={currentDayMustVisitIds.includes(place.id)}
                  onToggleMustVisit={() => handleToggleMustVisit(place.id)}
                />
              ))
            )}
          </div>
        )}

        <Button
          fullWidth
          size="lg"
          isLoading={updateItineraryMutation.isPending}
          onClick={handleNext}
        >
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

      <Modal
        open={showAnchorPrompt}
        title="꼭 가고 싶은 장소 주변으로 추천받아볼까요?"
        description="지금까지 고른 장소들 근처로 나머지 일정을 채워드릴게요."
        onClose={() => setShowAnchorPrompt(false)}
        actions={[
          { label: '그냥 넘어갈게요', variant: 'ghost', onClick: handleSkipAnchorRecommendations },
          { label: '네, 보여주세요', variant: 'primary', onClick: handleShowAnchorRecommendations },
        ]}
      />
    </div>
  )
}
