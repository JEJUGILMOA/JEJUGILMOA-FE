import { useLocation, useNavigate, useParams } from 'react-router'
import { Button } from '@/components/ui/Button/Button'
import { Empty } from '@/components/ui/Empty/Empty'
import { ErrorState } from '@/components/ui/ErrorState/ErrorState'
import { Loading } from '@/components/ui/Loading/Loading'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { toast } from '@/components/ui/Toast/Toast'
import { ROUTES, placePath } from '@/constants'
import { mapRecommendedCourseDetail } from '@/features/courses/format'
import {
  findSavedCourseMatch,
  useRecommendedCourseDetailQuery,
  useSavedCoursesQuery,
  useToggleCourseFavoriteMutation,
} from '@/features/courses/hooks'
import type { PlanCourseNavigationState } from '@/pages/plan/courses/PlanCourseRecommendPage'
import { useAuthStore } from '@/stores/authStore'
import { CourseDetailView } from './components/CourseDetailView/CourseDetailView'
import { pageStyle } from './components/CourseDetailView/CourseDetailView.css.ts'

export function CourseDetailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { courseId = '' } = useParams()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const courseQuery = useRecommendedCourseDetailQuery(courseId)
  const savedCoursesQuery = useSavedCoursesQuery({ enabled: isAuthenticated })
  const toggleFavorite = useToggleCourseFavoriteMutation()
  const goBack = () => navigate(-1)
  const navState = location.state as PlanCourseNavigationState | null

  if (courseQuery.isLoading) {
    return (
      <div className={pageStyle}>
        <PageHeader title="코스 상세" showBack onBack={goBack} />
        <Loading label="코스를 불러오는 중…" />
      </div>
    )
  }

  if (courseQuery.isError) {
    return (
      <div className={pageStyle}>
        <PageHeader title="코스 상세" showBack onBack={goBack} />
        <ErrorState onRetry={() => void courseQuery.refetch()} />
      </div>
    )
  }

  if (!courseQuery.data) {
    return (
      <div className={pageStyle}>
        <PageHeader title="코스 상세" showBack onBack={goBack} />
        <Empty
          title="코스를 찾을 수 없어요"
          description="다른 추천 코스를 확인해 보세요."
          action={
            <Button variant="secondary" onClick={() => navigate(ROUTES.courses)}>
              추천 코스 보기
            </Button>
          }
        />
      </div>
    )
  }

  const course = mapRecommendedCourseDetail(courseQuery.data)
  const matchedSaved = findSavedCourseMatch(savedCoursesQuery.data, {
    sourceType: 'RECOMMENDED',
    sourceId: courseId,
    title: courseQuery.data.title,
  })
  const isFavorite = Boolean(matchedSaved)

  const handleStart = () => {
    if (!navState?.planId) return
    navigate(ROUTES.planItinerary(navState.planId), {
      state: {
        day: navState.day,
        importCourse: {
          title: course.title,
          summary: course.description,
          steps: course.steps,
        },
      },
    })
  }

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      toast.info('즐겨찾기는 로그인 후 이용할 수 있어요.')
      navigate(`${ROUTES.login}?returnTo=${encodeURIComponent(location.pathname)}`)
      return
    }

    toggleFavorite.mutate({
      nextFavorite: !isFavorite,
      saveParams: { sourceType: 'RECOMMENDED', sourceId: courseId },
      savedCourseId: matchedSaved?.savedCourseId,
    })
  }

  return (
    <CourseDetailView
      course={course}
      onBack={goBack}
      onStepClick={(placeId) => navigate(placePath(placeId))}
      onStart={navState?.planId ? handleStart : undefined}
      saveAction={{
        saved: isFavorite,
        isLoading: toggleFavorite.isPending || savedCoursesQuery.isLoading,
        onClick: handleToggleFavorite,
      }}
    />
  )
}
