import { Bookmark } from 'lucide-react'
import { Badge, type BadgeProps } from '@/components/ui/Badge/Badge'
import { Button } from '@/components/ui/Button/Button'
import { Empty } from '@/components/ui/Empty/Empty'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { cn } from '@/utils/cn'
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
  pageWithoutCtaStyle,
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
  /** true면 이미 즐겨찾기한 코스 — 아이콘이 채워지고 누르면 해제 */
  saved: boolean
  isLoading?: boolean
  onClick: () => void
}

export type CourseDetailViewProps = {
  course: CourseDetailViewData
  onBack: () => void
  onStepClick: (placeId: string) => void
  /** 일정 편집 등에서 넘어온 경우에만 전달 — 없으면 CTA 숨김 */
  onStart?: () => void
  /** 없으면 즐겨찾기 버튼 자체를 안 보여준다 */
  saveAction?: CourseSaveAction
}

/** 코스 상세 화면 본문. 추천 코스(`CourseDetailPage`)·저장한 코스(`SavedCourseDetailPage`)가
 * 같은 데이터 모양(`mapRecommendedCourseDetail`/`mapSavedCourseDetail`)으로 공유한다 */
export function CourseDetailView({ course, onBack, onStepClick, onStart, saveAction }: CourseDetailViewProps) {
  return (
    <div className={cn(pageStyle, !onStart && pageWithoutCtaStyle)}>
      <PageHeader title={course.title} showBack onBack={onBack} />

      <section className={heroStyle} aria-label="코스 이미지">
        {course.imageUrl ? <img src={course.imageUrl} alt="" className={heroImageStyle} /> : null}
        <div className={heroActionsStyle}>
          {saveAction ? (
            <button
              type="button"
              className={heroIconButtonStyle}
              aria-label={saveAction.saved ? '즐겨찾기 해제' : '즐겨찾기 추가'}
              aria-pressed={saveAction.saved}
              disabled={saveAction.isLoading}
              onClick={saveAction.onClick}
            >
              <Bookmark size={18} fill={saveAction.saved ? 'currentColor' : 'none'} />
            </button>
          ) : null}
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

      {onStart ? (
        <div className={footerStyle}>
          <Button fullWidth size="lg" onClick={onStart}>
            이 코스로 계획 시작하기
          </Button>
        </div>
      ) : null}
    </div>
  )
}
