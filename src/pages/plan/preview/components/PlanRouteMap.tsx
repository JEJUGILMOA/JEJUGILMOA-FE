import { useEffect, useMemo, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Chip } from '@/components/ui/Chip/Chip'
import { colors } from '@/styles/colors.css.ts'
import {
  dayTabRowStyle,
  emptyStateStyle,
  mapBoxStyle,
  mapCanvasStyle,
} from './PlanRouteMap.css.ts'

export type PlanRouteMapPlace = {
  id: string
  title: string
  isDeparture?: boolean
  latitude?: number
  longitude?: number
}

export type PlanRouteMapDayRoute = {
  dayNumber: number
  /** Leaflet용 [lat, lng][] */
  path: [number, number][]
}

export type PlanRouteMapProps = {
  /** Day별로 배정된 장소 목록 (방문 순서대로). isDeparture는 그 Day의 출발지를 뜻한다. */
  days: { day: number; places: PlanRouteMapPlace[] }[]
  /** 서버 경로(READY)가 있으면 Day별로 폴리라인 표시 */
  dayRoutes?: PlanRouteMapDayRoute[]
}

const JEJU_CENTER: L.LatLngExpression = [33.389, 126.545]
const DAY_PIN_COLORS = [colors.primary[500], colors.secondary[500], colors.warning[500], colors.error[100]]
const DEPARTURE_PIN_COLOR = colors.text[2]

function hasCoords(place: PlanRouteMapPlace): place is PlanRouteMapPlace & {
  latitude: number
  longitude: number
} {
  return (
    typeof place.latitude === 'number' &&
    typeof place.longitude === 'number' &&
    Number.isFinite(place.latitude) &&
    Number.isFinite(place.longitude)
  )
}

function numberDayPlaces(places: PlanRouteMapPlace[]) {
  let count = 0
  return places.map((place) => {
    if (place.isDeparture) return { ...place, number: undefined as number | undefined }
    count += 1
    return { ...place, number: count }
  })
}

function createMarkerIcon(options: {
  color: string
  label?: string
  isDeparture?: boolean
}): L.DivIcon {
  const inner = options.isDeparture
    ? `<span style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;color:#fff;">▲</span>`
    : `<span style="font-size:11px;font-weight:700;color:#fff;line-height:1;">${options.label ?? ''}</span>`

  return L.divIcon({
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    html: `<div style="
      width:24px;height:24px;border-radius:50%;
      background:${options.color};
      border:1.5px solid #fff;
      box-shadow:0 1px 4px rgba(0,0,0,.28);
      display:flex;align-items:center;justify-content:center;
      box-sizing:border-box;
    ">${inner}</div>`,
  })
}

/** STEP 08 계획 미리보기: 전체/Day별 실지도 + 마커 (+ 경로 있으면 폴리라인) */
export function PlanRouteMap({ days, dayRoutes = [] }: PlanRouteMapProps) {
  const [selectedDay, setSelectedDay] = useState<number | 'all'>('all')
  const mapNodeRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const layerRef = useRef<L.LayerGroup | null>(null)

  const dayColor = (dayIndex: number) => DAY_PIN_COLORS[dayIndex % DAY_PIN_COLORS.length]

  const stops = useMemo(() => {
    if (selectedDay === 'all') {
      return days.flatMap((entry, dayIndex) =>
        numberDayPlaces(entry.places).map((place) => ({
          ...place,
          key: `${entry.day}-${place.id}`,
          color: place.isDeparture ? DEPARTURE_PIN_COLOR : dayColor(dayIndex),
        })),
      )
    }
    const dayIndex = days.findIndex((entry) => entry.day === selectedDay)
    const entry = days[dayIndex]
    if (!entry) return []
    return numberDayPlaces(entry.places).map((place) => ({
      ...place,
      key: `${entry.day}-${place.id}`,
      color: place.isDeparture ? DEPARTURE_PIN_COLOR : dayColor(dayIndex),
    }))
  }, [days, selectedDay])

  const plotted = useMemo(
    () =>
      stops.flatMap((stop) =>
        hasCoords(stop)
          ? [
              {
                ...stop,
                latitude: stop.latitude,
                longitude: stop.longitude,
              },
            ]
          : [],
      ),
    [stops],
  )

  const visibleRoutes = useMemo(() => {
    const filtered =
      selectedDay === 'all'
        ? dayRoutes
        : dayRoutes.filter((route) => route.dayNumber === selectedDay)
    return filtered.filter((route) => route.path.length >= 2)
  }, [dayRoutes, selectedDay])

  useEffect(() => {
    const node = mapNodeRef.current
    if (!node || mapRef.current) return

    const map = L.map(node, {
      zoomControl: false,
      attributionControl: false,
      dragging: true,
      scrollWheelZoom: false,
    }).setView(JEJU_CENTER, 10)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
    }).addTo(map)

    L.control.zoom({ position: 'bottomright' }).addTo(map)

    const layer = L.layerGroup().addTo(map)
    mapRef.current = map
    layerRef.current = layer

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize()
    })
    resizeObserver.observe(node)

    return () => {
      resizeObserver.disconnect()
      map.remove()
      mapRef.current = null
      layerRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    const layer = layerRef.current
    if (!map || !layer) return

    layer.clearLayers()

    const bounds = L.latLngBounds([])
    let hasGeometry = false

    for (const route of visibleRoutes) {
      const dayIndex = Math.max(0, route.dayNumber - 1)
      const color = dayColor(dayIndex)
      const latLngs = route.path.map(([lat, lng]) => L.latLng(lat, lng))
      for (const point of latLngs) bounds.extend(point)
      hasGeometry = true
      L.polyline(latLngs, {
        color,
        weight: 4,
        opacity: 0.85,
        lineJoin: 'round',
        lineCap: 'round',
      }).addTo(layer)
    }

    for (const stop of plotted) {
      const latLng: L.LatLngExpression = [stop.latitude, stop.longitude]
      bounds.extend(latLng)
      hasGeometry = true
      L.marker(latLng, {
        icon: createMarkerIcon({
          color: stop.color ?? colors.primary[500],
          label: stop.number != null ? String(stop.number) : undefined,
          isDeparture: stop.isDeparture,
        }),
        title: stop.title,
        zIndexOffset: 200,
      }).addTo(layer)
    }

    if (!hasGeometry) {
      map.setView(JEJU_CENTER, 10)
      return
    }

    if (plotted.length === 1 && visibleRoutes.length === 0) {
      map.setView(bounds.getCenter(), 13)
    } else {
      map.fitBounds(bounds.pad(0.18))
    }
    map.invalidateSize()
  }, [plotted, visibleRoutes])

  return (
    <div>
      <div className={dayTabRowStyle} role="tablist" aria-label="지도에 표시할 일정 범위">
        <Chip
          size="sm"
          colorScheme="primary"
          isSelected={selectedDay === 'all'}
          onClick={() => setSelectedDay('all')}
        >
          전체
        </Chip>
        {days.map(({ day }) => (
          <Chip
            key={day}
            size="sm"
            colorScheme="primary"
            isSelected={selectedDay === day}
            onClick={() => setSelectedDay(day)}
          >
            Day {day}
          </Chip>
        ))}
      </div>

      <div className={mapBoxStyle}>
        <div ref={mapNodeRef} className={mapCanvasStyle} />
        {stops.length === 0 ? (
          <span className={emptyStateStyle}>아직 배정된 장소가 없어요</span>
        ) : plotted.length === 0 ? (
          <span className={emptyStateStyle}>장소 좌표를 불러오는 중이에요</span>
        ) : null}
      </div>
    </div>
  )
}
