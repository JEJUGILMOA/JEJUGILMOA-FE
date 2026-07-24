import { Bookmark, ChevronLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router'
import { Badge } from '@/components/ui/Badge/Badge'
import { Button } from '@/components/ui/Button/Button'
import { Empty } from '@/components/ui/Empty/Empty'
import { ROUTES, placePath } from '@/constants'
import { getCourseById } from '@/data/mockExplore'
import {
  badgesRowStyle,
  bodyStyle,
  footerStyle,
  heroActionsStyle,
  heroIconButtonStyle,
  heroStyle,
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
  titleStyle,
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
          <button type="button" className={heroIconButtonStyle} aria-label="북마크">
            <Bookmark size={18} />
          </button>
        </div>
      </section>

      <div className={bodyStyle}>
        <div>
          <h1 className={titleStyle}>{course.title}</h1>
          <div className={badgesRowStyle}>
            {course.tags?.map((tag) => (
              <Badge
                key={tag}
                size="sm"
                status={tag === '무료' ? 'success' : tag.includes('.') ? 'neutral' : 'info'}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <section>
          <h2 className={sectionTitleStyle}>코스 구성</h2>
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
