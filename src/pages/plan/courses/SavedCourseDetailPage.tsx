import { useLocation, useNavigate, useParams } from 'react-router'
import { Button } from '@/components/ui/Button/Button'
import { Empty } from '@/components/ui/Empty/Empty'
import { ErrorState } from '@/components/ui/ErrorState/ErrorState'
import { Loading } from '@/components/ui/Loading/Loading'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { ROUTES, placePath } from '@/constants'
import { mapRecommendedCourseDetail, mapSavedCourseDetail } from '@/features/courses/format'
import {
  useDeleteSavedCourseMutation,
  useRecommendedCourseDetailQuery,
  useSavedCourseDetailQuery,
} from '@/features/courses/hooks'
import { CourseDetailView } from '@/pages/courses/components/CourseDetailView/CourseDetailView'
import { pageStyle } from '@/pages/courses/components/CourseDetailView/CourseDetailView.css.ts'
import type { PlanCourseNavigationState } from '@/pages/plan/courses/PlanCourseRecommendPage'

/** 저장한 코스 카드 상세. 추천 코스 상세(CourseDetailPage)와 같은 레이아웃(CourseDetailView)을 쓴다 */
export function SavedCourseDetailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { savedCourseId = '' } = useParams()
  const courseQuery = useSavedCourseDetailQuery(savedCourseId)
  const deleteMutation = useDeleteSavedCourseMutation()
  const goBack = () => navigate(-1)
  const navState = location.state as PlanCourseNavigationState | null

  const sourceId =
    courseQuery.data?.sourceType === 'RECOMMENDED' ? (courseQuery.data.sourceId ?? '') : ''
  const recommendedQuery = useRecommendedCourseDetailQuery(sourceId)
  const isEnriching = Boolean(sourceId) && recommendedQuery.isLoading

  if (courseQuery.isLoading || isEnriching) {
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
          description="저장한 다른 코스를 확인해 보세요."
          action={
            <Button variant="secondary" onClick={() => navigate(ROUTES.planCourseRecommend)}>
              저장한 코스 보기
            </Button>
          }
        />
      </div>
    )
  }

  // 추천 원본이면 코스 id(sourceId) 상세를 우선, 실패 시 저장 상세로 fallback
  const course = recommendedQuery.data
    ? mapRecommendedCourseDetail(recommendedQuery.data)
    : mapSavedCourseDetail(courseQuery.data)

  const handleStart = () => {
    if (!navState?.planId) return
    navigate(ROUTES.planItinerary(navState.planId), {
      state: {
        day: navState.day,
        importCourse: { title: course.title, summary: course.description, steps: course.steps },
      },
    })
  }

  return (
    <CourseDetailView
      course={course}
      onBack={goBack}
      onStepClick={(placeId) => navigate(placePath(placeId))}
      onStart={navState?.planId ? handleStart : undefined}
      saveAction={{
        saved: true,
        isLoading: deleteMutation.isPending,
        onClick: () => {
          deleteMutation.mutate(savedCourseId, { onSuccess: goBack })
        },
      }}
    />
  )
}
