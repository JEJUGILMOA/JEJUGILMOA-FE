import { MapPin } from 'lucide-react'
import { useNavigate, useParams } from 'react-router'
import { Badge } from '@/components/ui/Badge/Badge'
import { Button } from '@/components/ui/Button/Button'
import { Empty } from '@/components/ui/Empty/Empty'
import { ErrorState } from '@/components/ui/ErrorState/ErrorState'
import { Loading } from '@/components/ui/Loading/Loading'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { ROUTES, placePath } from '@/constants'
import { mapRecommendedCourseDetail } from '@/features/courses/format'
import { useRecommendedCourseDetailQuery } from '@/features/courses/hooks'
import {
  badgesRowStyle,
  bodyStyle,
  contentWrapperStyle,
  descriptionStyle,
  footerStyle,
  heroActionsStyle,
  heroIconButtonStyle,
  heroImageStyle,
  heroStyle,
  heroTitleStyle,
  metaStyle,
  pageStyle,
  sectionTitleStyle,
  timelineCardStyle,
  timelineDotStyle,
  timelineItemStyle,
  timelineLineStyle,
  timelinePlaceTitleStyle,
  timelineRailStyle,
  timelineStyle,
  timelineTextStyle,
  timelineThumbStyle,
  timelineTravelStyle,
} from './CourseDetailPage.css.ts'

export function CourseDetailPage() {
  const navigate = useNavigate()
  const { courseId = '' } = useParams()
  const courseQuery = useRecommendedCourseDetailQuery(courseId)
  const goBack = () => navigate(-1)

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
  const headerTitle = course.title

  return (
    <div className={pageStyle}>
      <PageHeader title={headerTitle} showBack onBack={goBack} />

      <section className={heroStyle} aria-label="코스 이미지">
        {course.imageUrl ? (
          <img src={course.imageUrl} alt="" className={heroImageStyle} />
        ) : null}
        <div className={heroActionsStyle}>
          <button type="button" className={heroIconButtonStyle} aria-label="지도에서 보기">
            <MapPin size={18} />
          </button>
        </div>
        <h1 className={heroTitleStyle}>{course.title}</h1>
      </section>

      <div className={bodyStyle}>
        <div className={contentWrapperStyle}>
          {course.badges.length > 0 ? (
            <div className={badgesRowStyle}>
              {course.badges.map((badge) => (
                <Badge key={badge.label} size="sm" status={badge.status}>
                  {badge.label}
                </Badge>
              ))}
            </div>
          ) : null}
          {course.meta ? <p className={metaStyle}>{course.meta}</p> : null}
        </div>

        {course.description ? <p className={descriptionStyle}>{course.description}</p> : null}

        <section>
          <h2 className={sectionTitleStyle}>코스 순서</h2>
          {course.steps.length === 0 ? (
            <Empty title="경유지가 없어요" description="이 코스에는 등록된 장소가 없습니다." />
          ) : (
            <ol className={timelineStyle}>
              {course.steps.map((step, stepIndex) => (
                <li key={`${step.placeId}-${stepIndex}`} className={timelineItemStyle}>
                  <div className={timelineRailStyle}>
                    <span className={timelineDotStyle}>{stepIndex + 1}</span>
                    <span className={timelineLineStyle} aria-hidden />
                  </div>
                  <button
                    type="button"
                    className={timelineCardStyle}
                    onClick={() => navigate(placePath(step.placeId))}
                  >
                    <span
                      className={timelineThumbStyle}
                      style={
                        step.imageUrl
                          ? {
                              backgroundImage: `url(${step.imageUrl})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                            }
                          : undefined
                      }
                      aria-hidden
                    />
                    <span className={timelineTextStyle}>
                      <span className={timelinePlaceTitleStyle}>{step.title}</span>
                      {step.travelLabel ? (
                        <span className={timelineTravelStyle}>{step.travelLabel}</span>
                      ) : null}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>

      <div className={footerStyle}>
        <Button fullWidth size="lg" onClick={() => navigate(ROUTES.plan)}>
          이 코스로 계획 시작하기
        </Button>
      </div>
    </div>
  )
}
