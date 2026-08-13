import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Chip } from '@/components/ui/Chip/Chip'
import { HorizontalScrollArea } from '@/components/ui/HorizontalScrollArea/HorizontalScrollArea'
import { Loading } from '@/components/ui/Loading/Loading'
import { Modal } from '@/components/ui/Modal/Modal'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { Button } from '@/components/ui/Button/Button'
import { toast } from '@/components/ui/Toast/Toast'
import { PLACE_CATEGORY_LABELS, ROUTES } from '@/constants'
import { MOCK_COURSES, MOCK_PLACES, type MockCourse } from '@/data/mockExplore'
import { usePlanQuery, useUpdatePlanWaypointsMutation } from '@/features/plans/hooks'
import { rankNearbyPlaces } from '@/features/plans/nearbyPlaces'
import {
  categoryRowStyle,
  courseRowStyle,
  descriptionStyle,
  doneLinkStyle,
  emptyListStyle,
  headerBlockStyle,
  listStyle,
  pageStyle,
  sectionLabelStyle,
  sectionStyle,
  titleStyle,
} from './PlanWaypointsPage.css.ts'
import { RecommendedCourseChip } from './components/RecommendedCourseChip'
import { WaypointPlaceRow } from './components/WaypointPlaceRow'

const ALL_CATEGORY = '전체'
const CATEGORY_FILTERS = [ALL_CATEGORY, ...PLACE_CATEGORY_LABELS]

type RecommendMode = 'popular' | 'nearby'

export function PlanWaypointsPage() {
  const { planId = '' } = useParams<{ planId: string }>()
  const navigate = useNavigate()
  const { data: plan, isLoading } = usePlanQuery(planId)
  const updateWaypointsMutation = useUpdatePlanWaypointsMutation()

  const [activeCategory, setActiveCategory] = useState<string>(ALL_CATEGORY)
  const [recommendMode, setRecommendMode] = useState<RecommendMode>('popular')
  const [selectedPlaceIds, setSelectedPlaceIds] = useState<string[]>([])
  const [pendingCourse, setPendingCourse] = useState<MockCourse | null>(null)
  const hasSyncedRef = useRef(false)

  useEffect(() => {
    if (plan && !hasSyncedRef.current) {
      setSelectedPlaceIds(plan.waypointPlaceIds)
      hasSyncedRef.current = true
    }
  }, [plan])

  const popularPlaces = useMemo(
    () =>
      activeCategory === ALL_CATEGORY
        ? MOCK_PLACES
        : MOCK_PLACES.filter((place) => place.category === activeCategory),
    [activeCategory],
  )

  // 지금까지 담은 장소들 기준으로 가까운 곳을 추천한다 — 하나도 안 담았으면 기준점이 없어 추천할 수 없다.
  const nearbyRanked = useMemo(() => rankNearbyPlaces(selectedPlaceIds), [selectedPlaceIds])
  const nearbyPlaces = useMemo(
    () =>
      activeCategory === ALL_CATEGORY
        ? nearbyRanked
        : nearbyRanked.filter((item) => item.place.category === activeCategory),
    [nearbyRanked, activeCategory],
  )

  const filteredPlaces = recommendMode === 'popular' ? popularPlaces : nearbyPlaces.map((item) => item.place)
  const nearbyLabelByPlaceId = new Map(nearbyPlaces.map((item) => [item.place.id, item.travelLabel]))

  const categoryLabelFor = (place: { id: string; category: string; categoryLabel?: string }) => {
    const base = place.categoryLabel ?? place.category
    const travelLabel = recommendMode === 'nearby' ? nearbyLabelByPlaceId.get(place.id) : null
    return travelLabel ? `${base} · ${travelLabel}` : base
  }

  const togglePlace = (placeId: string) => {
    setSelectedPlaceIds((prev) =>
      prev.includes(placeId) ? prev.filter((id) => id !== placeId) : [...prev, placeId],
    )
  }

  const confirmAddCourse = () => {
    if (!pendingCourse) return
    const coursePlaceIds = pendingCourse.steps
      .map((step) => step.placeId)
      .filter((placeId) => MOCK_PLACES.some((place) => place.id === placeId))

    setSelectedPlaceIds((prev) => Array.from(new Set([...prev, ...coursePlaceIds])))
    toast.success(`${pendingCourse.title}의 경유지를 담았어요`)
    setPendingCourse(null)
  }

  const goBack = () => navigate(-1)

  const handleNext = () => {
    updateWaypointsMutation.mutate(
      { planId, waypointPlaceIds: selectedPlaceIds },
      {
        onSuccess: () => {
          toast.success('경유지를 저장했어요')
          navigate(ROUTES.planSearch(planId))
        },
        onError: () => {
          toast.error('경유지 저장에 실패했어요. 다시 시도해 주세요.')
        },
      },
    )
  }

  return (
    <div>
      <PageHeader
        title="경유지 추천"
        showBack
        onBack={goBack}
        rightSlot={
          <button
            type="button"
            className={doneLinkStyle}
            onClick={handleNext}
            disabled={updateWaypointsMutation.isPending}
          >
            다음
          </button>
        }
      />

      {isLoading || !plan ? (
        <Loading label="여행 계획을 불러오는 중…" />
      ) : (
        <div className={pageStyle}>
          <div className={headerBlockStyle}>
            <h2 className={titleStyle}>가고 싶은 곳을 골라보세요</h2>
            <p className={descriptionStyle}>
              추천 코스를 통째로 담거나, 장소를 하나씩 골라 담을 수 있어요.
            </p>
          </div>

          <div className={sectionStyle}>
            <span className={sectionLabelStyle}>추천 코스로 한 번에 담기</span>
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
          </div>

          <div className={sectionStyle}>
            <span className={sectionLabelStyle}>추천 기준</span>
            <div className={categoryRowStyle}>
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
              >
                가까운 장소
              </Chip>
            </div>
          </div>

          <div className={categoryRowStyle}>
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

          <div className={listStyle}>
            {recommendMode === 'nearby' && selectedPlaceIds.length === 0 ? (
              <p className={emptyListStyle}>
                먼저 장소를 1곳 이상 담으면, 그 장소와 가까운 곳을 추천해드려요.
              </p>
            ) : filteredPlaces.length === 0 ? (
              <p className={emptyListStyle}>해당 카테고리의 장소가 없어요.</p>
            ) : (
              filteredPlaces.map((place) => (
                <WaypointPlaceRow
                  key={place.id}
                  title={place.title}
                  category={categoryLabelFor(place)}
                  added={selectedPlaceIds.includes(place.id)}
                  onToggle={() => togglePlace(place.id)}
                />
              ))
            )}
          </div>

          <Button
            fullWidth
            size="lg"
            isLoading={updateWaypointsMutation.isPending}
            onClick={handleNext}
          >
            다음
          </Button>
        </div>
      )}

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
