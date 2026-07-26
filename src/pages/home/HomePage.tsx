import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent,
  type TransitionEvent,
} from 'react'
import { useNavigate } from 'react-router'
import homeHeroImage from '@/assets/images/home-hero.png'
import { HorizontalScrollArea } from '@/components/ui/HorizontalScrollArea/HorizontalScrollArea'
import { PlaceCard } from '@/components/ui/PlaceCard/PlaceCard'
import { SearchBar } from '@/components/ui/SearchBar/SearchBar'
import { TravelPickCard } from './components/TravelPickCard/TravelPickCard'
import { PLACE_CATEGORIES, ROUTES, coursePath, placePath } from '@/constants'
import { MOCK_COURSES, MOCK_PLACES, MOCK_TRAVEL_PICKS } from '@/data/mockExplore'
import {
  categoryIconStyle,
  categoryItemStyle,
  categoryLabelStyle,
  categoryListStyle,
  courseCarouselStyle,
  courseSlideStyle,
  courseTrackStyle,
  courseViewportStyle,
  dotRecipe,
  dotsStyle,
  heroCopyStyle,
  heroBlockStyle,
  heroImageStyle,
  heroStyle,
  heroSubtitleStyle,
  heroTitleStyle,
  pageStyle,
  popularCardStyle,
  popularListStyle,
  searchBarElevatedStyle,
  searchWrapStyle,
  sectionActionStyle,
  sectionHeaderStyle,
  sectionStyle,
  sectionTitleStyle,
  travelPickRowStyle,
} from './HomePage.css.ts'

const COURSE_AUTO_MS = 3500
const COURSE_TRANSITION_MS = 420
const SWIPE_THRESHOLD_PX = 48
const SWIPE_AXIS_LOCK_PX = 8

type DragState = {
  pointerId: number
  startX: number
  startY: number
  deltaX: number
  axis: 'undecided' | 'x' | 'y'
}

const COURSE_COUNT = MOCK_COURSES.length
const COURSE_SLIDES = [
  MOCK_COURSES[COURSE_COUNT - 1],
  ...MOCK_COURSES,
  MOCK_COURSES[0],
]
const HOME_POPULAR_PLACES = MOCK_PLACES.slice(0, 4)

function SectionHeader({
  id,
  title,
  actionLabel,
  onAction,
}: {
  id: string
  title: string
  actionLabel: string
  onAction?: () => void
}) {
  return (
    <div className={sectionHeaderStyle}>
      <h2 id={id} className={sectionTitleStyle}>
        {title}
      </h2>
      <button type="button" className={sectionActionStyle} onClick={onAction}>
        {actionLabel}
      </button>
    </div>
  )
}

export function HomePage() {
  const navigate = useNavigate()
  /** 실슬라이드: 1..COURSE_COUNT, 0=마지막 복제, COURSE_COUNT+1=첫 복제 */
  const [index, setIndex] = useState(1)
  const [animate, setAnimate] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const trackRef = useRef<HTMLDivElement>(null)
  const indexRef = useRef(1)
  const dragRef = useRef<DragState | null>(null)
  const reduceMotionRef = useRef(false)

  indexRef.current = index

  const activeDotIndex = ((index - 1) % COURSE_COUNT + COURSE_COUNT) % COURSE_COUNT

  // 복제→실슬라이드 점프 직후 transition 재활성 (DOM 반영 후)
  useLayoutEffect(() => {
    if (animate) return
    void trackRef.current?.offsetHeight
    setAnimate(true)
  }, [animate, index])

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    reduceMotionRef.current = media.matches
    const onChange = () => {
      reduceMotionRef.current = media.matches
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  const goNext = useCallback(() => {
    if (dragRef.current) return
    setAnimate(true)
    setIndex((prev) => prev + 1)
  }, [])

  const goToSlide = useCallback((realIndex: number) => {
    if (dragRef.current) return
    setDragOffset(0)
    setIsDragging(false)
    setAnimate(true)
    setIndex((((realIndex % COURSE_COUNT) + COURSE_COUNT) % COURSE_COUNT) + 1)
  }, [])

  useEffect(() => {
    if (isPaused || isDragging || reduceMotionRef.current || COURSE_COUNT <= 1) return
    if (index === 0 || index === COURSE_COUNT + 1) return
    const timer = window.setInterval(goNext, COURSE_AUTO_MS)
    return () => window.clearInterval(timer)
  }, [goNext, index, isDragging, isPaused])

  const snapFromClone = useCallback(() => {
    const current = indexRef.current
    if (current === COURSE_COUNT + 1) {
      setAnimate(false)
      setIndex(1)
      return
    }
    if (current === 0) {
      setAnimate(false)
      setIndex(COURSE_COUNT)
    }
  }, [])

  // transitionend 누락 대비
  useEffect(() => {
    if (isDragging) return
    if (index !== 0 && index !== COURSE_COUNT + 1) return
    const timer = window.setTimeout(snapFromClone, COURSE_TRANSITION_MS + 50)
    return () => window.clearTimeout(timer)
  }, [index, isDragging, snapFromClone])

  const handleTrackTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return
    if (event.propertyName !== 'transform') return
    snapFromClone()
  }

  const finishDrag = useCallback((deltaX: number) => {
    dragRef.current = null
    setIsDragging(false)
    setDragOffset(0)
    setAnimate(true)

    if (Math.abs(deltaX) >= SWIPE_THRESHOLD_PX) {
      setIndex((prev) => (deltaX < 0 ? prev + 1 : prev - 1))
    }

    setIsPaused(false)
  }, [])

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (COURSE_COUNT <= 1) return
    if (event.pointerType === 'mouse' && event.button !== 0) return

    const current = indexRef.current
    if (current === 0 || current === COURSE_COUNT + 1) return

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      deltaX: 0,
      axis: 'undecided',
    }
    setIsPaused(true)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return

    const dx = event.clientX - drag.startX
    const dy = event.clientY - drag.startY

    if (drag.axis === 'undecided') {
      if (Math.abs(dx) < SWIPE_AXIS_LOCK_PX && Math.abs(dy) < SWIPE_AXIS_LOCK_PX) return
      drag.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'
      if (drag.axis === 'y') {
        dragRef.current = null
        setIsPaused(false)
        return
      }
      event.currentTarget.setPointerCapture(event.pointerId)
    }

    if (drag.axis !== 'x') return

    drag.deltaX = dx
    setIsDragging(true)
    setDragOffset(dx)
  }

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    if (drag.axis !== 'x') {
      dragRef.current = null
      setIsPaused(false)
      return
    }

    finishDrag(drag.deltaX)
  }

  const handlePointerCancel = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    dragRef.current = null
    setIsDragging(false)
    setDragOffset(0)
    setAnimate(true)
    setIsPaused(false)
  }

  return (
    <div className={pageStyle}>
      <div className={heroBlockStyle}>
        <section className={heroStyle} aria-label="홈 히어로">
          <img src={homeHeroImage} alt="" className={heroImageStyle} />
          <div className={heroCopyStyle}>
            <h1 className={heroTitleStyle}>
              오늘, 제주에서
              <br />
              어떤 경험을 할까요?
            </h1>
            <p className={heroSubtitleStyle}>나만의 코스를 만들고 뱃지를 모아보세요!</p>
          </div>
        </section>

        <div className={searchWrapStyle}>
          <SearchBar
            className={searchBarElevatedStyle}
            value=""
            onChange={() => undefined}
            placeholder="어디로 떠나고 싶으신가요?"
            onFocus={() => navigate(ROUTES.search)}
          />
        </div>
      </div>

      <section className={sectionStyle} aria-labelledby="home-category-title">
        <SectionHeader
          id="home-category-title"
          title="카테고리"
          actionLabel="전체보기 >"
          onAction={() => navigate(ROUTES.placesPopular)}
        />
        <HorizontalScrollArea
          as="ul" className={categoryListStyle}
          aria-label="카테고리 목록"
        >
          {PLACE_CATEGORIES.map((category) => {
            const Icon = category.icon
            return (
              <li key={category.id}>
                <button
                  type="button"
                  className={categoryItemStyle}
                  aria-label={category.label}
                  onClick={() =>
                    navigate(ROUTES.placesPopular, { state: { category: category.label } })
                  }
                >
                  <span
                    className={categoryIconStyle}
                    style={{ backgroundColor: category.bg, color: category.fg }}
                    aria-hidden
                  >
                    <Icon size={20} strokeWidth={1.75} />
                  </span>
                  <span className={categoryLabelStyle}>{category.label}</span>
                </button>
              </li>
            )
          })}
        </HorizontalScrollArea>
      </section>

      <section className={sectionStyle} aria-labelledby="home-travel-picks-title">
        <div className={sectionHeaderStyle}>
          <div>
            <h2 id="home-travel-picks-title" className={sectionTitleStyle}>
              오늘의 관광지 추천
            </h2>
          </div>
          <button
            type="button"
            className={sectionActionStyle}
            onClick={() => navigate(ROUTES.placesPopular)}
          >
            더보기 &gt;
          </button>
        </div>
        <div className={travelPickRowStyle}>
          {MOCK_TRAVEL_PICKS.map((pick) => (
            <TravelPickCard
              key={pick.id}
              title={pick.title}
              eyebrow={pick.eyebrow}
              region={pick.region}
              description={pick.description}
              tags={pick.tags}
              rating={pick.rating}
              duration={pick.duration}
              badge={pick.badge}
              imageUrl={pick.imageUrl}
              accent={pick.theme.accent}
              starColor={pick.theme.starColor}
              onClick={() => navigate(placePath(pick.placeId))}
            />
          ))}
        </div>
      </section>

      <section className={sectionStyle} aria-labelledby="home-course-title">
        <SectionHeader
          id="home-course-title"
          title="오늘의 추천 코스"
          actionLabel="더보기 >"
          onAction={() => navigate(ROUTES.courses)}
        />
        <div
          className={courseCarouselStyle}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => {
            if (!dragRef.current) setIsPaused(false)
          }}
        >
          <div
            className={courseViewportStyle}
            aria-roledescription="carousel"
            aria-live="polite"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
          >
            <div
              ref={trackRef}
              className={courseTrackStyle}
              style={{
                transform: `translateX(calc(-${index * 100}% + ${dragOffset}px))`,
                transition:
                  animate && !isDragging
                    ? `transform ${COURSE_TRANSITION_MS}ms ease`
                    : 'none',
              }}
              onTransitionEnd={handleTrackTransitionEnd}
            >
              {COURSE_SLIDES.map((course, slideIndex) => (
                <div
                  key={`${course.id}-${slideIndex}`}
                  className={courseSlideStyle}
                  aria-hidden={slideIndex !== index}
                >
                  <PlaceCard
                    variant="horizontal"
                    width="100%"
                    title={course.title}
                    meta={course.meta}
                    badges={course.badges}
                    onClick={() => navigate(coursePath(course.id))}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className={dotsStyle} role="tablist" aria-label="추천 코스 페이지">
            {MOCK_COURSES.map((course, courseIndex) => (
              <button
                key={course.id}
                type="button"
                className={dotRecipe({ active: courseIndex === activeDotIndex })}
                role="tab"
                aria-selected={courseIndex === activeDotIndex}
                aria-label={`${courseIndex + 1}번째 추천 코스`}
                onClick={() => goToSlide(courseIndex)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className={sectionStyle} aria-labelledby="home-popular-title">
        <SectionHeader
          id="home-popular-title"
          title="인기 관광지"
          actionLabel="더보기 >"
          onAction={() => navigate(ROUTES.placesPopular)}
        />
        <div className={popularListStyle}>
          {HOME_POPULAR_PLACES.map((place) => (
            <PlaceCard
              key={place.id}
              className={popularCardStyle}
              variant="vertical"
              width={148}
              title={place.title}
              rating={place.rating}
              onClick={() => navigate(placePath(place.id))}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
