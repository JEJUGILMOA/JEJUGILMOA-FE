import { Flag, Star, ZoomIn, ZoomOut } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import '@/pages/plan/itinerary/nativeMapPassThrough.css.ts'
import { nativeBridge } from '@/bridge/nativeBridge'
import { useZoomPan } from '@/hooks/useZoomPan'
import { getPinLatLng, getPinPosition } from '@/utils/mapPinPositions'
import { colors } from '@/styles/colors.css.ts'
import { cn } from '@/utils/cn'
import {
  canvasStyle,
  departurePinStyle,
  emptyStateStyle,
  mustVisitBadgeStyle,
  routeSvgStyle,
  stopPinRecipe,
  unassignedPinRecipe,
  viewportHidden,
  viewportStyle,
  zoomButtonStyle,
  zoomControlsStyle,
} from './ItineraryDayMap.css.ts'

export type ItineraryDayMapProps = {
  /** 이 Day의 출발지 (검색으로 고른 곳, 없으면 null) */
  departurePlace: { id: string; title: string } | null
  /** 현재 Day에 배정된 장소 (방문 순서대로) */
  stops: { id: string; title: string }[]
  /** 이 Day에서 "꼭 가고 싶은 장소"로 정한 곳들 — 지도에서 별 배지로 구분 표시한다 */
  mustVisitIds?: string[]
  /** 아직 어느 Day에도 배정되지 않은 장소 */
  unassignedPlaces: { id: string; title: string }[]
  /** 미배정 장소 핀 색상 — 지금 추천 기준(유명한/가까운 장소)에 맞춰 지도에서도 구분해 보여준다 */
  unassignedPinKind?: 'popular' | 'nearby'
  /** 미배정 장소 핀을 클릭했을 때 현재 Day에 담는다 */
  onAssignPlace: (id: string) => void
  /** 지도를 탭(드래그 아닌 짧은 클릭)했을 때 — 네이버맵처럼 검색 중이었으면 검색을 빠져나가게 하는 용도 */
  onTapMap?: () => void
  /** 카메라를 다시 맞출 키. Day가 바뀌면 달라진다 */
  cameraFitKey?: string
}

/** 이 거리(px) 이하로 움직였으면 드래그(지도 이동)가 아니라 탭으로 본다 */
const TAP_MOVE_THRESHOLD = 6

/** STEP 05 Day별 지도: 출발지 깃발 핀 + 번호 핀 + 점선 동선 + 미배정 장소 추천 핀(클릭 시 담기) */
export function ItineraryDayMap({
  departurePlace,
  stops,
  mustVisitIds = [],
  unassignedPlaces,
  unassignedPinKind = 'popular',
  onAssignPlace,
  onTapMap,
  cameraFitKey,
}: ItineraryDayMapProps) {
  const hideInNative = nativeBridge.isNativeWebView()
  const onAssignRef = useRef(onAssignPlace)
  const onTapRef = useRef(onTapMap)
  onAssignRef.current = onAssignPlace
  onTapRef.current = onTapMap
  const {
    zoom,
    pan,
    minZoom,
    maxZoom,
    zoomIn,
    zoomOut,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  } = useZoomPan()

  const tapStartRef = useRef<{ x: number; y: number } | null>(null)
  const [sheetLayout, setSheetLayout] = useState(() => ({
    overlayTop: 120,
    sheetHeight: typeof window === 'undefined' ? 220 : Math.round(window.innerHeight * 0.28),
  }))
  const [webOnTop, setWebOnTop] = useState(false)

  useEffect(() => {
    const onSheet = (event: Event) => {
      const detail = (event as CustomEvent<{ height?: number; overlayTop?: number }>).detail
      setSheetLayout({
        overlayTop: detail?.overlayTop ?? 120,
        sheetHeight: detail?.height ?? 0,
      })
    }
    window.addEventListener('gilmoa:sheet-height', onSheet)
    return () => window.removeEventListener('gilmoa:sheet-height', onSheet)
  }, [])

  useEffect(() => {
    if (!nativeBridge.isNativeWebView()) return
    const isWebOnTop = () =>
      Boolean(document.querySelector('[data-gilmoa-web-top], [role="dialog"][aria-modal="true"]'))
    const sync = () => setWebOnTop(isWebOnTop())
    const onWebTop = (event: Event) => {
      const active = (event as CustomEvent<{ active?: boolean }>).detail?.active
      setWebOnTop(Boolean(active) || isWebOnTop())
    }
    sync()
    window.addEventListener('gilmoa:web-top', onWebTop)
    const observer = new MutationObserver(sync)
    observer.observe(document.body, { childList: true, subtree: true })
    return () => {
      window.removeEventListener('gilmoa:web-top', onWebTop)
      observer.disconnect()
    }
  }, [])

  const mapPayload = useMemo(() => {
    const toPin = (place: { id: string; title: string }) => ({
      id: place.id,
      title: place.title,
      ...getPinLatLng(place.id),
    })
    return {
      type: 'SET_MAP' as const,
      visible: true,
      departure: departurePlace ? toPin(departurePlace) : null,
      stops: stops.map((stop, index) => ({
        ...toPin(stop),
        order: index + 1,
        mustVisit: mustVisitIds.includes(stop.id),
      })),
      unassigned: unassignedPlaces.map(toPin),
      overlayTop: sheetLayout.overlayTop,
      sheetHeight: sheetLayout.sheetHeight,
      cameraFitKey,
      webOnTop,
    }
  }, [departurePlace, stops, mustVisitIds, unassignedPlaces, sheetLayout, cameraFitKey, webOnTop])

  useEffect(() => {
    if (!nativeBridge.isNativeWebView()) return
    nativeBridge.postToNative(mapPayload)
  }, [mapPayload])

  useEffect(() => {
    if (!nativeBridge.isNativeWebView()) return
    document.documentElement.classList.add('gilmoa-native-map')
    return () => {
      document.documentElement.classList.remove('gilmoa-native-map')
      nativeBridge.postToNative({ type: 'SET_MAP', visible: false })
    }
  }, [])

  useEffect(() => {
    const onAssign = (event: Event) => {
      const id = (event as CustomEvent<{ id: string }>).detail?.id
      if (id) onAssignRef.current(id)
    }
    const onTap = () => onTapRef.current?.()
    window.addEventListener('gilmoa:map-assign', onAssign)
    window.addEventListener('gilmoa:map-tap', onTap)
    return () => {
      window.removeEventListener('gilmoa:map-assign', onAssign)
      window.removeEventListener('gilmoa:map-tap', onTap)
    }
  }, [])

  const handleCanvasPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    tapStartRef.current = { x: event.clientX, y: event.clientY }
    handlePointerDown(event)
  }

  const handleCanvasPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = tapStartRef.current
    tapStartRef.current = null
    if (start) {
      const movedDistance = Math.hypot(event.clientX - start.x, event.clientY - start.y)
      if (movedDistance <= TAP_MOVE_THRESHOLD) onTapMap?.()
    }
    handlePointerUp()
  }

  // 동선(점선)이 출발지에서부터 시작하도록, 있으면 맨 앞에 끼워 넣는다.
  const routePoints = [
    ...(departurePlace ? [getPinPosition(departurePlace.id)] : []),
    ...stops.map((stop) => getPinPosition(stop.id)),
  ]

  const handleZoomIn = () => {
    if (hideInNative) {
      nativeBridge.postToNative({ type: 'MAP_ZOOM', delta: 1 })
      return
    }
    zoomIn()
  }

  const handleZoomOut = () => {
    if (hideInNative) {
      nativeBridge.postToNative({ type: 'MAP_ZOOM', delta: -1 })
      return
    }
    zoomOut()
  }

  return (
    <>
    <div data-gilmoa-itinerary-map className={cn(viewportStyle, hideInNative && viewportHidden)}>
      <div
        className={canvasStyle}
        style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
        onPointerDown={handleCanvasPointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handleCanvasPointerUp}
        onPointerLeave={() => {
          tapStartRef.current = null
          handlePointerUp()
        }}
      >
        {!departurePlace && stops.length === 0 && unassignedPlaces.length === 0 ? (
          <span className={emptyStateStyle}>이 Day에 배정된 장소가 없어요</span>
        ) : null}

        {routePoints.length > 1 ? (
          <svg className={routeSvgStyle} viewBox="0 0 100 100" preserveAspectRatio="none">
            <polyline
              points={routePoints.map((point) => `${point.left},${point.top}`).join(' ')}
              fill="none"
              stroke={colors.primary[500]}
              strokeWidth={0.6}
              strokeDasharray="2.2 1.8"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ) : null}

        {unassignedPlaces.map((place) => {
          const pos = getPinPosition(place.id)
          return (
            <button
              key={place.id}
              type="button"
              className={unassignedPinRecipe({ kind: unassignedPinKind })}
              style={{
                left: `${pos.left}%`,
                top: `${pos.top}%`,
                transform: `translate(-50%, -50%) scale(${1 / zoom})`,
              }}
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => onAssignPlace(place.id)}
              aria-label={`${place.title} 이 Day에 담기`}
            />
          )
        })}

        {departurePlace ? (
          <span
            className={departurePinStyle}
            style={{
              left: `${getPinPosition(departurePlace.id).left}%`,
              top: `${getPinPosition(departurePlace.id).top}%`,
              transform: `translate(-50%, -50%) scale(${1 / zoom})`,
            }}
            aria-label={`출발지: ${departurePlace.title}`}
          >
            <Flag size={12} fill="currentColor" />
          </span>
        ) : null}

        {stops.map((stop, index) => {
          const pos = getPinPosition(stop.id)
          const isMustVisit = mustVisitIds.includes(stop.id)
          return (
            <span
              key={stop.id}
              className={stopPinRecipe()}
              style={{
                left: `${pos.left}%`,
                top: `${pos.top}%`,
                transform: `translate(-50%, -50%) scale(${1 / zoom})`,
              }}
              aria-label={isMustVisit ? `${stop.title} (꼭 가고 싶은 장소)` : stop.title}
            >
              {index + 1}
              {isMustVisit ? (
                <span className={mustVisitBadgeStyle} aria-hidden>
                  <Star size={8} fill="currentColor" />
                </span>
              ) : null}
            </span>
          )
        })}
      </div>
    </div>

      {hideInNative ? null : (
      <div
        data-gilmoa-overlay
        data-gilmoa-itinerary-zoom
        className={zoomControlsStyle}
      >
        <button
          type="button"
          className={zoomButtonStyle}
          onClick={handleZoomIn}
          disabled={!hideInNative && zoom >= maxZoom}
          aria-label="지도 확대"
        >
          <ZoomIn size={16} />
        </button>
        <button
          type="button"
          className={zoomButtonStyle}
          onClick={handleZoomOut}
          disabled={!hideInNative && zoom <= minZoom}
          aria-label="지도 축소"
        >
          <ZoomOut size={16} />
        </button>
      </div>
      )}
    </>
  )
}
