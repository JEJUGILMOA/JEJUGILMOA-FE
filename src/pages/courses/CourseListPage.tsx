import { useNavigate } from 'react-router'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { coursePath } from '@/constants'
import { MOCK_COURSES, getCoursePreviewSteps } from '@/data/mockExplore'
import { CourseListCard } from './components/CourseListCard/CourseListCard'
import { listStyle, pageStyle } from './CourseListPage.css.ts'

export function CourseListPage() {
  const navigate = useNavigate()

  return (
    <div className={pageStyle}>
      <PageHeader title="오늘의 추천 코스" showBack onBack={() => navigate(-1)} />
      <div className={listStyle}>
        {MOCK_COURSES.map((course) => (
          <CourseListCard
            key={course.id}
            title={course.title}
            description={course.description}
            imageUrl={course.imageUrl}
            imageTags={course.imageTags}
            locationLabel={course.locationLabel}
            duration={course.duration}
            placeCount={course.steps.length}
            transport={course.transport}
            distanceFromMe={course.distanceFromMe}
            previewSteps={getCoursePreviewSteps(course)}
            onViewClick={() => navigate(coursePath(course.id))}
          />
        ))}
      </div>
    </div>
  )
}
