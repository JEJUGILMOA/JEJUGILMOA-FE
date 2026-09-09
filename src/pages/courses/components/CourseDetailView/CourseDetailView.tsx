import { Heart, MapPin } from 'lucide-react'
import { Badge, type BadgeProps } from '@/components/ui/Badge/Badge'
import { Button } from '@/components/ui/Button/Button'
import { Empty } from '@/components/ui/Empty/Empty'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
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
} from './CourseDetailView.css.ts'

export type CourseDetailViewStep = {
  placeId: string
  title: string
  imageUrl?: string
  travelLabel?: string
}

export type CourseDetailViewData = {
  title: string
  description?: string
  imageUrl?: string
  meta: string
  badges: { label: string; status: NonNullable<BadgeProps['status']> }[]
  steps: CourseDetailViewStep[]
}

export type CourseSaveAction = {
  /** true면 이미 저장된 코스 — 하트가 채워지고 누르면 저장 취소 동작을 한다 */
  saved: boolean
  isLoading?: boolean
  onClick: () => void
}

export type CourseDetailViewProps = {
  course: CourseDetailViewData
  onBack: () => void
  onStepClick: (placeId: string) => void
  onStart: () => void
  /** 없으면 저장 버튼 자체를 안 보여준다 */
  saveAction?: CourseSaveAction
}

/** 코스 상세 화면 본문. 추천 코스(`CourseDetailPage`)·저장한 코스(`SavedCourseDetailPage`)가
 * 같은 데이터 모양(`mapRecommendedCourseDetail`/`mapSavedCourseDetail`)으로 공유한다 */
export function CourseDetailView({ course, onBack, onStepClick, onStart, saveAction }: CourseDetailViewProps) {
  return (
    <div className={pageStyle}>
      <PageHeader title={course.title} showBack onBack={onBack} />

      <section className={heroStyle} aria-label="코스 이미지">
        {course.imageUrl ? <img src={course.imageUrl} alt="" className={heroImageStyle} /> : null}
        <div className={heroActionsStyle}>
          {saveAction ? (
            <button
              type="button"
              className={heroIconButtonStyle}
              aria-label={saveAction.saved ? '저장 취소' : '코스 저장'}
              aria-pressed={saveAction.saved}
              disabled={saveAction.isLoading}
              onClick={saveAction.onClick}
            >
              <Heart size={18} fill={saveAction.saved ? 'currentColor' : 'none'} />
            </button>
          ) : null}
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
                    onClick={() => onStepClick(step.placeId)}
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
        <Button fullWidth size="lg" onClick={onStart}>
          이 코스로 계획 시작하기
        </Button>
      </div>
    </div>
  )
}
