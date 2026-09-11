import { useState } from 'react'
import { Bookmark, ChevronDown, ChevronRight, ChevronUp } from 'lucide-react'
import courseIntroBackground from '@/assets/icons/course/course-intro-background.svg'
import keywordHashIcon from '@/assets/icons/course/keyword-hash.svg'
import { Button } from '@/components/ui/Button/Button'
import { Empty } from '@/components/ui/Empty/Empty'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import type { CourseImageTag } from '@/data/mockExplore'
import { cn } from '@/utils/cn'
import {
  bodyStyle,
  descriptionCollapsedStyle,
  descriptionStyle,
  footerStyle,
  heroActionsStyle,
  heroCopyStyle,
  heroIconButtonStyle,
  heroImageStyle,
  heroOverlayStyle,
  heroStyle,
  heroTitleStyle,
  introBackgroundStyle,
  introCardStyle,
  introContentStyle,
  introTitleStyle,
  keywordHeaderTitleStyle,
  keywordListStyle,
  keywordRecipe,
  moreButtonStyle,
  pageStyle,
  pageWithoutCtaStyle,
  sectionCountStyle,
  sectionHeaderStyle,
  sectionStyle,
  sectionTitleStyle,
  summaryDividerStyle,
  summaryIconRecipe,
  summaryItemStyle,
  summaryRowStyle,
  summaryValueStyle,
  timelineCardStyle,
  timelineChevronStyle,
  timelineDotStyle,
  timelineItemStyle,
  timelineLineStyle,
  timelinePlaceDescStyle,
  timelinePlaceTitleStyle,
  timelineRailStyle,
  timelineStyle,
  timelineTextStyle,
  timelineThumbStyle,
} from './CourseDetailView.css.ts'
import { CarIcon, DepartureLocationIcon, EstimatedTimeIcon } from './CourseSummaryIcons.tsx'

const DESCRIPTION_COLLAPSE_LENGTH = 90

export type CourseDetailViewStep = {
  placeId: string
  title: string
  imageUrl?: string
  description?: string
  travelLabel?: string
}

export type CourseDetailViewData = {
  title: string
  description?: string
  imageUrl?: string
  region?: string
  duration?: string
  transport?: string
  placeCount?: number
  tags: string[]
  imageTags: CourseImageTag[]
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
  const [descriptionExpanded, setDescriptionExpanded] = useState(false)
  const canToggleDescription =
    Boolean(course.description) && course.description!.length > DESCRIPTION_COLLAPSE_LENGTH

  const summaryItems = [
    course.region
      ? {
          key: 'region',
          icon: <DepartureLocationIcon className={summaryIconRecipe({ tone: 'green' })} />,
          value: course.region,
        }
      : null,
    course.duration
      ? {
          key: 'duration',
          icon: <EstimatedTimeIcon className={summaryIconRecipe({ tone: 'blue' })} />,
          value: course.duration,
        }
      : null,
    course.transport
      ? {
          key: 'transport',
          icon: <CarIcon className={summaryIconRecipe({ tone: 'blue' })} />,
          value: course.transport,
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => item != null)

  return (
    <div className={cn(pageStyle, !onStart && pageWithoutCtaStyle)}>
      <PageHeader title="코스 상세" showBack onBack={onBack} />

      <section className={heroStyle} aria-label="코스 이미지">
        {course.imageUrl ? <img src={course.imageUrl} alt="" className={heroImageStyle} /> : null}
        <div className={heroOverlayStyle} aria-hidden />
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
        <div className={heroCopyStyle}>
          <h1 className={heroTitleStyle}>{course.title}</h1>
        </div>
      </section>

      <div className={bodyStyle}>
        {summaryItems.length > 0 ? (
          <div
            className={summaryRowStyle}
            style={{ gridTemplateColumns: `repeat(${summaryItems.length}, minmax(0, 1fr))` }}
          >
            {summaryItems.map((item, index) => (
              <div key={item.key} className={summaryItemStyle}>
                {index > 0 ? <span className={summaryDividerStyle} aria-hidden /> : null}
                {item.icon}
                <p className={summaryValueStyle}>{item.value}</p>
              </div>
            ))}
          </div>
        ) : null}

        {course.description ? (
          <section className={introCardStyle}>
            <img src={courseIntroBackground} alt="" className={introBackgroundStyle} aria-hidden />
            <div className={introContentStyle}>
              <h2 className={introTitleStyle}>코스 소개</h2>
              <p
                className={cn(
                  descriptionStyle,
                  !descriptionExpanded && canToggleDescription && descriptionCollapsedStyle,
                )}
              >
                {course.description}
              </p>
              {canToggleDescription ? (
                <button
                  type="button"
                  className={moreButtonStyle}
                  onClick={() => setDescriptionExpanded((prev) => !prev)}
                >
                  {descriptionExpanded ? '접기' : '더보기'}
                  {descriptionExpanded ? (
                    <ChevronUp size={14} strokeWidth={2.2} aria-hidden />
                  ) : (
                    <ChevronDown size={14} strokeWidth={2.2} aria-hidden />
                  )}
                </button>
              ) : null}
            </div>
          </section>
        ) : null}

        {course.tags.length > 0 ? (
          <section className={sectionStyle}>
            <div className={sectionHeaderStyle}>
              <h2 className={keywordHeaderTitleStyle}>
                <img src={keywordHashIcon} alt="" width={20} height={20} aria-hidden />
                이 코스의 키워드
              </h2>
              <p className={sectionCountStyle}>총 {course.tags.length}개</p>
            </div>
            <div className={keywordListStyle}>
              {course.imageTags.map((tag) => (
                <span key={tag.label} className={keywordRecipe({ tone: tag.tone })}>
                  {tag.label}
                </span>
              ))}
            </div>
          </section>
        ) : null}

        <section className={sectionStyle}>
          <div className={sectionHeaderStyle}>
            <h2 className={sectionTitleStyle}>여행 코스</h2>
            <p className={sectionCountStyle}>총 {course.placeCount ?? course.steps.length}곳</p>
          </div>
          {course.steps.length === 0 ? (
            <Empty title="경유지가 없어요" description="이 코스에는 등록된 장소가 없습니다." />
          ) : (
            <ol className={timelineStyle}>
              {course.steps.map((step, stepIndex) => {
                const subtitle = step.description ?? step.travelLabel
                return (
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
                              }
                            : undefined
                        }
                        aria-hidden
                      />
                      <span className={timelineTextStyle}>
                        <span className={timelinePlaceTitleStyle}>{step.title}</span>
                        {subtitle ? <span className={timelinePlaceDescStyle}>{subtitle}</span> : null}
                      </span>
                      <ChevronRight
                        size={18}
                        strokeWidth={2.2}
                        className={timelineChevronStyle}
                        aria-hidden
                      />
                    </button>
                  </li>
                )
              })}
            </ol>
          )}
        </section>
      </div>

      {onStart ? (
        <div className={footerStyle}>
          <Button fullWidth size="lg" onClick={onStart}>
            이 코스로 여행 계획 만들기
          </Button>
        </div>
      ) : null}
    </div>
  )
}
