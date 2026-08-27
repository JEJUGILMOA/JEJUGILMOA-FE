import { addDays, differenceInCalendarDays, format, parse } from 'date-fns'
import { ko } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Search, Star, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { nativeBridge } from '@/bridge/nativeBridge'
import { useLocation, useNavigate, useParams } from 'react-router'
import { Button } from '@/components/ui/Button/Button'
import { Chip } from '@/components/ui/Chip/Chip'
import { HorizontalScrollArea } from '@/components/ui/HorizontalScrollArea/HorizontalScrollArea'
import { Loading } from '@/components/ui/Loading/Loading'
import { Modal } from '@/components/ui/Modal/Modal'
import { toast } from '@/components/ui/Toast/Toast'
import { ROUTES } from '@/constants'
import { MOCK_COURSES, MOCK_PLACES, type MockCourse } from '@/data/mockExplore'
import {
  useRecommendationsQuery,
  usePlanQuery,
  useSearchPlanPlacesQuery,
  useUpdatePlanItineraryMutation,
} from '@/features/plans/hooks'
import { TRAVEL_THEMES, TRAVEL_THEME_LABELS } from '@/features/plans/travelTheme'
import type { GeoCoordinate, RecommendationRequest, TravelTheme, Waypoint } from '@/features/plans/types'
import {
  backButtonStyle,
  courseRowStyle,
  courseSuggestTitleStyle,
  dayPagerFloatStyle,
  departureResultChevronStyle,
  departureResultRowStyle,
  departureResultTextStyle,
  departureSuggestionBadgeStyle,
  emptyTextStyle,
  fieldHintStyle,
  fieldResultMetaStyle,
  fieldResultTitleStyle,
  fieldRowStyle,
  gatewayLabelStyle,
  headerSearchBarActiveStyle,
  headerSearchBarStyle,
  headerSearchCancelButtonStyle,
  headerSearchClearButtonStyle,
  headerSearchIconStyle,
  headerSearchInputStyle,
  headerSearchModeLabelStyle,
  inlineHintTextStyle,
  mustVisitSummaryCountStyle,
  mustVisitSummaryRowStyle,
  mustVisitSummaryTextStyle,
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
/** "꼭 가고 싶은 장소"는 개수 제한이 없다 — 대신 Day 하나에 담을 수 있는 일정 전체를 10곳으로 제한한다 */
const MAX_DAY_PLACES = 10

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

type PlaceInfo = {
  title: string
  categoryLabel: string
  latitude: number
  longitude: number
}

export function PlanItineraryPage() {
  const { planId = '' } = useParams<{ planId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { data: plan, isPending, isError, refetch } = usePlanQuery(planId)
  const updateItineraryMutation = useUpdatePlanItineraryMutation()

  const [selectedDay, setSelectedDay] = useState(1)
  const [customTimes, setCustomTimes] = useState<Record<string, string>>({})
  const [sheetTab, setSheetTab] = useState<SheetTab>('schedule')
  const [recommendQuery, setRecommendQuery] = useState('')
  const [recommendMode, setRecommendMode] = useState<RecommendMode>('popular')
  const [activeTheme, setActiveTheme] = useState<TravelTheme | null>(null)
  const [pendingCourse, setPendingCourse] = useState<MockCourse | null>(null)
  const [showAnchorPrompt, setShowAnchorPrompt] = useState(false)
  const headerSearchInputRef = useRef<HTMLInputElement>(null)
  const [isSelectingDeparture, setIsSelectingDeparture] = useState(false)
  // 검색·추천 API 응답에서 본 장소들의 이름·좌표를 기억해둔다 — MOCK_PLACES에 없는
  // 실제 장소를 담았을 때도 제목을 보여주고, 담긴 장소를 앵커 추천의 좌표로 쓰기 위함.
  const [placeInfoCache, setPlaceInfoCache] = useState<Record<string, PlaceInfo>>({})
  // 새로고침을 누를 때마다 지금까지 화면에 보여준 장소를 여기 누적해서, 다음 요청에서
  // 서버가 다른 장소를 돌려주게 한다. 서버가 이전 결과를 기억하지 않는 stateless API라서다.
  const [refreshedPlaceIds, setRefreshedPlaceIds] = useState<number[]>([])
  const [refreshedContentIds, setRefreshedContentIds] = useState<string[]>([])

  // 미리보기의 연필 아이콘으로 들어왔으면 저장 후 다음 STEP(예산입력)으로 이어가지 않고
  // 미리보기로 바로 돌아간다 — 이 화면만 고쳐달라고 들어온 거라 나머지 단계를 강제로 거칠 필요가 없다.
  const fromPreview = Boolean((location.state as { fromPreview?: boolean } | null)?.fromPreview)

  const goBack = () => navigate(-1)

  const placeTitle = (placeId: string) =>
    placeInfoCache[placeId]?.title ?? MOCK_PLACES.find((place) => place.id === placeId)?.title ?? placeId

  // 아래 훅들은 조건 없이 항상 같은 순서로 호출돼야 해서, plan이 아직 로딩 중이라
  // undefined일 수 있는 시점에도 옵셔널 체이닝으로 미리 계산해둔다. isPending/isError
  // 가드는 이 훅 호출들이 다 끝난 뒤에 있어야 한다.
  const currentDayEntry = plan?.itinerary[selectedDay]
  const currentDayWaypoints = currentDayEntry?.waypoints ?? []
  const currentDayPlaceIds = currentDayWaypoints.map((waypoint) => waypoint.placeId)
  // "가까운 장소"는 이 Day에 꼭 가고 싶은 장소(앵커)를 정해뒀으면 그곳들이 앵커 추천의 기준이 되고,
  // 아직 안 정했으면 출발지·이미 담은 장소로 대신한다.
  const currentDayMustVisitIds = currentDayWaypoints
    .filter((waypoint) => waypoint.isPreferred)
    .map((waypoint) => waypoint.placeId)
  const fallbackReferencePlaceIds = [
    ...(currentDayEntry?.departurePlaceId ? [currentDayEntry.departurePlaceId] : []),
    ...currentDayPlaceIds,
  ]
  const referencePlaceIds =
    currentDayMustVisitIds.length > 0 ? currentDayMustVisitIds : fallbackReferencePlaceIds

  // 이미 어느 Day엔가(장소·출발지로) 쓰인 곳은 추천/검색 후보에서 뺀다 —
  // 같은 장소가 여러 Day에 중복 배정되는 걸 막는다.
  const assignedEverywhere = new Set(
    Object.values(plan?.itinerary ?? {}).flatMap((day) => [
      ...(day.departurePlaceId ? [day.departurePlaceId] : []),
      ...day.waypoints.map((waypoint) => waypoint.placeId),
    ]),
  )

  const toGeoCoordinate = (placeId: string): GeoCoordinate | null => {
    const info = placeInfoCache[placeId]
    return info ? { latitude: info.latitude, longitude: info.longitude } : null
  }

  // 출발지·선호경유지가 mock 데이터에서 온 것이면 좌표가 없어 null이 된다 — 이 경우
  // 서버는 전역 추천으로 대신 응답한다. 출발지 입력을 실제 API로 옮길 때 함께 정리한다.
  const departureCoord = currentDayEntry?.departurePlaceId
    ? toGeoCoordinate(currentDayEntry.departurePlaceId)
    : null
  const preferredWaypoints =
    recommendMode === 'nearby'
      ? currentDayMustVisitIds.map(toGeoCoordinate).filter((coord): coord is GeoCoordinate => coord !== null)
      : []
  const baseExcludedPlaceIds = [...assignedEverywhere]
    .map((id) => Number(id))
    .filter((id) => Number.isFinite(id))

  const recommendationRequest: RecommendationRequest = {
    departureCoord,
    preferredWaypoints,
    excludedPlaceIds: [...new Set([...baseExcludedPlaceIds, ...refreshedPlaceIds])],
    excludeContentIds: refreshedContentIds,
    category: activeTheme,
  }

  // Day나 테마·모드가 바뀌면 새로고침 누적분은 리셋 — 새 맥락에서 다시 처음부터 추천받는다.
  // effect 대신, 렌더 중에 이전 값과 비교해서 바뀌었을 때만 상태를 리셋하는 방식
  // (React가 공식적으로 권장하는 "prop이 바뀌면 state를 리셋" 패턴)을 쓴다.
  const recommendContextKey = `${selectedDay}:${activeTheme}:${recommendMode}`
  const [lastRecommendContextKey, setLastRecommendContextKey] = useState(recommendContextKey)
  if (lastRecommendContextKey !== recommendContextKey) {
    setLastRecommendContextKey(recommendContextKey)
    setRefreshedPlaceIds([])
    setRefreshedContentIds([])
  }

  const trimmedRecommendQuery = recommendQuery.trim()
  const isRecommendTabActive = Boolean(plan) && sheetTab === 'recommend' && !isSelectingDeparture
  const shouldFetchRecommendations =
    isRecommendTabActive &&
    !trimmedRecommendQuery &&
    (recommendMode === 'popular' || referencePlaceIds.length > 0)
  const shouldSearchPlaces = isRecommendTabActive && Boolean(trimmedRecommendQuery)

  const recommendationsQuery = useRecommendationsQuery(recommendationRequest, shouldFetchRecommendations)
  const placeSearchQuery = useSearchPlanPlacesQuery({ keyword: trimmedRecommendQuery }, shouldSearchPlaces)

  // 새로 본 장소는 이름·좌표를 캐시에 기억해둔다 (제목 표시, 다음 앵커 좌표 계산용)
  useEffect(() => {
    if (!recommendationsQuery.data) return
    setPlaceInfoCache((prev) => {
      const next = { ...prev }
      for (const item of recommendationsQuery.data.items) {
        if (item.placeId === null) continue
        next[String(item.placeId)] = {
          title: item.name,
          categoryLabel: item.categoryName ?? '',
          latitude: item.latitude,
          longitude: item.longitude,
        }
      }
      return next
    })
  }, [recommendationsQuery.data])

  useEffect(() => {
    if (!placeSearchQuery.data) return
    setPlaceInfoCache((prev) => {
      const next = { ...prev }
      for (const item of placeSearchQuery.data.content) {
        next[String(item.id)] = {
          title: item.name,
          categoryLabel: item.categoryName ?? '',
          latitude: item.latitude,
          longitude: item.longitude,
        }
      }
      return next
    })
  }, [placeSearchQuery.data])

  if (isPending) {
    return (
      <div className={pageRootStyle}>
        <Loading label="여행 계획을 불러오는 중…" />
      </div>
    )
  }

  if (isError || !plan) {
    return (
      <div className={pageRootStyle}>
        <p className={emptyTextStyle}>계획을 불러오지 못했어요.</p>
        <Button fullWidth onClick={() => void refetch()}>
          다시 시도
        </Button>
      </div>
    )
  }

  const startDate = parse(plan.startDate, DATE_FORMAT, new Date())
  const endDate = parse(plan.endDate, DATE_FORMAT, new Date())
  const dayCount = Math.max(differenceInCalendarDays(endDate, startDate) + 1, 1)
  const dayDateLabel = format(addDays(startDate, selectedDay - 1), 'M.d(EEE)', { locale: ko })

  const isFirstDay = selectedDay === 1
  const isLastDay = selectedDay === dayCount

  const departurePlace = currentDayEntry?.departurePlaceId
    ? { id: currentDayEntry.departurePlaceId, title: placeTitle(currentDayEntry.departurePlaceId) }
    : null

  // 전날 출발지(예: 숙소)는 오늘도 그대로 출발지일 가능성이 높으니, 아직 안 정했으면
  // 출발지 검색 목록 맨 위에 추천으로 보여준다.
  const previousDayDeparturePlaceId =
    selectedDay > 1 ? (plan.itinerary[selectedDay - 1]?.departurePlaceId ?? null) : null
  const previousDayDeparturePlace =
    previousDayDeparturePlaceId && previousDayDeparturePlaceId !== currentDayEntry?.departurePlaceId
      ? MOCK_PLACES.find((place) => place.id === previousDayDeparturePlaceId)
      : undefined

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

  // 출발지만 정해진 상태는 아직 "빈 일정"으로 본다 — 출발지는 참고 지점일 뿐 실제
  // 방문 계획이 아니라서, 출발지만 있고 꼭 가고 싶은 장소·일정이 없으면 코스 추천을
  // 계속 보여준다. 반대로 꼭 가고 싶은 장소가 있는데 일정이 비어 있으면(예: 담았던
  // 곳을 다시 뺀 경우) 이미 앵커를 잡아둔 상태라 코스 추천 대신 안내 문구를 보여준다.
  const hasMustVisitWithoutStops = currentDayMustVisitIds.length > 0

  // 출발지 검색은 별도 이슈에서 실제 API로 옮기기 전까지 여전히 MOCK_PLACES 기반이다.
  const departureSearchKeyword = trimmedRecommendQuery.toLowerCase()
  const departureCandidates = MOCK_PLACES.filter((place) => {
    if (assignedEverywhere.has(place.id)) return false
    if (!departureSearchKeyword) return true
    return (
      place.title.toLowerCase().includes(departureSearchKeyword) ||
      place.location.toLowerCase().includes(departureSearchKeyword)
    )
  })

  type DisplayPlace = { id: string; title: string; categoryLabel: string; addable: boolean }

  const searchDisplayPlaces: DisplayPlace[] = (placeSearchQuery.data?.content ?? [])
    .filter((item) => !assignedEverywhere.has(String(item.id)))
    .map((item) => ({
      id: String(item.id),
      title: item.name,
      categoryLabel: item.categoryName ?? '',
      addable: true,
    }))

  // TourAPI 폴백 결과(placeId === null)는 아직 DB에 없는 장소라 경유지로 바로 담을 수 없다 —
  // 목록엔 보여주되 담기·별표를 비활성화한다.
  const recommendDisplayPlaces: DisplayPlace[] = (recommendationsQuery.data?.items ?? []).map((item) =>
    item.placeId !== null
      ? { id: String(item.placeId), title: item.name, categoryLabel: item.categoryName ?? '', addable: true }
      : {
          id: `tourapi-${item.contentId}`,
          title: item.name,
          categoryLabel: item.categoryName ?? '',
          addable: false,
        },
  )

  const displayPlaces = trimmedRecommendQuery ? searchDisplayPlaces : recommendDisplayPlaces
  const isLoadingDisplayPlaces = trimmedRecommendQuery
    ? placeSearchQuery.isLoading
    : recommendationsQuery.isLoading
  const hasDisplayPlacesError = trimmedRecommendQuery ? placeSearchQuery.isError : recommendationsQuery.isError
  const recommendHasMore = !trimmedRecommendQuery && (recommendationsQuery.data?.hasMore ?? false)

  const handleRefreshRecommendations = () => {
    const data = recommendationsQuery.data
    if (!data) return
    const newPlaceIds = data.items.map((item) => item.placeId).filter((id): id is number => id !== null)
    const newContentIds = data.items.map((item) => item.contentId).filter((id): id is string => id !== null)
    setRefreshedPlaceIds((prev) => [...prev, ...newPlaceIds])
    setRefreshedContentIds((prev) => [...prev, ...newContentIds])
  }

  const mapStops = stops
  // 탭은 바텀시트 안 내용만 나눈다 — 지도 자체는 네이버맵처럼 어느 탭에 있든 늘
  // 오늘 동선 + 추천 핀을 함께 보여준다.
  const unassignedPlacesForMap = displayPlaces
    .filter((place) => place.addable)
    .map((place) => ({ id: place.id, title: place.title }))

  const persistDay = (
    updates: Partial<{
      departurePlaceId: string | null
      waypoints: Waypoint[]
    }>,
    onSuccessMessage?: string,
  ) => {
    const nextItinerary = {
      ...plan.itinerary,
      [selectedDay]: {
        departurePlaceId: currentDayEntry?.departurePlaceId ?? null,
        waypoints: currentDayWaypoints,
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
    const waypointByPlaceId = new Map(currentDayWaypoints.map((waypoint) => [waypoint.placeId, waypoint]))
    const nextWaypoints = nextOrderIds.map(
      (placeId) => waypointByPlaceId.get(placeId) ?? { placeId, isPreferred: false },
    )
    persistDay({ waypoints: nextWaypoints })
  }

  const handleRemove = (id: string) => {
    persistDay(
      { waypoints: currentDayWaypoints.filter((waypoint) => waypoint.placeId !== id) },
      `${placeTitle(id)}를 Day ${selectedDay} 일정에서 뺐어요`,
    )
  }

  // "유명한 장소"(전역) 모드에서 담는 건 곧 "1단계에서 고른 꼭 가고 싶은 장소"라, 별도로
  // 별표를 안 찍어도 자동으로 필수 장소가 된다. "가까운 장소" 모드로 넘어간 뒤에는
  // 그냥 일반 경유지로만 담긴다.
  const handleAssign = (id: string) => {
    if (currentDayPlaceIds.includes(id)) return
    if (currentDayPlaceIds.length >= MAX_DAY_PLACES) {
      toast.error(`Day당 일정은 최대 ${MAX_DAY_PLACES}곳까지만 담을 수 있어요`)
      return
    }
    const shouldMarkMustVisit = recommendMode === 'popular'
    persistDay(
      { waypoints: [...currentDayWaypoints, { placeId: id, isPreferred: shouldMarkMustVisit }] },
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

    if (currentDayPlaceIds.length >= MAX_DAY_PLACES) {
      toast.error(`Day당 일정은 최대 ${MAX_DAY_PLACES}곳까지만 담을 수 있어요`)
      setPendingCourse(null)
      return
    }

    if (coursePlaceIds.length > 0) {
      // Day 하나에 담을 수 있는 일정은 최대 MAX_DAY_PLACES곳이라, 코스에 남은 자리보다
      // 많은 경유지가 있으면 자리가 남은 만큼만 담는다.
      const remainingSlots = MAX_DAY_PLACES - currentDayPlaceIds.length
      const addedPlaceIds = coursePlaceIds.slice(0, remainingSlots)
      // 코스로 한 번에 담는 경유지도 직접 고른 장소와 마찬가지로 이 Day의
      // "꼭 가고 싶은 장소"로 함께 찍는다.
      persistDay(
        {
          waypoints: [
            ...currentDayWaypoints,
            ...addedPlaceIds.map((placeId) => ({ placeId, isPreferred: true })),
          ],
        },
        addedPlaceIds.length < coursePlaceIds.length
          ? `Day ${selectedDay}은 최대 ${MAX_DAY_PLACES}곳까지만 담을 수 있어 일부만 담았어요`
          : `${pendingCourse.title}의 경유지를 Day ${selectedDay}의 꼭 가고 싶은 장소로 담았어요`,
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

    const sortedWaypoints = [...currentDayWaypoints].sort((a, b) =>
      timesById[a.placeId].localeCompare(timesById[b.placeId]),
    )
    persistDay({ waypoints: sortedWaypoints })
  }

  // 별 토글: 이미 담긴 장소면 그대로 꼭 가고 싶은 장소로만 정하고, 아직 안 담은
  // 추천/검색 결과면 담으면서 함께 정한다. 같은 곳을 다시 누르면 해제된다.
  // "꼭 가고 싶은 장소" 자체는 개수 제한이 없지만, 아직 안 담은 곳을 새로 담는
  // 것이라면 Day 전체 일정 한도(MAX_DAY_PLACES)는 그대로 적용된다.
  const handleToggleMustVisit = (id: string) => {
    const isUnsetting = currentDayMustVisitIds.includes(id)
    const isAlreadyInSchedule = currentDayPlaceIds.includes(id)

    if (!isUnsetting && !isAlreadyInSchedule && currentDayPlaceIds.length >= MAX_DAY_PLACES) {
      toast.error(`Day당 일정은 최대 ${MAX_DAY_PLACES}곳까지만 담을 수 있어요`)
      return
    }

    const nextWaypoints = isAlreadyInSchedule
      ? currentDayWaypoints.map((waypoint) =>
          waypoint.placeId === id ? { ...waypoint, isPreferred: !isUnsetting } : waypoint,
        )
      : [...currentDayWaypoints, { placeId: id, isPreferred: true }]
    persistDay(
      { waypoints: nextWaypoints },
      isUnsetting
        ? '꼭 가고 싶은 장소 설정을 해제했어요'
        : `${placeTitle(id)}를 Day ${selectedDay}의 꼭 가고 싶은 장소로 정했어요`,
    )
  }

  // 출발지 검색을 위해 별도 입력창을 시트 안에 두지 않고, 지도 위 헤더 검색창을
  // "출발지 검색 모드"로 전환해서 재사용한다 — 검색 진입점을 하나로 합쳐서 좁은
  // 시트 안에서 결과가 잘리는 문제를 피한다.
  const handleStartDeparture = () => {
    setIsSelectingDeparture(true)
    setRecommendQuery('')
    setSheetTab('recommend')
  }

  const handleCancelDeparture = () => {
    setIsSelectingDeparture(false)
    setRecommendQuery('')
    setSheetTab('schedule')
  }

  const handleSelectDeparture = (id: string) => {
    persistDay({ departurePlaceId: id }, '출발지를 저장했어요')
    setIsSelectingDeparture(false)
    setRecommendQuery('')
    setSheetTab('schedule')
  }

  // 헤더 검색창은 탭과 무관하게 항상 떠 있어서, "일정" 탭을 보다가 검색을 시작해도
  // 결과가 바로 보이도록 "추천·검색" 탭으로 전환해준다.
  const handleRecommendQueryChange = (value: string) => {
    setRecommendQuery(value)
    if (value.trim()) setSheetTab('recommend')
  }

  // 네이버맵처럼 지도를 탭하면 검색에서 빠져나가 일반 추천 탭으로 돌아간다.
  const handleTapMap = () => {
    if (!recommendQuery && !isSelectingDeparture) return
    setRecommendQuery('')
    setIsSelectingDeparture(false)
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
        cameraFitKey={`day-${selectedDay}`}
        onAssignPlace={handleAssign}
        onTapMap={handleTapMap}
      />

      <button
        type="button"
        data-gilmoa-overlay
        data-gilmoa-itinerary-float
        className={backButtonStyle}
        onClick={goBack}
        aria-label="뒤로 가기"
      >
        <ChevronLeft size={22} />
      </button>

      <button
        type="button"
        data-gilmoa-overlay
        data-gilmoa-itinerary-float
        className={nextButtonStyle}
        onClick={handleNext}
      >
        {nextLabel}
      </button>

      <div data-gilmoa-overlay data-gilmoa-itinerary-float className={dayPagerFloatStyle}>
        <DayPager
          day={selectedDay}
          totalDays={dayCount}
          dateLabel={dayDateLabel}
          onPrev={() => changeDay(Math.max(selectedDay - 1, 1))}
          onNext={() => changeDay(Math.min(selectedDay + 1, dayCount))}
        />
      </div>

      <div
        data-gilmoa-overlay
        data-gilmoa-itinerary-float
        className={
          isSelectingDeparture
            ? `${headerSearchBarStyle} ${headerSearchBarActiveStyle}`
            : headerSearchBarStyle
        }
      >
        {isSelectingDeparture ? (
          <span className={headerSearchModeLabelStyle}>🚩 출발지</span>
        ) : (
          <Search size={16} className={headerSearchIconStyle} aria-hidden />
        )}
        <input
          ref={headerSearchInputRef}
          type="text"
          className={headerSearchInputStyle}
          value={recommendQuery}
          onChange={(event) => handleRecommendQueryChange(event.target.value)}
          placeholder={isSelectingDeparture ? '출발지를 검색해보세요' : '장소, 주소를 검색해보세요'}
          aria-label={isSelectingDeparture ? '출발지 검색' : '장소, 주소 검색'}
          autoFocus={isSelectingDeparture}
        />
        {isSelectingDeparture ? (
          <button
            type="button"
            className={headerSearchCancelButtonStyle}
            onClick={handleCancelDeparture}
          >
            취소
          </button>
        ) : recommendQuery ? (
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
        title={
          isSelectingDeparture
            ? `Day ${selectedDay} 출발지 검색`
            : `Day ${selectedDay} 일정 (${stops.length}/${MAX_DAY_PLACES}곳)`
        }
        expandTrigger={Boolean(trimmedRecommendQuery) || isSelectingDeparture}
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
            <button type="button" className={fieldRowStyle} onClick={handleStartDeparture}>
              <span className={gatewayLabelStyle}>
                {departurePlace ? `🚩 출발지: ${departurePlace.title}` : '🚩 출발지 설정하기'}
              </span>
              <span className={fieldHintStyle}>{departurePlace ? '변경' : '설정'}</span>
            </button>

            {currentDayMustVisitIds.length > 0 && !departurePlace ? (
              <p className={inlineHintTextStyle}>출발지도 설정해주세요.</p>
            ) : null}

            {scheduleItems.length === 0 && hasMustVisitWithoutStops ? (
              <p className={emptyTextStyle}>
                아직 배정된 장소가 없어요. "{recommendTabLabel}" 탭에서 담아보세요.
              </p>
            ) : null}

            {scheduleItems.length === 0 && !hasMustVisitWithoutStops ? (
              <>
                <span className={courseSuggestTitleStyle}>이런 코스는 어때요?</span>
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
              </>
            ) : null}

            {scheduleItems.length > 0 ? (
              <>
                <div className={mustVisitSummaryRowStyle}>
                  <span className={mustVisitSummaryTextStyle}>
                    <Star size={14} fill="#FFAC00" stroke="#FFAC00" aria-hidden />
                    꼭 가고 싶은 장소로 정한 곳 주변으로 나머지 일정을 추천해드려요
                  </span>
                  <span className={mustVisitSummaryCountStyle}>{currentDayMustVisitIds.length}곳</span>
                </div>

                <ScheduleList
                  items={scheduleItems}
                  mustVisitIds={currentDayMustVisitIds}
                  onReorder={handleReorder}
                  onRemove={handleRemove}
                  onTimeChange={handleTimeChange}
                  onToggleMustVisit={handleToggleMustVisit}
                />
              </>
            ) : null}
          </div>
        ) : (
          <div className={sectionStyle}>
            <span className={sectionMetaStyle}>
              {isSelectingDeparture
                ? `탭하면 Day ${selectedDay}의 출발지로 설정돼요`
                : `고르면 바로 Day ${selectedDay}에 담겨요`}
            </span>

            {!trimmedRecommendQuery &&
            !isSelectingDeparture &&
            recommendMode === 'popular' &&
            departurePlace ? (
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
            ) : null}

            {!trimmedRecommendQuery && !isSelectingDeparture ? (
              <HorizontalScrollArea>
                <div className={courseRowStyle}>
                  <Chip colorScheme="primary" isSelected={activeTheme === null} onClick={() => setActiveTheme(null)}>
                    전체
                  </Chip>
                  {TRAVEL_THEMES.map((theme) => (
                    <Chip
                      key={theme}
                      colorScheme="primary"
                      isSelected={theme === activeTheme}
                      onClick={() => setActiveTheme(theme)}
                    >
                      {TRAVEL_THEME_LABELS[theme]}
                    </Chip>
                  ))}
                </div>
              </HorizontalScrollArea>
            ) : null}

            {isSelectingDeparture ? (
              <>
                {!trimmedRecommendQuery && previousDayDeparturePlace ? (
                  <button
                    type="button"
                    className={departureResultRowStyle}
                    onClick={() => handleSelectDeparture(previousDayDeparturePlace.id)}
                  >
                    <span className={departureResultTextStyle}>
                      <span className={departureSuggestionBadgeStyle}>이전 Day와 동일</span>
                      <span className={fieldResultTitleStyle}>{previousDayDeparturePlace.title}</span>
                      <span className={fieldResultMetaStyle}>{previousDayDeparturePlace.location}</span>
                    </span>
                    <ChevronRight size={18} className={departureResultChevronStyle} aria-hidden />
                  </button>
                ) : null}

                {departureCandidates.length === 0 ? (
                  <p className={emptyTextStyle}>검색 결과가 없어요.</p>
                ) : (
                  departureCandidates.map((place) => (
                    <button
                      key={place.id}
                      type="button"
                      className={departureResultRowStyle}
                      onClick={() => handleSelectDeparture(place.id)}
                    >
                      <span className={departureResultTextStyle}>
                        <span className={fieldResultTitleStyle}>{place.title}</span>
                        <span className={fieldResultMetaStyle}>{place.location}</span>
                      </span>
                      <ChevronRight size={18} className={departureResultChevronStyle} aria-hidden />
                    </button>
                  ))
                )}
              </>
            ) : recommendMode === 'nearby' &&
              !trimmedRecommendQuery &&
              referencePlaceIds.length === 0 ? (
              <p className={emptyTextStyle}>
                출발지나 장소를 먼저 담아야 가까운 장소를 추천해드릴 수 있어요.
              </p>
            ) : isLoadingDisplayPlaces ? (
              <p className={emptyTextStyle}>불러오는 중…</p>
            ) : hasDisplayPlacesError ? (
              <>
                <p className={emptyTextStyle}>
                  {trimmedRecommendQuery ? '검색' : '추천'}을 불러오지 못했어요. 다시 시도해 주세요.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    void (trimmedRecommendQuery ? placeSearchQuery.refetch() : recommendationsQuery.refetch())
                  }
                >
                  다시 시도
                </Button>
              </>
            ) : displayPlaces.length === 0 ? (
              <p className={emptyTextStyle}>표시할 장소가 없어요.</p>
            ) : (
              <>
                {displayPlaces.map((place) => (
                  <WaypointPlaceRow
                    key={place.id}
                    title={place.title}
                    category={place.categoryLabel}
                    added={false}
                    onToggle={() => (place.addable ? handleAssign(place.id) : undefined)}
                    isMustVisit={currentDayMustVisitIds.includes(place.id)}
                    onToggleMustVisit={() => (place.addable ? handleToggleMustVisit(place.id) : undefined)}
                    disabled={!place.addable}
                  />
                ))}
                {!trimmedRecommendQuery ? (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!recommendHasMore || recommendationsQuery.isFetching}
                    onClick={handleRefreshRecommendations}
                  >
                    {recommendationsQuery.isFetching ? '불러오는 중…' : '새로고침'}
                  </Button>
                ) : null}
              </>
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

      <ItineraryNativeChromeSync
        selectedDay={selectedDay}
        dayCount={dayCount}
        dateLabel={dayDateLabel}
        searchQuery={recommendQuery}
        isSelectingDeparture={isSelectingDeparture}
        nextLabel={nextLabel}
        sheetTitle={
          isSelectingDeparture
            ? `Day ${selectedDay} 출발지 검색`
            : `Day ${selectedDay} 일정 (${stops.length}/${MAX_DAY_PLACES}곳)`
        }
        goBack={goBack}
        handleNext={handleNext}
        changeDay={changeDay}
        handleRecommendQueryChange={handleRecommendQueryChange}
        handleCancelDeparture={handleCancelDeparture}
      />

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

function ItineraryNativeChromeSync({
  selectedDay,
  dayCount,
  dateLabel,
  searchQuery,
  isSelectingDeparture,
  nextLabel,
  sheetTitle,
  goBack,
  handleNext,
  changeDay,
  handleRecommendQueryChange,
  handleCancelDeparture,
}: {
  selectedDay: number
  dayCount: number
  dateLabel: string
  searchQuery: string
  isSelectingDeparture: boolean
  nextLabel: string
  sheetTitle: string
  goBack: () => void
  handleNext: () => void
  changeDay: (day: number) => void
  handleRecommendQueryChange: (value: string) => void
  handleCancelDeparture: () => void
}) {
  const goBackRef = useRef(goBack)
  const handleNextRef = useRef(handleNext)
  const changeDayRef = useRef(changeDay)
  const searchRef = useRef(handleRecommendQueryChange)
  const cancelRef = useRef(handleCancelDeparture)
  goBackRef.current = goBack
  handleNextRef.current = handleNext
  changeDayRef.current = changeDay
  searchRef.current = handleRecommendQueryChange
  cancelRef.current = handleCancelDeparture

  useEffect(() => {
    if (!nativeBridge.isNativeWebView()) return
    nativeBridge.postToNative({
      type: 'SET_HEADER',
      visible: false,
    })
    nativeBridge.postToNative({
      type: 'SET_ITINERARY_CHROME',
      visible: true,
      day: selectedDay,
      totalDays: dayCount,
      dateLabel,
      searchQuery,
      searchPlaceholder: isSelectingDeparture ? '출발지를 검색해보세요' : '장소를 검색해보세요',
      isSelectingDeparture,
      nextLabel,
      sheetTitle,
    })
  }, [selectedDay, dayCount, dateLabel, searchQuery, isSelectingDeparture, nextLabel, sheetTitle])

  useEffect(() => {
    if (!nativeBridge.isNativeWebView()) return
    return () => {
      nativeBridge.postToNative({ type: 'SET_ITINERARY_CHROME', visible: false })
    }
  }, [])

  useEffect(() => {
    const onBack = (event: Event) => {
      event.preventDefault()
      goBackRef.current()
    }
    const onNext = () => handleNextRef.current()
    const onDay = (event: Event) => {
      const day = (event as CustomEvent<{ day?: number }>).detail?.day
      if (typeof day !== 'number') return
      changeDayRef.current(day)
    }
    const onSearch = (event: Event) => {
      const query = (event as CustomEvent<{ query?: string }>).detail?.query
      if (typeof query === 'string') searchRef.current(query)
    }
    const onCancel = () => cancelRef.current()
    window.addEventListener('gilmoa:header-back', onBack)
    window.addEventListener('gilmoa:itinerary-next', onNext)
    window.addEventListener('gilmoa:itinerary-day', onDay)
    window.addEventListener('gilmoa:itinerary-search', onSearch)
    window.addEventListener('gilmoa:itinerary-departure-cancel', onCancel)
    return () => {
      window.removeEventListener('gilmoa:header-back', onBack)
      window.removeEventListener('gilmoa:itinerary-next', onNext)
      window.removeEventListener('gilmoa:itinerary-day', onDay)
      window.removeEventListener('gilmoa:itinerary-search', onSearch)
      window.removeEventListener('gilmoa:itinerary-departure-cancel', onCancel)
    }
  }, [])

  return null
}
