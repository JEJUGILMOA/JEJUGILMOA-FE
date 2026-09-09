import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Empty } from '@/components/ui/Empty/Empty'
import { ErrorState } from '@/components/ui/ErrorState/ErrorState'
import { Loading } from '@/components/ui/Loading/Loading'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { SegmentedControl, type SegmentedControlItem } from '@/components/ui/SegmentedControl/SegmentedControl'
import { coursePath, savedCoursePath } from '@/constants'
import { mapRecommendedCourseToListCard, mapSavedCourseToListCard } from '@/features/courses/format'
import { useRecommendedCoursesQuery, useSavedCoursesQuery } from '@/features/courses/hooks'
import { CourseListCard } from '@/pages/courses/components/CourseListCard/CourseListCard'
import { listStyle, pageStyle } from './PlanCourseRecommendPage.css.ts'

type CourseTab = 'recommended' | 'saved'

const TABS: SegmentedControlItem[] = [
  { value: 'recommended', label: '추천 코스' },
  { value: 'saved', label: '저장한 코스' },
]

/** 일정 화면 "코스 추천" 버튼으로 들어오는 전용 페이지. 홈 "코스" 화면과 별개로,
 * 추천 코스/저장한 코스를 한 화면에서 탭으로 오갈 수 있게 한다. */
export function PlanCourseRecommendPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<CourseTab>('recommended')
  const goBack = () => navigate(-1)

  const recommendedQuery = useRecommendedCoursesQuery()
  const savedQuery = useSavedCoursesQuery()
  const isRecommended = tab === 'recommended'
  const activeQuery = isRecommended ? recommendedQuery : savedQuery

  return (
    <div className={pageStyle}>
      <PageHeader title="코스 추천" showBack onBack={goBack} />

      <SegmentedControl
        items={TABS}
        value={tab}
        onChange={(value) => setTab(value as CourseTab)}
        aria-label="코스 보기 전환"
        fullWidth
      />

      {activeQuery.isLoading ? <Loading label="코스를 불러오는 중…" /> : null}
      {activeQuery.isError ? <ErrorState onRetry={() => void activeQuery.refetch()} /> : null}

      {!activeQuery.isLoading && !activeQuery.isError ? (
        isRecommended ? (
          (recommendedQuery.data?.length ?? 0) > 0 ? (
            <div className={listStyle}>
              {recommendedQuery.data?.map((course) => (
                <CourseListCard
                  key={course.courseId}
                  {...mapRecommendedCourseToListCard(course)}
                  onViewClick={() => navigate(coursePath(course.courseId))}
                />
              ))}
            </div>
          ) : (
            <Empty title="추천 코스가 없어요" description="잠시 후 다시 확인해 주세요." />
          )
        ) : (savedQuery.data?.length ?? 0) > 0 ? (
          <div className={listStyle}>
            {savedQuery.data?.map((course) => (
              <CourseListCard
                key={course.savedCourseId}
                {...mapSavedCourseToListCard(course)}
                onViewClick={() => navigate(savedCoursePath(course.savedCourseId))}
              />
            ))}
          </div>
        ) : (
          <Empty title="저장한 코스가 없어요" description="마음에 드는 코스를 저장해보세요." />
        )
      ) : null}
    </div>
  )
}
