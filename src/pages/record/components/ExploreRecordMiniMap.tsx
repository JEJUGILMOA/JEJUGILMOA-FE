import { useEffect, useMemo, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { colors } from '@/styles/colors.css.ts'
import { emptyStateStyle, mapCanvasStyle, mapRootStyle } from './ExploreRecordMiniMap.css.ts'

export type ExploreRecordMiniMapPlace = {
  id: string
  latitude: number
  longitude: number
}

export type ExploreRecordMiniMapProps = {
  places: ExploreRecordMiniMapPlace[]
  /** 접근성 라벨용 기록 제목 */
  title: string
}

const JEJU_CENTER: L.LatLngExpression = [33.389, 126.545]

function hasCoords(place: ExploreRecordMiniMapPlace): boolean {
  return (
    Number.isFinite(place.latitude) &&
    Number.isFinite(place.longitude) &&
    !(place.latitude === 0 && place.longitude === 0)
  )
}

function createMarkerIcon(label: string): L.DivIcon {
  return L.divIcon({
    className: '',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    html: `<div style="
      width:22px;height:22px;border-radius:50%;
      background:${colors.primary[500]};
      border:1.5px solid #fff;
      box-shadow:0 1px 3px rgba(0,0,0,.28);
      display:flex;align-items:center;justify-content:center;
      box-sizing:border-box;
      font-size:10px;font-weight:700;color:#fff;line-height:1;
    ">${label}</div>`,
  })
}

/** 둘러보기 지도형 카드용 비인터랙티브 Leaflet 미니맵 */
export function ExploreRecordMiniMap({ places, title }: ExploreRecordMiniMapProps) {
  const mapNodeRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const layerRef = useRef<L.LayerGroup | null>(null)

  const plotted = useMemo(
    () => places.filter(hasCoords),
    [places],
  )

  useEffect(() => {
    const node = mapNodeRef.current
    if (!node || mapRef.current) return

    const map = L.map(node, {
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      touchZoom: false,
    }).setView(JEJU_CENTER, 10)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
    }).addTo(map)

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

    if (plotted.length === 0) {
      map.setView(JEJU_CENTER, 10)
      map.invalidateSize()
      return
    }

    const bounds = L.latLngBounds([])

    plotted.forEach((place, index) => {
      const latLng: L.LatLngExpression = [place.latitude, place.longitude]
      bounds.extend(latLng)
      L.marker(latLng, {
        icon: createMarkerIcon(String(index + 1)),
        interactive: false,
        keyboard: false,
      }).addTo(layer)
    })

    if (plotted.length === 1) {
      map.setView(bounds.getCenter(), 13)
    } else {
      map.fitBounds(bounds.pad(0.2))
    }
    map.invalidateSize()
  }, [plotted])

  return (
    <div className={mapRootStyle} role="img" aria-label={`${title} 방문 지도`}>
      <div ref={mapNodeRef} className={mapCanvasStyle} />
      {plotted.length === 0 ? (
        <span className={emptyStateStyle}>표시할 장소가 없어요</span>
      ) : null}
    </div>
  )
}
