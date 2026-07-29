import { ChevronLeft, MapPin } from 'lucide-react'
import { useNavigate, useParams } from 'react-router'
import { Badge } from '@/components/ui/Badge/Badge'
import { Button } from '@/components/ui/Button/Button'
import { Empty } from '@/components/ui/Empty/Empty'
import { ROUTES, placePath } from '@/constants'
import { getCourseById } from '@/data/mockExplore'
import {
  badgesRowStyle,
  bodyStyle,
  contentWrapperStyle,
  descriptionStyle,
  footerStyle,
  heroActionsStyle,
  heroIconButtonStyle,
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
  const course = getCourseById(courseId)

  if (!course) {
    return (
      <div className={pageStyle}>
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

  return (
    <div className={pageStyle}>
      <section className={heroStyle} aria-label="코스 이미지">
        <div className={heroActionsStyle}>
          <button
            type="button"
            className={heroIconButtonStyle}
            aria-label="뒤로 가기"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft size={22} />
          </button>
          <button type="button" className={heroIconButtonStyle} aria-label="지도에서 보기">
            <MapPin size={18} />
          </button>
        </div>
        <h1 className={heroTitleStyle}>{course.title}</h1>
      </section>

      <div className={bodyStyle}>
        <div className={contentWrapperStyle}>
          <div className={badgesRowStyle}>
            {course.badges.map((badge) => (
              <Badge key={badge.label} size="sm" status={badge.status ?? 'success'}>
                {badge.label}
              </Badge>
            ))}
          </div>
          <p className={metaStyle}>{course.meta}</p>
        </div>

        <p className={descriptionStyle}>{course.description}</p>

        <section>
          <h2 className={sectionTitleStyle}>코스 순서</h2>
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
                  <span className={timelineThumbStyle} aria-hidden />
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
