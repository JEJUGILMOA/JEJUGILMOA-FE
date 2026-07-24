import { useNavigate } from 'react-router'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { PlaceCard } from '@/components/ui/PlaceCard/PlaceCard'
import { coursePath } from '@/constants'
import { MOCK_COURSES } from '@/data/mockExplore'
import { listStyle, pageStyle } from './CourseListPage.css.ts'

export function CourseListPage() {
  const navigate = useNavigate()

  return (
    <div className={pageStyle}>
      <PageHeader title="오늘의 추천 코스" showBack onBack={() => navigate(-1)} />
      <div className={listStyle}>
        {MOCK_COURSES.map((course) => (
          <PlaceCard
            key={course.id}
            variant="horizontal"
            width="100%"
            title={course.title}
            meta={course.summary}
            badges={course.badges}
            onClick={() => navigate(coursePath(course.id))}
          />
        ))}
      </div>
    </div>
  )
}
