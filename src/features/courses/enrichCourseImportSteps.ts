import { fetchPlaceById } from '@/features/places/api'

export type CourseImportStep = {
  placeId: string
  title: string
  latitude?: number
  longitude?: number
}

type CoordSource = {
  placeId: string | number
  latitude?: number
  longitude?: number
}

function toFiniteCoord(value: unknown): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const n = Number(value)
    return Number.isFinite(n) ? n : null
  }
  return null
}

/**
 * 코스 상세 stop에는 좌표가 없고(목록 waypoint에만 있음),
 * 일정 담기·미리보기 지도용으로 placeId별 lat/lng를 채운다.
 * 1) 목록 캐시 waypoints 2) 없으면 GET /places/{id}
 */
export async function enrichCourseImportSteps(
  steps: { placeId: string; title: string; latitude?: number; longitude?: number }[],
  listWaypoints?: CoordSource[],
): Promise<CourseImportStep[]> {
  const fromList = new Map<string, { latitude: number; longitude: number }>()
  for (const wp of listWaypoints ?? []) {
    const latitude = toFiniteCoord(wp.latitude)
    const longitude = toFiniteCoord(wp.longitude)
    if (latitude == null || longitude == null) continue
    fromList.set(String(wp.placeId), { latitude, longitude })
  }

  return Promise.all(
    steps.map(async (step) => {
      const placeId = String(step.placeId)
      let latitude = toFiniteCoord(step.latitude) ?? fromList.get(placeId)?.latitude ?? null
      let longitude = toFiniteCoord(step.longitude) ?? fromList.get(placeId)?.longitude ?? null

      if (latitude == null || longitude == null) {
        try {
          const place = await fetchPlaceById(placeId)
          latitude = toFiniteCoord(place.latitude) ?? latitude
          longitude = toFiniteCoord(place.longitude) ?? longitude
        } catch {
          // 좌표 없는 장소는 placeId·title만 담는다
        }
      }

      return {
        placeId,
        title: step.title,
        ...(latitude != null && longitude != null ? { latitude, longitude } : {}),
      }
    }),
  )
}
