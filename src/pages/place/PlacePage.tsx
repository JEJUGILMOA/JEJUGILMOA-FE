import { Bookmark, ChevronLeft, Star } from 'lucide-react'
import { useNavigate, useParams } from 'react-router'
import { Button } from '@/components/ui/Button/Button'
import { Empty } from '@/components/ui/Empty/Empty'
import { ROUTES } from '@/constants'
import { MOCK_REVIEWS, getPlaceById } from '@/data/mockExplore'
import {
  bodyStyle,
  descriptionStyle,
  footerStyle,
  heroActionsStyle,
  heroIconButtonStyle,
  heroStyle,
  infoItemStyle,
  infoLabelStyle,
  infoListStyle,
  infoValueStyle,
  metaRowStyle,
  pageStyle,
  photoItemStyle,
  photoListStyle,
  ratingStyle,
  reviewContentStyle,
  reviewDateStyle,
  reviewHeaderStyle,
  reviewItemStyle,
  reviewListStyle,
  reviewUserStyle,
  sectionTitleStyle,
  titleStyle,
} from './PlacePage.css.ts'

export function PlacePage() {
  const navigate = useNavigate()
  const { placeId = '' } = useParams()
  const place = getPlaceById(placeId)

  if (!place) {
    return (
      <div className={pageStyle}>
        <Empty
          title="장소를 찾을 수 없어요"
          description="올바른 장소로 다시 이동해 주세요."
          action={
            <Button variant="secondary" onClick={() => navigate(ROUTES.placesPopular)}>
              인기 관광지 보기
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className={pageStyle}>
      <section className={heroStyle} aria-label="장소 이미지">
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
          <h1 className={titleStyle}>{place.title}</h1>
          <div className={metaRowStyle}>
            <span>{place.category}</span>
            <span>·</span>
            <span>{place.location}</span>
            <span className={ratingStyle}>
              <Star size={14} fill="currentColor" strokeWidth={0} color="#FFB721" />
              {place.rating.toFixed(1)}
            </span>
          </div>
        </div>

        {place.description ? <p className={descriptionStyle}>{place.description}</p> : null}

        <ul className={infoListStyle}>
          {place.hours ? (
            <li className={infoItemStyle}>
              <span className={infoLabelStyle}>영업시간</span>
              <span className={infoValueStyle}>{place.hours}</span>
            </li>
          ) : null}
          {place.distance ? (
            <li className={infoItemStyle}>
              <span className={infoLabelStyle}>거리</span>
              <span className={infoValueStyle}>{place.distance}</span>
            </li>
          ) : null}
          {place.fee ? (
            <li className={infoItemStyle}>
              <span className={infoLabelStyle}>입장료</span>
              <span className={infoValueStyle}>{place.fee}</span>
            </li>
          ) : null}
        </ul>

        <section>
          <h2 className={sectionTitleStyle}>사진</h2>
          <div className={photoListStyle}>
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className={photoItemStyle}>
                사진
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className={sectionTitleStyle}>리뷰</h2>
          <ul className={reviewListStyle}>
            {MOCK_REVIEWS.map((review) => (
              <li key={review.id} className={reviewItemStyle}>
                <div className={reviewHeaderStyle}>
                  <span className={reviewUserStyle}>{review.userName}</span>
                  <span className={reviewDateStyle}>{review.date}</span>
                </div>
                <span className={ratingStyle}>
                  <Star size={14} fill="currentColor" strokeWidth={0} color="#FFB721" />
                  {review.rating.toFixed(1)}
                </span>
                <p className={reviewContentStyle}>{review.content}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className={footerStyle}>
        <Button variant="outline" size="lg" fullWidth onClick={() => navigate(ROUTES.plan)}>
          코스에 추가
        </Button>
        <Button
          size="lg"
          fullWidth
          onClick={() => navigate(`${ROUTES.map}?placeId=${place.id}`)}
        >
          길찾기
        </Button>
      </div>
    </div>
  )
}
