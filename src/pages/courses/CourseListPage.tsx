import { useNavigate } from 'react-router'
import { Empty } from '@/components/ui/Empty/Empty'
import { ErrorState } from '@/components/ui/ErrorState/ErrorState'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { Skeleton } from '@/components/ui/Skeleton/Skeleton'
import { coursePath } from '@/constants'
import { mapRecommendedCourseToListCard } from '@/features/courses/format'
import { useRecommendedCoursesQuery } from '@/features/courses/hooks'
import { CourseListCard } from './components/CourseListCard/CourseListCard'
import {
  listStyle,
  pageStyle,
  skeletonCardStyle,
  skeletonContentStyle,
  skeletonMediaStyle,
  skeletonPreviewRowStyle,
} from './CourseListPage.css.ts'

function CoursesListSkeleton() {
  return (
    <div className={listStyle} aria-hidden>
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className={skeletonCardStyle}>
          <div className={skeletonMediaStyle}>
            <Skeleton width="100%" height="100%" />
          </div>
          <div className={skeletonContentStyle}>
            <Skeleton width="40%" height={12} />
            <Skeleton width="78%" height={20} />
            <Skeleton width="100%" height={14} />
            <Skeleton width="64%" height={14} />
            <div className={skeletonPreviewRowStyle}>
              <Skeleton width={64} height={48} />
              <Skeleton width={64} height={48} />
              <Skeleton width={64} height={48} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function CourseListPage() {
  const navigate = useNavigate()
  const coursesQuery = useRecommendedCoursesQuery()
  const courses = coursesQuery.data ?? []

  return (
    <div className={pageStyle}>
      <PageHeader title="오늘의 추천 코스" showBack onBack={() => navigate(-1)} />

      {coursesQuery.isLoading ? <CoursesListSkeleton /> : null}
      {coursesQuery.isError ? (
        <ErrorState onRetry={() => void coursesQuery.refetch()} />
      ) : null}

      {!coursesQuery.isLoading && !coursesQuery.isError ? (
        courses.length === 0 ? (
          <Empty
            title="추천 코스가 없어요"
            description="잠시 후 다시 확인해 주세요."
          />
        ) : (
          <div className={listStyle}>
            {courses.map((course) => {
              const card = mapRecommendedCourseToListCard(course)
              return (
                <CourseListCard
                  key={course.courseId}
                  {...card}
                  onViewClick={() => navigate(coursePath(course.courseId))}
                />
              )
            })}
          </div>
        )
      ) : null}
    </div>
  )
}
