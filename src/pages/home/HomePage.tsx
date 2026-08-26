import { useNavigate } from 'react-router'
import homeHeroImage from '@/assets/images/home-hero.png'
import { HorizontalScrollArea } from '@/components/ui/HorizontalScrollArea/HorizontalScrollArea'
import { SearchBar } from '@/components/ui/SearchBar/SearchBar'
import { TravelPickCard } from './components/TravelPickCard/TravelPickCard'
import { CourseRecommendCard } from './components/CourseRecommendCard/CourseRecommendCard'
import { PopularPlaceCard } from './components/PopularPlaceCard/PopularPlaceCard'
import { PLACE_CATEGORIES, ROUTES, coursePath, placePath } from '@/constants'
import {
  MOCK_COURSES,
  MOCK_PLACES,
  MOCK_TRAVEL_PICKS,
  getCoursePreviewSteps,
  getPlaceImageUrls,
} from '@/data/mockExplore'
import {
  categoryIconStyle,
  categoryItemStyle,
  categoryLabelStyle,
  categoryListStyle,
  courseRowStyle,
  heroCopyStyle,
  heroBlockStyle,
  heroImageStyle,
  heroStyle,
  heroSubtitleStyle,
  heroTitleStyle,
  pageStyle,
  popularListStyle,
  searchBarElevatedStyle,
  searchWrapStyle,
  sectionActionStyle,
  sectionHeaderStyle,
  sectionStyle,
  sectionTitleStyle,
  travelPickRowStyle,
} from './HomePage.css.ts'

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
        <HorizontalScrollArea as="ul" className={categoryListStyle} aria-label="카테고리 목록">
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
        <HorizontalScrollArea
          className={courseRowStyle}
          aria-label="오늘의 추천 코스 목록"
          fade={false}
        >
          {MOCK_COURSES.map((course) => (
            <CourseRecommendCard
              key={course.id}
              title={course.title}
              description={course.description}
              imageUrl={course.imageUrl}
              imageTags={course.imageTags}
              locationLabel={course.locationLabel}
              duration={course.duration}
              placeCount={course.steps.length}
              previewSteps={getCoursePreviewSteps(course)}
              onClick={() => navigate(coursePath(course.id))}
            />
          ))}
        </HorizontalScrollArea>
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
            <PopularPlaceCard
              key={place.id}
              title={place.title}
              rating={place.rating}
              imageUrl={getPlaceImageUrls(place, 1)[0]}
              onClick={() => navigate(placePath(place.id))}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
