import { type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import homeHeroImage from '@/assets/images/home-hero.png'
import { Empty } from '@/components/ui/Empty/Empty'
import { ErrorState } from '@/components/ui/ErrorState/ErrorState'
import { HorizontalScrollArea } from '@/components/ui/HorizontalScrollArea/HorizontalScrollArea'
import { SearchBar } from '@/components/ui/SearchBar/SearchBar'
import { Skeleton } from '@/components/ui/Skeleton/Skeleton'
import { toast } from '@/components/ui/Toast/Toast'
import { PLACE_CATEGORIES, ROUTES, coursePath, placePath } from '@/constants'
import type { CourseImageTag } from '@/data/mockExplore'
import {
  useFavoritePlaceIdsQuery,
  useToggleFavoriteMutation,
} from '@/features/favorites/hooks'
import { useHomeCoursesQuery, useHomePlacesQuery } from '@/features/home/hooks'
import type { HomeCourse } from '@/features/home/types'
import { usePopularPlacesQuery } from '@/features/places/hooks'
import type { PopularPlace } from '@/features/places/types'
import { useAuthStore } from '@/stores/authStore'
import { TravelPickCard } from './components/TravelPickCard/TravelPickCard'
import { CourseRecommendCard } from './components/CourseRecommendCard/CourseRecommendCard'
import { PopularPlaceCard } from './components/PopularPlaceCard/PopularPlaceCard'
import {
  categoryIconStyle,
  categoryItemStyle,
  categoryLabelStyle,
  categoryListStyle,
  courseRowStyle,
  heroCopyStyle,
  heroBlockStyle,
  heroImageStyle,
  heroStyle,
  heroSubtitleStyle,
  heroTitleStyle,
  pageStyle,
  popularListStyle,
  searchBarElevatedStyle,
  searchWrapStyle,
  sectionActionStyle,
  sectionHeaderStyle,
  sectionStyle,
  sectionTitleStyle,
  skeletonCourseBodyStyle,
  skeletonCoursePreviewRowStyle,
  skeletonCourseStyle,
  skeletonMediaRadiusStyle,
  skeletonPopularContentStyle,
  skeletonPopularStyle,
  skeletonTravelPickContentStyle,
  skeletonTravelPickStyle,
  travelPickRowStyle,
} from './HomePage.css.ts'

const HOME_POPULAR_LIMIT = 4

/** TODO: 스켈레톤 미리보기용 — 확인 후 false로 되돌리기 */
const FORCE_HOME_SKELETONS = false

const PREVIEW_TAG_TONES: CourseImageTag['tone'][] = ['blue', 'pink', 'green']

function formatEstimatedMinutes(minutes: number) {
  if (minutes < 60) return `${minutes}분`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest > 0 ? `${hours}시간 ${rest}분` : `${hours}시간`
}

function mapHomeCourseToCard(course: HomeCourse) {
  return {
    title: course.title,
    description: course.description,
    imageUrl: course.imageUrl,
    imageTags: (course.tags ?? []).map((label, index) => ({
      label,
      tone: PREVIEW_TAG_TONES[index % PREVIEW_TAG_TONES.length],
    })),
    locationLabel: course.region,
    duration:
      course.estimatedMinutes != null
        ? formatEstimatedMinutes(course.estimatedMinutes)
        : undefined,
    placeCount: course.placeCount ?? course.preview.length,
    previewSteps: course.preview.map((item) => ({
      title: item.placeId,
      thumbnailUrl: item.imageUrl ?? '',
    })),
  }
}

function SectionHeader({
  id,
  title,
  actionLabel,
  onAction,
}: {
  id: string
  title: string
  actionLabel: string
  onAction?: () => void
}) {
  return (
    <div className={sectionHeaderStyle}>
      <h2 id={id} className={sectionTitleStyle}>
        {title}
      </h2>
      <button type="button" className={sectionActionStyle} onClick={onAction}>
        {actionLabel}
      </button>
    </div>
  )
}

function TravelPicksSkeleton() {
  return (
    <div className={travelPickRowStyle} aria-hidden>
      {Array.from({ length: 2 }, (_, index) => (
        <div key={index} className={skeletonTravelPickStyle}>
          <Skeleton width="100%" height={195} className={skeletonMediaRadiusStyle} />
          <div className={skeletonTravelPickContentStyle}>
            <Skeleton width="68%" height={20} />
            <Skeleton width="48%" height={14} />
            <Skeleton width="92%" height={14} />
          </div>
        </div>
      ))}
    </div>
  )
}

function CoursesSkeleton() {
  return (
    <div className={courseRowStyle} aria-hidden>
      {Array.from({ length: 2 }, (_, index) => (
        <div key={index} className={skeletonCourseStyle}>
          <Skeleton width="100%" height={184} className={skeletonMediaRadiusStyle} />
          <div className={skeletonCourseBodyStyle}>
            <Skeleton width="36%" height={14} />
            <Skeleton width="78%" height={22} />
            <Skeleton width="100%" height={14} />
            <Skeleton width="88%" height={14} />
            <div className={skeletonCoursePreviewRowStyle}>
              <Skeleton width={60} height={60} />
              <Skeleton width={60} height={60} />
              <Skeleton width={60} height={60} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function PopularPlacesSkeleton() {
  return (
    <div className={popularListStyle} aria-hidden>
      {Array.from({ length: HOME_POPULAR_LIMIT }, (_, index) => (
        <div key={index} className={skeletonPopularStyle}>
          <Skeleton width="100%" height={148} className={skeletonMediaRadiusStyle} />
          <div className={skeletonPopularContentStyle}>
            <Skeleton width="80%" height={14} />
            <Skeleton width="40%" height={14} />
          </div>
        </div>
      ))}
    </div>
  )
}

function SectionStatus({
  isLoading,
  isError,
  isEmpty,
  onRetry,
  emptyTitle,
  loadingFallback,
}: {
  isLoading: boolean
  isError: boolean
  isEmpty: boolean
  onRetry: () => void
  emptyTitle: string
  loadingFallback: ReactNode
}) {
  if (isLoading) return loadingFallback
  if (isError) return <ErrorState onRetry={onRetry} />
  if (isEmpty) return <Empty title={emptyTitle} description="잠시 후 다시 확인해 주세요." />
  return null
}

export function HomePage() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  const picksQuery = useHomePlacesQuery()
  const coursesQuery = useHomeCoursesQuery()
  const popularQuery = usePopularPlacesQuery({ page: 0, size: HOME_POPULAR_LIMIT })
  const favoriteIdsQuery = useFavoritePlaceIdsQuery()
  const toggleFavorite = useToggleFavoriteMutation()

  const travelPicks = picksQuery.data ?? []
  const courses = coursesQuery.data ?? []
  const popularPlaces = popularQuery.data ?? []
  const favoriteIds = favoriteIdsQuery.data ?? new Set<string>()

  const picksLoading = FORCE_HOME_SKELETONS || picksQuery.isLoading
  const coursesLoading = FORCE_HOME_SKELETONS || coursesQuery.isLoading
  const popularLoading = FORCE_HOME_SKELETONS || popularQuery.isLoading
  const showTravelPicks = !picksLoading && travelPicks.length > 0
  const showCourses = !coursesLoading && courses.length > 0
  const showPopularPlaces = !popularLoading && popularPlaces.length > 0

  const handleToggleFavorite = (placeId: string) => {
    if (!isAuthenticated) {
      toast.info('즐겨찾기는 로그인 후 이용할 수 있어요.')
      navigate(`${ROUTES.login}?returnTo=${ROUTES.home}`)
      return
    }

    const nextFavorite = !favoriteIds.has(placeId)
    toggleFavorite.mutate(
      { placeId, nextFavorite },
      {
        onError: () => {
          toast.error(
            nextFavorite ? '즐겨찾기 추가에 실패했어요.' : '즐겨찾기 해제에 실패했어요.',
          )
        },
      },
    )
  }

  return (
    <div className={pageStyle}>
      <div className={heroBlockStyle}>
        <section className={heroStyle} aria-label="홈 히어로">
          <img src={homeHeroImage} alt="" className={heroImageStyle} />
          <div className={heroCopyStyle}>
            <h1 className={heroTitleStyle}>
              오늘, 제주에서
              <br />
              어떤 경험을 할까요?
            </h1>
            <p className={heroSubtitleStyle}>나만의 코스를 만들고 뱃지를 모아보세요!</p>
          </div>
        </section>

        <div className={searchWrapStyle}>
          <SearchBar
            className={searchBarElevatedStyle}
            value=""
            onChange={() => undefined}
            placeholder="어디로 떠나고 싶으신가요?"
            onFocus={() => navigate(ROUTES.search)}
          />
        </div>
      </div>

      <section className={sectionStyle} aria-labelledby="home-category-title">
        <SectionHeader
          id="home-category-title"
          title="카테고리"
          actionLabel="전체보기 >"
          onAction={() => navigate(ROUTES.placesPopular)}
        />
        <HorizontalScrollArea as="ul" className={categoryListStyle} aria-label="카테고리 목록">
          {PLACE_CATEGORIES.map((category) => {
            const Icon = category.icon
            return (
              <li key={category.id}>
                <button
                  type="button"
                  className={categoryItemStyle}
                  aria-label={category.label}
                  onClick={() =>
                    navigate(ROUTES.placesPopular, { state: { category: category.label } })
                  }
                >
                  <span
                    className={categoryIconStyle}
                    style={{ backgroundColor: category.bg, color: category.fg }}
                    aria-hidden
                  >
                    <Icon size={20} strokeWidth={1.75} />
                  </span>
                  <span className={categoryLabelStyle}>{category.label}</span>
                </button>
              </li>
            )
          })}
        </HorizontalScrollArea>
      </section>

      <section className={sectionStyle} aria-labelledby="home-travel-picks-title">
        <div className={sectionHeaderStyle}>
          <div>
            <h2 id="home-travel-picks-title" className={sectionTitleStyle}>
              오늘의 관광지 추천
            </h2>
          </div>
          <button
            type="button"
            className={sectionActionStyle}
            onClick={() => navigate(ROUTES.placesPopular)}
          >
            더보기 &gt;
          </button>
        </div>
        <SectionStatus
          isLoading={picksLoading}
          isError={!FORCE_HOME_SKELETONS && picksQuery.isError}
          isEmpty={!picksLoading && !picksQuery.isError && travelPicks.length === 0}
          onRetry={() => void picksQuery.refetch()}
          emptyTitle="추천 관광지가 없어요"
          loadingFallback={<TravelPicksSkeleton />}
        />
        {showTravelPicks ? (
          <div className={travelPickRowStyle}>
            {travelPicks.map((place) => (
              <TravelPickCard
                key={place.placeId}
                title={place.name}
                category={place.categoryName}
                region={place.region}
                address={place.description}
                imageUrl={place.imageUrl}
                bookmarked={favoriteIds.has(place.placeId)}
                isBookmarkPending={
                  toggleFavorite.isPending && toggleFavorite.variables?.placeId === place.placeId
                }
                onToggleBookmark={() => handleToggleFavorite(place.placeId)}
                onClick={() => navigate(placePath(place.placeId))}
              />
            ))}
          </div>
        ) : null}
      </section>

      <section className={sectionStyle} aria-labelledby="home-course-title">
        <SectionHeader
          id="home-course-title"
          title="오늘의 추천 코스"
          actionLabel="더보기 >"
          onAction={() => navigate(ROUTES.courses)}
        />
        <SectionStatus
          isLoading={coursesLoading}
          isError={!FORCE_HOME_SKELETONS && coursesQuery.isError}
          isEmpty={!coursesLoading && !coursesQuery.isError && courses.length === 0}
          onRetry={() => void coursesQuery.refetch()}
          emptyTitle="추천 코스가 없어요"
          loadingFallback={<CoursesSkeleton />}
        />
        {showCourses ? (
          <HorizontalScrollArea
            className={courseRowStyle}
            aria-label="오늘의 추천 코스 목록"
            fade={false}
          >
            {courses.map((course) => {
              const card = mapHomeCourseToCard(course)
              return (
                <CourseRecommendCard
                  key={course.courseId}
                  {...card}
                  onClick={() => navigate(coursePath(course.courseId))}
                />
              )
            })}
          </HorizontalScrollArea>
        ) : null}
      </section>

      <section className={sectionStyle} aria-labelledby="home-popular-title">
        <SectionHeader
          id="home-popular-title"
          title="인기 관광지"
          actionLabel="더보기 >"
          onAction={() => navigate(ROUTES.placesPopular)}
        />
        <SectionStatus
          isLoading={popularLoading}
          isError={!FORCE_HOME_SKELETONS && popularQuery.isError}
          isEmpty={!popularLoading && !popularQuery.isError && popularPlaces.length === 0}
          onRetry={() => void popularQuery.refetch()}
          emptyTitle="인기 관광지가 없어요"
          loadingFallback={<PopularPlacesSkeleton />}
        />
        {showPopularPlaces ? (
          <div className={popularListStyle}>
            {popularPlaces.map((place: PopularPlace) => (
              <PopularPlaceCard
                key={place.placeId}
                title={place.name}
                visitCount={place.visitCount}
                imageUrl={place.imageUrl ?? place.imageUrls[0]}
                onClick={() => navigate(placePath(place.placeId))}
              />
            ))}
          </div>
        ) : null}
      </section>
    </div>
  )
}
