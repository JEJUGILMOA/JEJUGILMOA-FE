import { ChevronLeft, Globe, MapPin, Phone } from 'lucide-react'
import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router'
import { isApiError } from '@/api/error'
import { Button } from '@/components/ui/Button/Button'
import { Empty } from '@/components/ui/Empty/Empty'
import { ErrorState } from '@/components/ui/ErrorState/ErrorState'
import { Loading } from '@/components/ui/Loading/Loading'
import { ROUTES } from '@/constants'
import { usePlaceQuery } from '@/features/places/hooks'
import type { Place } from '@/features/places/types'
import {
  bodyStyle,
  descriptionStyle,
  footerStyle,
  heroActionsStyle,
  heroIconButtonStyle,
  heroStyle,
  heroTitleStyle,
  infoIconStyle,
  infoItemStyle,
  infoLabelStyle,
  infoListStyle,
  infoValueStyle,
  metaRowStyle,
  metaTextStyle,
  pageStyle,
  photoImgStyle,
  photoItemStyle,
  photoListStyle,
  sectionTitleStyle,
} from './PlacePage.css.ts'

function getPlaceDescription(place: Place) {
  return place.overview?.trim() || place.description?.trim() || ''
}

function getPlacePhotos(place: Place) {
  const urls = new Set<string>()
  if (place.imageUrl) urls.add(place.imageUrl)
  for (const url of place.images) {
    if (url) urls.add(url)
  }
  return [...urls]
}

export function PlacePage() {
  const navigate = useNavigate()
  const { placeId = '' } = useParams()
  const { data: place, isPending, isError, error, refetch } = usePlaceQuery(placeId)

  const photos = useMemo(() => (place ? getPlacePhotos(place) : []), [place])
  const description = place ? getPlaceDescription(place) : ''
  const categoryLabel = place?.categoryName?.trim()
  const locationLabel = place?.address?.trim()
  const metaLabel = [categoryLabel, locationLabel].filter(Boolean).join(' · ')
  const hasContactInfo = Boolean(place?.tel || place?.homepage)

  const heroBackgroundStyle = place?.imageUrl
    ? {
        backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0.55) 100%), url(${place.imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : undefined

  if (!placeId) {
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

  if (isPending) {
    return (
      <div className={pageStyle}>
        <Loading label="장소 정보 불러오는 중" />
      </div>
    )
  }

  if (isError) {
    if (isApiError(error) && error.status === 404) {
      return (
        <div className={pageStyle}>
          <Empty
            title="장소를 찾을 수 없어요"
            description="삭제되었거나 존재하지 않는 장소예요."
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
        <ErrorState onRetry={() => void refetch()} />
      </div>
    )
  }

  if (!place) {
    return null
  }

  return (
    <div className={pageStyle}>
      <section className={heroStyle} style={heroBackgroundStyle} aria-label="장소 이미지">
        <div className={heroActionsStyle}>
          <button
            type="button"
            className={heroIconButtonStyle}
            aria-label="뒤로 가기"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            className={heroIconButtonStyle}
            aria-label="지도에서 보기"
            onClick={() => navigate(`${ROUTES.map}?placeId=${place.id}`)}
          >
            <MapPin size={18} />
          </button>
        </div>
        <h1 className={heroTitleStyle}>{place.name}</h1>
      </section>

      <div className={bodyStyle}>
        {metaLabel ? (
          <div className={metaRowStyle}>
            <p className={metaTextStyle}>{metaLabel}</p>
          </div>
        ) : null}

        {description ? <p className={descriptionStyle}>{description}</p> : null}

        {hasContactInfo ? (
          <ul className={infoListStyle}>
            {place.tel ? (
              <li className={infoItemStyle}>
                <span className={infoIconStyle} aria-hidden>
                  <Phone size={18} />
                </span>
                <a href={`tel:${place.tel}`} className={infoValueStyle}>
                  {place.tel}
                </a>
                <span className={infoLabelStyle}>전화번호</span>
              </li>
            ) : null}
            {place.homepage ? (
              <li className={infoItemStyle}>
                <span className={infoIconStyle} aria-hidden>
                  <Globe size={18} />
                </span>
                <a
                  href={place.homepage}
                  className={infoValueStyle}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  홈페이지
                </a>
                <span className={infoLabelStyle}>웹사이트</span>
              </li>
            ) : null}
          </ul>
        ) : null}

        {photos.length > 0 ? (
          <section>
            <h2 className={sectionTitleStyle}>사진</h2>
            <div className={photoListStyle}>
              {photos.map((url) => (
                <div key={url} className={photoItemStyle}>
                  <img src={url} alt="" className={photoImgStyle} />
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section>
          <h2 className={sectionTitleStyle}>리뷰</h2>
          <Empty title="아직 리뷰가 없어요" description="이 장소의 첫 리뷰를 남겨보세요." />
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
