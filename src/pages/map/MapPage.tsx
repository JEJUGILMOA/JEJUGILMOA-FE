import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import '@/pages/plan/itinerary/nativeMapPassThrough.css.ts'
import { Chip } from '@/components/ui/Chip/Chip'
import { Empty } from '@/components/ui/Empty/Empty'
import { ErrorState } from '@/components/ui/ErrorState/ErrorState'
import { HorizontalScrollArea } from '@/components/ui/HorizontalScrollArea/HorizontalScrollArea'
import { Loading } from '@/components/ui/Loading/Loading'
import { nativeBridge } from '@/bridge/nativeBridge'
import {
  PLACE_CATEGORIES,
  getPlaceCategoryApiName,
  placePath,
  type PlaceCategoryLabel,
} from '@/constants'
import {
  boundsAround,
  boundsEqual,
  JEJU_DEFAULT_BOUNDS,
  roundBounds,
  shrinkBounds,
} from '@/features/map/bounds'
import { useMapHeatmapQuery, useMapPlacesQuery } from '@/features/map/hooks'
import type { MapBounds } from '@/features/map/schemas'
import { useMapNativeDataLayer } from '@/features/map/useMapNativeDataLayer'
import { useAppStore } from '@/stores/appStore'
import {
  chipRowStyle,
  heatmapDotStyle,
  heatmapItemStyle,
  heatmapListStyle,
  heatmapMetaStyle,
  listItemStyle,
  listMetaStyle,
  listStyle,
  listTitleStyle,
  mapCanvasStyle,
  mapHintStyle,
  pageStyle,
  searchHereButtonStyle,
  searchHereWrapStyle,
  sectionTitleStyle,
  statusStyle,
} from './MapPage.css.ts'

const FILTERS = ['전체', ...PLACE_CATEGORIES.map((category) => category.label)] as const
type PlaceFilter = (typeof FILTERS)[number]

/** 한 번에 가져올 장소 수 (화면이 과밀해지지 않도록) */
const MAP_PLACES_LIMIT = 25
/** 지도 화면 가운데 기준으로 검색할 영역 비율 */
const SEARCH_BOUNDS_RATIO = 0.55
const MAP_HEATMAP_GRID = 10

function isPlaceFilter(value: string): value is PlaceFilter {
  return (FILTERS as readonly string[]).includes(value)
}

function toSearchArea(bounds: MapBounds): MapBounds {
  return roundBounds(shrinkBounds(bounds, SEARCH_BOUNDS_RATIO))
}

export function MapPage() {
  const navigate = useNavigate()
  const location = useAppStore((s) => s.nativeLocation)
  const isNative = nativeBridge.isNativeWebView()

  const [filter, setFilter] = useState<PlaceFilter>('전체')
  /** 지도가 움직일 때마다 갱신되는 전체 뷰포트 */
  const [viewBounds, setViewBounds] = useState<MapBounds | null>(null)
  /** 실제 API에 사용하는 검색 영역 (버튼/초기 로드 시에만 커밋) */
  const [searchBounds, setSearchBounds] = useState<MapBounds | null>(null)

  const fallbackBounds = useMemo(() => {
    if (location) return boundsAround(location.latitude, location.longitude)
    return JEJU_DEFAULT_BOUNDS
  }, [location])

  const liveBounds = viewBounds ?? fallbackBounds
  const liveSearchArea = useMemo(() => toSearchArea(liveBounds), [liveBounds])

  // 최초 1회: 현재 영역으로 검색 시작
  useEffect(() => {
    if (searchBounds) return
    setSearchBounds(liveSearchArea)
  }, [searchBounds, liveSearchArea])

  const showSearchHere =
    searchBounds != null && !boundsEqual(searchBounds, liveSearchArea)

  const apiCategory =
    filter === '전체' ? undefined : getPlaceCategoryApiName(filter as PlaceCategoryLabel)
  const isUnsupportedCategory = filter !== '전체' && !apiCategory

  const placesQuery = useMapPlacesQuery(
    !isNative && searchBounds && !isUnsupportedCategory
      ? {
          ...searchBounds,
          category: apiCategory,
          limit: MAP_PLACES_LIMIT,
        }
      : null,
  )
  const heatmapQuery = useMapHeatmapQuery(
    !isNative && searchBounds
      ? {
          ...searchBounds,
          gridSize: MAP_HEATMAP_GRID,
        }
      : null,
  )

  const places = placesQuery.data ?? []
  const heatmap = heatmapQuery.data ?? []

  /** 네이티브 지도 탭(숨은 WebView) — API는 웹 REQUEST_*, 화면은 네이티브 */
  useMapNativeDataLayer(isNative)

  const handleSearchHere = () => {
    setSearchBounds(liveSearchArea)
  }

  useEffect(() => {
    if (isNative) return
    nativeBridge.requestNativeLocation()
  }, [isNative])

  useEffect(() => {
    if (isNative) return
    const onRegion = (event: Event) => {
      const detail = (event as CustomEvent<MapBounds>).detail
      if (!detail) return
      setViewBounds(detail)
    }
    window.addEventListener('gilmoa:map-region', onRegion)
    return () => window.removeEventListener('gilmoa:map-region', onRegion)
  }, [isNative])

  useEffect(() => {
    if (!isNative) return

    document.documentElement.classList.add('gilmoa-native-map')
    nativeBridge.postToNative({ type: 'SET_MAP', visible: true })

    return () => {
      document.documentElement.classList.remove('gilmoa-native-map')
      nativeBridge.postToNative({ type: 'SET_MAP', visible: false })
    }
  }, [isNative])

  useEffect(() => {
    if (isNative || !searchBounds) return

    nativeBridge.postToNative({
      type: 'SET_MAP',
      visible: true,
      places: places.map((place) => ({
        id: place.id,
        title: place.name,
        latitude: place.latitude,
        longitude: place.longitude,
        categoryName: place.categoryName,
        imageUrl: place.imageUrl,
      })),
      heatmap: heatmap.map((point) => ({
        latitude: point.latitude,
        longitude: point.longitude,
        level: point.level,
        intensity: point.intensity,
      })),
      cameraFitKey: viewBounds
        ? undefined
        : `explore:${searchBounds.minLat}:${searchBounds.minLng}`,
    })
  }, [isNative, places, heatmap, viewBounds, searchBounds])

  useEffect(() => {
    if (!isNative) return
    const onAssign = (event: Event) => {
      const id = (event as CustomEvent<{ id: string }>).detail?.id
      if (id) navigate(placePath(id))
    }
    window.addEventListener('gilmoa:map-assign', onAssign)
    return () => window.removeEventListener('gilmoa:map-assign', onAssign)
  }, [isNative, navigate])

  const isLoading = placesQuery.isLoading || heatmapQuery.isLoading
  const isError = placesQuery.isError || heatmapQuery.isError
  const displayBounds = searchBounds ?? liveSearchArea

  /** 네이티브 지도 탭 WebView는 API 전용 — UI는 네이티브 MapScreen */
  if (isNative) {
    return <div className={pageStyle} aria-hidden data-gilmoa-map-data-host />
  }

  return (
    <div className={pageStyle}>
      <HorizontalScrollArea className={chipRowStyle} role="tablist" aria-label="카테고리 필터">
        {FILTERS.map((item) => (
          <Chip
            key={item}
            size="md"
            colorScheme="primary"
            isSelected={filter === item}
            onClick={() => {
              if (isPlaceFilter(item)) setFilter(item)
            }}
          >
            {item}
          </Chip>
        ))}
      </HorizontalScrollArea>

      {showSearchHere ? (
        <div className={searchHereWrapStyle}>
          <button type="button" className={searchHereButtonStyle} onClick={handleSearchHere}>
            현 위치에서 검색
          </button>
        </div>
      ) : null}

      <div className={mapCanvasStyle} aria-label="지도">
        <p className={mapHintStyle}>
          웹에서는 목록으로 미리봅니다. 앱에서는 지도 SDK에 마커/히트맵이 표시됩니다.
        </p>
        <p className={statusStyle}>
          {location
            ? `현재 위치 ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
            : '위치 정보 대기 중'}
          {' · '}
          검색 영역 {displayBounds.minLat.toFixed(2)}~{displayBounds.maxLat.toFixed(2)},{' '}
          {displayBounds.minLng.toFixed(2)}~{displayBounds.maxLng.toFixed(2)}
        </p>
      </div>

      {isLoading ? <Loading label="지도 데이터 불러오는 중" /> : null}

      {isError ? (
        <ErrorState
          onRetry={() => {
            void placesQuery.refetch()
            void heatmapQuery.refetch()
          }}
        />
      ) : null}

      {!isLoading && !isError ? (
        <>
          <section>
            <h2 className={sectionTitleStyle}>장소 {places.length}</h2>
            {isUnsupportedCategory ? (
              <Empty
                title="아직 지원하지 않는 카테고리예요"
                description="다른 카테고리를 선택해 보세요."
              />
            ) : places.length === 0 ? (
              <Empty
                title="이 영역에 장소가 없어요"
                description="지도를 이동한 뒤 「현 위치에서 검색」을 눌러 보세요."
              />
            ) : (
              <ul className={listStyle}>
                {places.map((place) => (
                  <li key={place.id}>
                    <button
                      type="button"
                      className={listItemStyle}
                      onClick={() => navigate(placePath(place.id))}
                    >
                      <span className={listTitleStyle}>{place.name}</span>
                      <span className={listMetaStyle}>
                        {[place.categoryName, `${place.latitude.toFixed(3)}, ${place.longitude.toFixed(3)}`]
                          .filter(Boolean)
                          .join(' · ')}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className={sectionTitleStyle}>혼잡도 {heatmap.length}</h2>
            {heatmap.length === 0 ? (
              <Empty title="표시할 혼잡 지역이 없어요" description="붐비는 지역이 있으면 여기에 나타납니다." />
            ) : (
              <ul className={heatmapListStyle}>
                {heatmap.map((point) => (
                  <li
                    key={`${point.latitude}-${point.longitude}-${point.level}`}
                    className={heatmapItemStyle}
                  >
                    <span
                      className={heatmapDotStyle}
                      data-level={point.level}
                      style={{ opacity: Math.max(0.35, point.intensity) }}
                      aria-hidden
                    />
                    <span className={heatmapMetaStyle}>
                      {point.level === 'CROWDED' ? '혼잡' : '보통'} · intensity{' '}
                      {point.intensity.toFixed(2)} · {point.latitude.toFixed(3)},{' '}
                      {point.longitude.toFixed(3)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      ) : null}
    </div>
  )
}
