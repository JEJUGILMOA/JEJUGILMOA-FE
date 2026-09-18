import { Bookmark, Globe, MapPin, Phone } from 'lucide-react'
import { useMemo } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import { isApiError } from '@/api/error'
import { Button } from '@/components/ui/Button/Button'
import { Empty } from '@/components/ui/Empty/Empty'
import { ErrorState } from '@/components/ui/ErrorState/ErrorState'
import { Loading } from '@/components/ui/Loading/Loading'
import { PageHeader } from '@/components/ui/PageHeader/PageHeader'
import { toast } from '@/components/ui/Toast/Toast'
import { ROUTES } from '@/constants'
import { requireLogin } from '@/features/auth/requireLogin'
import {
  useFavoritePlaceIdsQuery,
  useToggleFavoriteMutation,
} from '@/features/favorites/hooks'
import { usePlaceQuery } from '@/features/places/hooks'
import { openExternalMapPlace } from '@/features/places/openExternalMap'
import type { Place } from '@/features/places/types'
import { PhotoCarousel } from '@/pages/record/detail/components/PhotoCarousel'
import { overlayButtonStyle } from '@/pages/record/detail/components/PhotoCarousel.css.ts'
import {
  addressIconStyle,
  addressTextStyle,
  bodyStyle,
  categoryTagStyle,
  contactIconStyle,
  contactItemStyle,
  contactLinkStyle,
  contactListStyle,
  descriptionStyle,
  dividerStyle,
  footerMapButtonStyle,
  footerSaveButtonStyle,
  footerStyle,
  heroStyle,
  pageStyle,
  sectionStyle,
  sectionTitleStyle,
  titleStyle,
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
  const location = useLocation()
  const { placeId = '' } = useParams()
  const { data: place, isPending, isError, error, refetch } = usePlaceQuery(placeId)
  const favoriteIdsQuery = useFavoritePlaceIdsQuery()
  const toggleFavorite = useToggleFavoriteMutation()

  const photos = useMemo(() => (place ? getPlacePhotos(place) : []), [place])
  const description = place ? getPlaceDescription(place) : ''
  const categoryLabel = place?.categoryName?.trim()
  const addressLabel = place?.address?.trim()
  const hasContactInfo = Boolean(place?.tel || place?.homepage)
  const headerTitle = place?.name ?? '장소'
  const goBack = () => navigate(-1)
  const favoriteIds = favoriteIdsQuery.data ?? new Set<string>()
  const isFavorite = placeId ? favoriteIds.has(placeId) : false

  const openMap = () => {
    if (!place) return
    openExternalMapPlace({
      name: place.name,
      latitude: place.latitude,
      longitude: place.longitude,
    })
  }

  const handleToggleFavorite = () => {
    if (!placeId) return
    if (
      !requireLogin({
        returnTo: location.pathname,
        description: '즐겨찾기는 로그인 후 이용할 수 있어요.',
      })
    ) {
      return
    }

    const nextFavorite = !isFavorite
    toggleFavorite.mutate(
      { placeId, nextFavorite },
      {
        onError: () => {
          toast.error(
            nextFavorite ? '즐겨찾기 추가에 실패했어요.' : '즐겨찾기 해제에 실패했어요.',
          )
        },
      },
    )
  }

  if (!placeId) {
    return (
      <div className={pageStyle}>
        <PageHeader title="장소" showBack onBack={goBack} />
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
        <PageHeader title="장소" showBack onBack={goBack} />
        <Loading label="장소 정보 불러오는 중" />
      </div>
    )
  }

  if (isError) {
    if (isApiError(error) && error.status === 404) {
      return (
        <div className={pageStyle}>
          <PageHeader title="장소" showBack onBack={goBack} />
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
        <PageHeader title="장소" showBack onBack={goBack} />
        <ErrorState onRetry={() => void refetch()} />
      </div>
    )
  }

  if (!place) {
    return null
  }

  return (
    <div className={pageStyle}>
      <PageHeader title={headerTitle} showBack onBack={goBack} />

      <section className={heroStyle} aria-label="장소 이미지">
        <PhotoCarousel
          photoUrls={photos}
          title={place.name}
          isBookmarked={isFavorite}
          onToggleBookmark={handleToggleFavorite}
          extraActions={
            <button
              type="button"
              className={overlayButtonStyle}
              aria-label="지도에서 보기"
              onClick={openMap}
            >
              <MapPin size={16} strokeWidth={1.75} />
            </button>
          }
        />
      </section>

      <div className={bodyStyle}>
        <h1 className={titleStyle}>{place.name}</h1>

        {addressLabel ? (
          <p className={addressTextStyle}>
            <MapPin size={20} strokeWidth={2} className={addressIconStyle} aria-hidden />
            <span>{addressLabel}</span>
          </p>
        ) : null}

        {categoryLabel ? <span className={categoryTagStyle}>{categoryLabel}</span> : null}

        <hr className={dividerStyle} />

        {description ? (
          <section className={sectionStyle} aria-labelledby="place-intro-title">
            <h2 id="place-intro-title" className={sectionTitleStyle}>
              장소 소개
            </h2>
            <p className={descriptionStyle}>{description}</p>
          </section>
        ) : null}

        {hasContactInfo ? (
          <ul className={contactListStyle}>
            {place.tel ? (
              <li className={contactItemStyle}>
                <span className={contactIconStyle} aria-hidden>
                  <Phone size={16} />
                </span>
                <a href={`tel:${place.tel}`} className={contactLinkStyle}>
                  {place.tel}
                </a>
              </li>
            ) : null}
            {place.homepage ? (
              <li className={contactItemStyle}>
                <span className={contactIconStyle} aria-hidden>
                  <Globe size={16} />
                </span>
                <a
                  href={place.homepage}
                  className={contactLinkStyle}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  홈페이지
                </a>
              </li>
            ) : null}
          </ul>
        ) : null}
      </div>

      <div className={footerStyle}>
        <button
          type="button"
          className={footerSaveButtonStyle}
          aria-label={isFavorite ? '즐겨찾기 해제' : '저장하기'}
          aria-pressed={isFavorite}
          disabled={toggleFavorite.isPending}
          onClick={handleToggleFavorite}
        >
          <Bookmark size={18} strokeWidth={2} fill={isFavorite ? 'currentColor' : 'none'} />
          {isFavorite ? '저장됨' : '저장하기'}
        </button>
        <button type="button" className={footerMapButtonStyle} onClick={openMap}>
          <MapPin size={18} strokeWidth={2} aria-hidden />
          지도에서 보기
        </button>
      </div>
    </div>
  )
}
