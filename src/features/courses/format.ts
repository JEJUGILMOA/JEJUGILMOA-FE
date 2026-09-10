import type { CourseImageTag } from '@/data/mockExplore'
import type {
  CourseTheme,
  RecommendedCourse,
  RecommendedCourseDetail,
  SavedCourse,
  SavedCourseDetail,
} from './schemas'

const THEME_LABELS: Record<CourseTheme, string> = {
  FOOD: '맛집',
  NATURE: '자연',
  ACTIVITY: '액티비티',
  CAFE: '카페',
  CULTURE: '문화',
  SHOPPING: '쇼핑',
  FESTIVAL: '축제',
}

const TRANSPORT_LABELS: Record<string, string> = {
  WALK: '도보',
  DRIVE: '차량',
  MIXED: '도보·차량',
}

export function courseThemeLabel(theme?: string): string | undefined {
  if (!theme) return undefined
  return THEME_LABELS[theme as CourseTheme] ?? theme
}

export function courseThemeTone(theme?: string): CourseImageTag['tone'] {
  switch (theme) {
    case 'NATURE':
      return 'green'
    case 'FOOD':
    case 'CAFE':
    case 'FESTIVAL':
      return 'pink'
    default:
      return 'blue'
  }
}

export function formatEstimatedMinutes(minutes?: number): string | undefined {
  if (minutes == null) return undefined
  if (minutes < 60) return `${minutes}분`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest > 0 ? `${hours}시간 ${rest}분` : `${hours}시간`
}

export function transportModeLabel(mode?: string): string | undefined {
  if (!mode) return undefined
  return TRANSPORT_LABELS[mode] ?? mode
}

export function formatTravelMinutes(minutes?: number): string | undefined {
  if (minutes == null) return undefined
  return `다음 장소까지 약 ${minutes}분`
}

export function mapRecommendedCourseToListCard(course: RecommendedCourse) {
  const waypoints = [...course.waypoints].sort((a, b) => a.sequenceOrder - b.sequenceOrder)
  const themeLabel = courseThemeLabel(course.theme)

  return {
    title: course.title,
    description: course.description,
    imageUrl: waypoints.find((item) => item.imageUrl)?.imageUrl,
    imageTags: themeLabel
      ? [{ label: themeLabel, tone: courseThemeTone(course.theme) } satisfies CourseImageTag]
      : [],
    placeCount: waypoints.length,
    previewSteps: waypoints.map((item) => ({
      title: item.placeName,
      thumbnailUrl: item.imageUrl ?? '',
    })),
  }
}

export function mapSavedCourseToListCard(course: SavedCourse) {
  return {
    title: course.title,
    imageUrl: course.imageUrl,
    imageTags: [],
    placeCount: course.placeCount ?? 0,
    previewSteps: [],
    locationLabel: course.region,
    duration: formatEstimatedMinutes(course.estimatedMinutes),
    transport: transportModeLabel(course.transportMode),
  }
}

/** `SavedCourseDetail` → `CourseDetailPage`가 쓰는 것과 같은 모양(title/description/imageUrl/meta/badges/steps) */
export function mapSavedCourseDetail(course: SavedCourseDetail) {
  const stops = [...course.stops].sort((a, b) => a.sequenceOrder - b.sequenceOrder)
  const duration = formatEstimatedMinutes(course.estimatedMinutes)
  const transport = transportModeLabel(course.transportMode)
  const placeCount = course.placeCount ?? stops.length

  const metaParts = [course.region, duration, placeCount > 0 ? `${placeCount}곳` : undefined, transport].filter(
    Boolean,
  )

  const badges = transport ? [{ label: transport, status: 'info' as const }] : []

  return {
    title: course.title,
    description: course.description,
    imageUrl: course.imageUrl,
    meta: metaParts.join(' · '),
    badges,
    steps: stops.map((stop) => ({
      placeId: stop.placeId,
      title: stop.placeName,
      imageUrl: stop.placeImageUrl,
      travelLabel: formatTravelMinutes(stop.travelTimeToNext),
    })),
  }
}

export function mapRecommendedCourseDetail(course: RecommendedCourseDetail) {
  const stops = [...course.stops].sort((a, b) => a.sequenceOrder - b.sequenceOrder)
  const duration = formatEstimatedMinutes(course.estimatedMinutes)
  const transport = transportModeLabel(course.transportMode)
  const placeCount = course.placeCount ?? stops.length

  const metaParts = [
    course.region,
    duration,
    placeCount > 0 ? `${placeCount}곳` : undefined,
    transport,
  ].filter(Boolean)

  const badges = [
    course.isFree ? { label: '무료', status: 'success' as const } : null,
    course.rating != null
      ? { label: `★ ${course.rating.toFixed(1)}`, status: 'neutral' as const }
      : null,
    transport ? { label: transport, status: 'info' as const } : null,
  ].filter((badge): badge is NonNullable<typeof badge> => badge != null)

  return {
    title: course.title,
    description: course.description,
    imageUrl: course.imageUrl,
    meta: metaParts.join(' · '),
    badges,
    steps: stops.map((stop) => ({
      placeId: stop.placeId,
      title: stop.placeName,
      imageUrl: stop.placeImageUrl,
      travelLabel: formatTravelMinutes(stop.travelTimeToNext),
    })),
  }
}
