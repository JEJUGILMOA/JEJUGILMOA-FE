import { apiDelete, apiGet, apiPatch, apiPost } from '@/api/http'
import { fetchPlans } from '@/features/plans/api'
import type { TravelPlan, TravelPlanDetailResponse } from '@/features/plans/types'
import { uploadImageAndGetObjectKey } from './imageUpload'
import type {
  CompletedTrip,
  ExploreRecord,
  PageResponseObject,
  PlaceMemo,
  ReactionType,
  RecordDraft,
  RecordPlaceMemoUpdate,
  RecordReactionApi,
  RecordUpdatePatch,
  RecordVisibility,
  RecordVisibilityApi,
  SavedRecord,
  TravelRecordCreateRequest,
  TravelRecordCreateResponse,
  TravelRecordDetailResponse,
  TravelRecordImageResponse,
  TravelRecordPlaceMemoRequest,
  TravelRecordPlaceResponse,
  TravelRecordPlaceUpdateRequest,
  TravelRecordUpdateRequest,
  TripDayPlan,
  TripPlace,
  VisitedPlaceRecord,
} from './types'

function toApiVisibility(visibility: RecordVisibility): RecordVisibilityApi {
  return visibility === 'public' ? 'PUBLIC' : 'PRIVATE'
}

function fromApiVisibility(visibility: RecordVisibilityApi): RecordVisibility {
  return visibility === 'PUBLIC' ? 'public' : 'private'
}

function toApiReaction(reaction: ReactionType): RecordReactionApi {
  return reaction === 'like' ? 'LIKE' : 'DISLIKE'
}

function collectUniquePhotos(draft: RecordDraft): File[] {
  const seen = new Set<File>()
  const photos: File[] = []
  const add = (photo: File | string) => {
    // 생성 플로우의 draft는 항상 새로 첨부한 File만 다룬다 (기존 URL 문자열은 기록 수정에서만 등장).
    if (typeof photo === 'string') return
    if (seen.has(photo)) return
    seen.add(photo)
    photos.push(photo)
  }
  Object.values(draft.placeMemos).forEach((memo) => memo.photos.forEach(add))
  draft.extraPhotos.forEach(add)
  return photos
}

/**
 * `GET /api/plans/{planId}` 응답을 `CompletedTrip`으로 변환.
 * 경유지 id는 `waypointId`를 쓴다 — 기록 생성 API가 요구하는 `travelCourseId`와 값이
 * 같다는 가정 하에 그대로 넘긴다 (계획 도메인엔 별도 travelCourseId 필드가 없다).
 */
function mapPlanDetailToCompletedTrip(plan: TravelPlan, detail: TravelPlanDetailResponse): CompletedTrip {
  const sortedDays = detail.itinerary.slice().sort((a, b) => a.dayNumber - b.dayNumber)

  const sortedWaypoints = (day: TravelPlanDetailResponse['itinerary'][number]) =>
    day.waypoints.slice().sort((a, b) => a.sequenceOrder - b.sequenceOrder)

  const places: TripPlace[] = sortedDays.flatMap((day) =>
    sortedWaypoints(day).map((waypoint) => ({ id: String(waypoint.waypointId), name: waypoint.placeName })),
  )

  const itinerary: TripDayPlan[] = sortedDays.map((day) => ({
    day: day.dayNumber,
    // 'yyyy-MM-dd' -> 'MM.dd'
    dateLabel: day.date.slice(5).replaceAll('-', '.'),
    items: sortedWaypoints(day).map((waypoint) => ({ time: '', activity: waypoint.placeName })),
  }))

  const visitedLabel = `${places.length}곳 방문`
  // plan.endDate는 'yyyy.MM.dd' -> 'MM.dd'만 잘라 범위 표기에 쓴다 (mock 데이터와 동일한 표기)
  const dateRangeLabel =
    plan.startDate === plan.endDate
      ? `${plan.startDate} · ${visitedLabel}`
      : `${plan.startDate} - ${plan.endDate.slice(5)} · ${visitedLabel}`

  return { id: plan.id, title: plan.title, dateRangeLabel, places, itinerary }
}

export async function fetchCompletedTrips(): Promise<CompletedTrip[]> {
  const completedPlans = await fetchPlans({ status: 'COMPLETED' })
  return Promise.all(
    completedPlans.map(async (plan) => {
      const detail = await apiGet<TravelPlanDetailResponse>(`/plans/${plan.id}`)
      return mapPlanDetailToCompletedTrip(plan, detail)
    }),
  )
}

function objectKeyOf(file: File, fileToObjectKey: Map<File, string>): string {
  const objectKey = fileToObjectKey.get(file)
  if (!objectKey) throw new Error('업로드되지 않은 사진입니다')
  return objectKey
}

function resolvePlaceImageObjectKeys(memo: PlaceMemo, fileToObjectKey: Map<File, string>): string[] {
  return memo.photos
    .filter((photo): photo is File => photo instanceof File)
    .map((file) => objectKeyOf(file, fileToObjectKey))
}

/** 메모나 사진이 있는 장소만 골라 `placeMemos` 요청 항목으로 매핑 */
function buildPlaceMemoRequests(
  draft: RecordDraft,
  fileToObjectKey: Map<File, string>,
): TravelRecordPlaceMemoRequest[] {
  return Object.entries(draft.placeMemos)
    .filter(([, memo]) => memo.note.trim().length > 0 || memo.photos.length > 0)
    .map(([travelCourseId, memo]) => ({
      travelCourseId: Number(travelCourseId),
      memo: memo.note,
      imageObjectKeys: resolvePlaceImageObjectKeys(memo, fileToObjectKey),
    }))
}

/**
 * 대표 사진 + STEP 03 추가 업로드 사진을 기록 전체 사진첩(`imageObjectKeys`)으로 모은다.
 * 대표 사진은 장소 사진 풀 또는 extraPhotos 중에서 고르는데, 두 경우 다 같은 File이
 * 다른 곳에도 이미 들어있는 것이라 그대로 합치면 objectKey가 중복돼 서버가 거부한다
 * (`RECORD400_3`) — 장소 사진과 겹치면 제외, extraPhotos와 겹치면(대표 사진으로 고른
 * 그 사진) 한 번만 넣는다.
 */
function buildRecordImageObjectKeys(draft: RecordDraft, fileToObjectKey: Map<File, string>): string[] {
  const placePhotoFiles = new Set(
    Object.values(draft.placeMemos).flatMap((memo) =>
      memo.photos.filter((photo): photo is File => photo instanceof File),
    ),
  )
  const seen = new Set<File>()
  const files: File[] = []
  const add = (file: File) => {
    if (placePhotoFiles.has(file) || seen.has(file)) return
    seen.add(file)
    files.push(file)
  }
  if (draft.coverPhoto) add(draft.coverPhoto)
  draft.extraPhotos.forEach(add)
  return files.map((file) => objectKeyOf(file, fileToObjectKey))
}

function buildRecordCreateRequest(
  draft: RecordDraft,
  fileToObjectKey: Map<File, string>,
): TravelRecordCreateRequest {
  return {
    tripId: Number(draft.tripId),
    title: draft.title,
    description: draft.summary,
    visibility: toApiVisibility(draft.visibility),
    placeMemos: buildPlaceMemoRequests(draft, fileToObjectKey),
    imageObjectKeys: buildRecordImageObjectKeys(draft, fileToObjectKey),
  }
}

export async function createRecord(draft: RecordDraft): Promise<{ id: string }> {
  const files = collectUniquePhotos(draft)
  const objectKeys = await Promise.all(files.map((file) => uploadImageAndGetObjectKey(file)))
  const fileToObjectKey = new Map(files.map((file, index) => [file, objectKeys[index]]))

  const response = await apiPost<TravelRecordCreateResponse>(
    '/records',
    buildRecordCreateRequest(draft, fileToObjectKey),
  )
  return { id: String(response.recordId) }
}

/** `GET /api/records` 목록 응답 아이템 — swagger 미완성이라 `recordId`만 신뢰한다 */
type RecordListItem = { recordId: number }

async function fetchRecordDetail(recordId: number): Promise<TravelRecordDetailResponse> {
  return apiGet<TravelRecordDetailResponse>(`/records/${recordId}`)
}

/**
 * `GET /api/records`(목록) 응답 스키마가 swagger에 미완성이라, 목록에서 `recordId`만 뽑아
 * 각각 `GET /api/records/{recordId}`(문서화된 상세)로 다시 조회해서 채운다. 기록이 많아지면
 * N+1이 되니, 목록 응답 스키마가 확정되면 최적화할 것 (`docs/RECORD_API_INTEGRATION.md` 참고).
 */
async function fetchRecordDetails(mine: boolean): Promise<TravelRecordDetailResponse[]> {
  const page = await apiGet<PageResponseObject<RecordListItem>>('/records', {
    params: { mine, view: 'CARD' },
  })
  return Promise.all(page.content.map((item) => fetchRecordDetail(item.recordId)))
}

function sortBySequenceOrder<T extends { sequenceOrder: number }>(items: T[]): T[] {
  return items.slice().sort((a, b) => a.sequenceOrder - b.sequenceOrder)
}

function mapDetailToVisitedPlaces(places: TravelRecordPlaceResponse[]): VisitedPlaceRecord[] {
  return sortBySequenceOrder(places).map((place) => ({
    recordPlaceId: place.recordPlaceId,
    placeId: String(place.placeId),
    placeName: place.placeName,
    address: place.address,
    note: place.memo ?? '',
    photoUrls: sortBySequenceOrder(place.images).map((image) => image.imageUrl),
    stayMinutes: place.stayMinutes,
    rating: place.rating,
  }))
}

function mapDetailToPhotoUrls(images: TravelRecordImageResponse[]): string[] {
  return sortBySequenceOrder(images).map((image) => image.imageUrl)
}

/** 'yyyy-MM-dd' -> 'yyyy.MM.dd' */
function formatApiDate(date: string): string {
  return date.replaceAll('-', '.')
}

function buildTripDateRangeLabel(startDate: string, endDate: string, visitedPlaceCount: number): string {
  const visitedLabel = `${visitedPlaceCount}곳 방문`
  const start = formatApiDate(startDate)
  const end = formatApiDate(endDate)
  return start === end ? `${start} · ${visitedLabel}` : `${start} - ${end.slice(5)} · ${visitedLabel}`
}

function mapDetailToSavedRecord(detail: TravelRecordDetailResponse): SavedRecord {
  const photoUrls = mapDetailToPhotoUrls(detail.images)
  return {
    id: String(detail.recordId),
    tripId: detail.plan ? String(detail.plan.planId) : null,
    title: detail.title,
    summary: detail.description ?? '',
    thumbnailUrl: photoUrls[0] ?? null,
    photoUrls,
    tripDateRangeLabel: buildTripDateRangeLabel(detail.actualStartDate, detail.actualEndDate, detail.places.length),
    visitedPlaces: mapDetailToVisitedPlaces(detail.places),
    visitedPlaceCount: detail.places.length,
    photoCount: photoUrls.length,
    visibility: fromApiVisibility(detail.visibility),
    likeCount: detail.likeCount,
    dislikeCount: detail.dislikeCount,
    myReaction: detail.myReaction === 'LIKE' ? 'like' : detail.myReaction === 'DISLIKE' ? 'dislike' : null,
    // 서버에 북마크 API가 없어 로컬 전용으로 남겨둔다 (hooks.ts의 캐시 토글 참고)
    isBookmarked: false,
    createdAt: detail.createdAt,
  }
}

function mapDetailToExploreRecord(detail: TravelRecordDetailResponse): ExploreRecord {
  const photoUrls = mapDetailToPhotoUrls(detail.images)
  return {
    id: String(detail.recordId),
    title: detail.title,
    summary: detail.description ?? '',
    authorName: detail.author.nickname,
    authorProfileImageUrl: detail.author.profileImageUrl,
    linkedPlanTitle: detail.plan?.title ?? null,
    // 다른 사용자의 계획 상세는 API 권한상 조회할 수 없어 보임(계획은 본인 것만 조회 가능) — null 유지
    linkedPlanItinerary: null,
    path: [],
    photoUrls,
    tripDateRangeLabel: buildTripDateRangeLabel(detail.actualStartDate, detail.actualEndDate, detail.places.length),
    visitedPlaces: mapDetailToVisitedPlaces(detail.places),
    createdAt: detail.createdAt,
    isBookmarked: false,
    likeCount: detail.likeCount,
    dislikeCount: detail.dislikeCount,
    myReaction: detail.myReaction === 'LIKE' ? 'like' : detail.myReaction === 'DISLIKE' ? 'dislike' : null,
  }
}

export async function fetchMyRecords(): Promise<SavedRecord[]> {
  const details = await fetchRecordDetails(true)
  return details.map(mapDetailToSavedRecord)
}

export async function fetchExploreRecords(): Promise<ExploreRecord[]> {
  const details = await fetchRecordDetails(false)
  return details.map(mapDetailToExploreRecord).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

/**
 * 장소 하나의 메모 수정을 PATCH 요청 항목으로 변환. 사진 REPLACE는 새로 첨부한 File들을
 * 업로드해서 그 objectKey 배열을 보내면 되고, REMOVE는 액션 플래그만 있으면 되니 기존
 * objectKey가 없어도 표현 가능하다(장소 사진은 문제없음 — 기록 전체 사진첩과 다른 점).
 */
async function buildPlaceUpdateRequest(
  place: RecordPlaceMemoUpdate,
  before: VisitedPlaceRecord | undefined,
): Promise<TravelRecordPlaceUpdateRequest | null> {
  const newFiles = place.photos.filter((photo): photo is File => photo instanceof File)
  const hadPhotos = Boolean(before?.photoUrls.length)
  const noteChanged = (before?.note ?? '') !== place.note

  let image: TravelRecordPlaceUpdateRequest['image']
  if (newFiles.length > 0) {
    const objectKeys = await Promise.all(newFiles.map((file) => uploadImageAndGetObjectKey(file)))
    image = { action: 'REPLACE', objectKeys }
  } else if (place.photos.length === 0 && hadPhotos) {
    image = { action: 'REMOVE', objectKeys: [] }
  }

  if (!noteChanged && !image) return null
  return { recordPlaceId: place.recordPlaceId, memo: place.note, image }
}

async function buildPlaceUpdateRequests(
  places: RecordPlaceMemoUpdate[],
  original: VisitedPlaceRecord[],
): Promise<TravelRecordPlaceUpdateRequest[]> {
  const originalById = new Map(original.map((place) => [place.recordPlaceId, place]))
  const results = await Promise.all(
    places.map((place) => buildPlaceUpdateRequest(place, originalById.get(place.recordPlaceId))),
  )
  return results.filter((request): request is TravelRecordPlaceUpdateRequest => request !== null)
}

/**
 * 서버가 기존 사진의 objectKey를 안 돌려주기 때문에(응답엔 `imageUrl`만 있음) 기존 사진을
 * 유지한 채 일부만 바꾸는 부분 수정은 표현할 수 없다. 안 건드렸으면 생략(유지), 뭐든
 * 바뀌었으면 새로 첨부한 File만 업로드해서 전체를 그걸로 교체한다 — 그 사이 남겨두고 싶던
 * 기존 사진은 유실될 수 있다(백엔드 확인 필요, `docs/RECORD_API_INTEGRATION.md` 참고).
 */
async function buildRecordImageObjectKeysForUpdate(
  photos: (File | string)[] | undefined,
  original: string[],
): Promise<string[] | undefined> {
  if (!photos) return undefined
  const unchanged = photos.length === original.length && photos.every((photo, index) => photo === original[index])
  if (unchanged) return undefined

  const newFiles = photos.filter((photo): photo is File => photo instanceof File)
  return Promise.all(newFiles.map((file) => uploadImageAndGetObjectKey(file)))
}

export async function updateRecord(id: string, patch: RecordUpdatePatch, original: SavedRecord): Promise<void> {
  const places = patch.visitedPlaces
    ? await buildPlaceUpdateRequests(patch.visitedPlaces, original.visitedPlaces)
    : undefined
  const imageObjectKeys = await buildRecordImageObjectKeysForUpdate(patch.photos, original.photoUrls)

  const payload: TravelRecordUpdateRequest = {
    title: patch.title,
    description: patch.summary,
    visibility: patch.visibility ? toApiVisibility(patch.visibility) : undefined,
    places: places && places.length > 0 ? places : undefined,
    imageObjectKeys,
  }
  await apiPatch(`/records/${id}`, payload)
}

export async function deleteRecord(id: string): Promise<void> {
  await apiDelete(`/records/${id}`)
}

/** 같은 반응을 다시 누르면 취소(DELETE), 다른 반응이면 그걸로 설정(POST) — 좋아요/싫어요 배타 토글 */
export async function toggleRecordReaction(
  id: string,
  reaction: ReactionType,
  currentReaction: ReactionType | null,
): Promise<void> {
  if (currentReaction === reaction) {
    await apiDelete(`/records/${id}/reactions`)
    return
  }
  await apiPost(`/records/${id}/reactions`, { reactionType: toApiReaction(reaction) })
}
