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
import { boundsAround, JEJU_DEFAULT_BOUNDS, roundBounds } from '@/features/map/bounds'
import { useMapHeatmapQuery, useMapPlacesQuery } from '@/features/map/hooks'
import type { MapBounds } from '@/features/map/schemas'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
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
  sectionTitleStyle,
  statusStyle,
} from './MapPage.css.ts'

const FILTERS = ['전체', ...PLACE_CATEGORIES.map((category) => category.label)] as const
type PlaceFilter = (typeof FILTERS)[number]

const MAP_REGION_DEBOUNCE_MS = 400
const MAP_PLACES_LIMIT = 200
const MAP_HEATMAP_GRID = 10

function isPlaceFilter(value: string): value is PlaceFilter {
  return (FILTERS as readonly string[]).includes(value)
}

export function MapPage() {
  const navigate = useNavigate()
  const location = useAppStore((s) => s.nativeLocation)
  const isNative = nativeBridge.isNativeWebView()

  const [filter, setFilter] = useState<PlaceFilter>('전체')
  const [nativeBounds, setNativeBounds] = useState<MapBounds | null>(null)

  const fallbackBounds = useMemo(() => {
    if (location) return boundsAround(location.latitude, location.longitude)
    return JEJU_DEFAULT_BOUNDS
  }, [location])

  const activeBounds = nativeBounds ?? fallbackBounds
  const debouncedBounds = useDebouncedValue(roundBounds(activeBounds), MAP_REGION_DEBOUNCE_MS)

  const apiCategory =
    filter === '전체' ? undefined : getPlaceCategoryApiName(filter as PlaceCategoryLabel)
  const isUnsupportedCategory = filter !== '전체' && !apiCategory

  const placesQuery = useMapPlacesQuery(
    isUnsupportedCategory
      ? null
      : {
          ...debouncedBounds,
          category: apiCategory,
          limit: MAP_PLACES_LIMIT,
        },
  )
  const heatmapQuery = useMapHeatmapQuery({
    ...debouncedBounds,
    gridSize: MAP_HEATMAP_GRID,
  })

  const places = placesQuery.data ?? []
  const heatmap = heatmapQuery.data ?? []

  useEffect(() => {
    nativeBridge.requestNativeLocation()
  }, [])

  useEffect(() => {
    const onRegion = (event: Event) => {
      const detail = (event as CustomEvent<MapBounds>).detail
      if (!detail) return
      setNativeBounds(detail)
    }
    window.addEventListener('gilmoa:map-region', onRegion)
    return () => window.removeEventListener('gilmoa:map-region', onRegion)
  }, [])

  useEffect(() => {
    if (!isNative) return

    document.documentElement.classList.add('gilmoa-native-map')
    nativeBridge.postToNative({ type: 'SET_MAP', visible: true })
    nativeBridge.requestMapRegion()

    return () => {
      document.documentElement.classList.remove('gilmoa-native-map')
      nativeBridge.postToNative({ type: 'SET_MAP', visible: false })
    }
  }, [isNative])

  useEffect(() => {
    if (!isNative) return

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
      cameraFitKey: nativeBounds
        ? undefined
        : `explore:${debouncedBounds.minLat}:${debouncedBounds.minLng}`,
    })
  }, [isNative, places, heatmap, nativeBounds, debouncedBounds])

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

      <div className={mapCanvasStyle} aria-label="지도">
        {isNative ? (
          <p className={mapHintStyle}>네이티브 지도에 장소·혼잡도를 표시합니다.</p>
        ) : (
          <p className={mapHintStyle}>
            웹에서는 목록으로 미리봅니다. 앱에서는 지도 SDK에 마커/히트맵이 표시됩니다.
          </p>
        )}
        <p className={statusStyle}>
          {location
            ? `현재 위치 ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
            : '위치 정보 대기 중'}
          {' · '}
          bounds {debouncedBounds.minLat.toFixed(2)}~{debouncedBounds.maxLat.toFixed(2)},{' '}
          {debouncedBounds.minLng.toFixed(2)}~{debouncedBounds.maxLng.toFixed(2)}
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
              <Empty title="이 영역에 장소가 없어요" description="지도를 이동하거나 다른 카테고리를 선택해 보세요." />
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
