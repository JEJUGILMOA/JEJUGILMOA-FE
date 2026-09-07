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
 * STEP 03 추가 업로드 사진을 기록 전체 사진첩(`imageObjectKeys`)으로 모은다. 장소 사진 풀과
 * 겹치는 파일은 제외한다 — 같은 objectKey를 장소 쪽과 기록 전체 쪽에 둘 다 넣으면 서버가
 * 중복으로 거부한다(`RECORD400_3`). 대표 사진 지정은 이제 `thumbnailImageObjectKey`로 따로
 * 하니, 여기서 대표 사진을 맨 앞에 오도록 순서를 조작할 필요는 없다.
 */
function buildRecordImageObjectKeys(draft: RecordDraft, fileToObjectKey: Map<File, string>): string[] {
  const placePhotoFiles = new Set(
    Object.values(draft.placeMemos).flatMap((memo) =>
      memo.photos.filter((photo): photo is File => photo instanceof File),
    ),
  )
  const files = draft.extraPhotos.filter((file) => !placePhotoFiles.has(file))
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
    thumbnailImageObjectKey: draft.coverPhoto ? objectKeyOf(draft.coverPhoto, fileToObjectKey) : undefined,
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
 *
 * `Promise.all` 대신 `allSettled`를 쓴다 — 기록 하나의 상세 조회만 실패해도(예: 데이터가
 * 깨진 기록 하나) `Promise.all`이면 목록 전체가 통째로 안 뜨게 된다. 실패한 항목은 콘솔에
 * 경고만 남기고 나머지는 정상적으로 보여준다.
 */
async function fetchRecordDetails(mine: boolean): Promise<TravelRecordDetailResponse[]> {
  const page = await apiGet<PageResponseObject<RecordListItem>>('/records', {
    params: { mine, view: 'CARD' },
  })
  const results = await Promise.allSettled(page.content.map((item) => fetchRecordDetail(item.recordId)))
  return results.flatMap((result, index) => {
    if (result.status === 'fulfilled') return [result.value]
    console.warn(`기록 상세 조회 실패 (recordId=${page.content[index].recordId})`, result.reason)
    return []
  })
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

function mapImageObjectKeyByUrl(images: TravelRecordImageResponse[]): Record<string, string> {
  return Object.fromEntries(images.map((image) => [image.imageUrl, image.objectKey]))
}

/** 'yyyy-MM-dd' -> 'yyyy.MM.dd' */
function formatApiDate(date: string): string {
  return date.replaceAll('-', '.')
}

/**
 * `actualEndDate`는 여행이 끝나지 않은(방문 인증이 다 안 된) 기록에서 null로 올 수 있다
 * (실제로 recordId 7에서 확인됨) — null이면 시작일만으로 라벨을 만든다. 이걸 안 막으면
 * `null.replaceAll(...)`에서 터져서, 이 기록이 섞인 목록 전체(`Promise.all(...).map(...)`)가
 * 통째로 실패해 "둘러보기"가 텅 비어 보이는 문제가 있었다.
 */
function buildTripDateRangeLabel(startDate: string, endDate: string | null, visitedPlaceCount: number): string {
  const visitedLabel = `${visitedPlaceCount}곳 방문`
  const start = formatApiDate(startDate)
  if (!endDate) return `${start} · ${visitedLabel}`
  const end = formatApiDate(endDate)
  return start === end ? `${start} · ${visitedLabel}` : `${start} - ${end.slice(5)} · ${visitedLabel}`
}

function mapDetailToSavedRecord(detail: TravelRecordDetailResponse): SavedRecord {
  const photoUrls = mapDetailToPhotoUrls(detail.allImages)
  return {
    id: String(detail.recordId),
    tripId: detail.plan ? String(detail.plan.planId) : null,
    title: detail.title,
    summary: detail.description ?? '',
    thumbnailUrl: detail.thumbnailUrl ?? photoUrls[0] ?? null,
    photoUrls,
    imageObjectKeyByUrl: mapImageObjectKeyByUrl(detail.allImages),
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
  const photoUrls = mapDetailToPhotoUrls(detail.allImages)
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

/** `updateRecord`에서 새로 첨부된 File을 딱 한 번씩만 업로드하려고 patch 전체를 훑어 모은다 */
function collectUniqueUpdateFiles(patch: RecordUpdatePatch): File[] {
  const seen = new Set<File>()
  const files: File[] = []
  const add = (photo: File | string) => {
    if (typeof photo === 'string') return
    if (seen.has(photo)) return
    seen.add(photo)
    files.push(photo)
  }
  patch.photos?.forEach(add)
  patch.visitedPlaces?.forEach((place) => place.photos.forEach(add))
  return files
}

/**
 * 장소 하나의 메모 수정을 PATCH 요청 항목으로 변환. 사진 REPLACE는 이미 업로드해둔
 * objectKey 배열을 보내면 되고, REMOVE는 액션 플래그만 있으면 되니 기존 objectKey가
 * 없어도 표현 가능하다(장소 사진은 문제없음 — 기록 전체 사진첩과 다른 점).
 */
function buildPlaceUpdateRequest(
  place: RecordPlaceMemoUpdate,
  before: VisitedPlaceRecord | undefined,
  fileToObjectKey: Map<File, string>,
): TravelRecordPlaceUpdateRequest | null {
  const newFiles = place.photos.filter((photo): photo is File => photo instanceof File)
  const hadPhotos = Boolean(before?.photoUrls.length)
  const noteChanged = (before?.note ?? '') !== place.note

  let image: TravelRecordPlaceUpdateRequest['image']
  if (newFiles.length > 0) {
    image = { action: 'REPLACE', objectKeys: newFiles.map((file) => objectKeyOf(file, fileToObjectKey)) }
  } else if (place.photos.length === 0 && hadPhotos) {
    image = { action: 'REMOVE', objectKeys: [] }
  }

  if (!noteChanged && !image) return null
  return { recordPlaceId: place.recordPlaceId, memo: place.note, image }
}

function buildPlaceUpdateRequests(
  places: RecordPlaceMemoUpdate[],
  original: VisitedPlaceRecord[],
  fileToObjectKey: Map<File, string>,
): TravelRecordPlaceUpdateRequest[] {
  const originalById = new Map(original.map((place) => [place.recordPlaceId, place]))
  return places
    .map((place) => buildPlaceUpdateRequest(place, originalById.get(place.recordPlaceId), fileToObjectKey))
    .filter((request): request is TravelRecordPlaceUpdateRequest => request !== null)
}

function objectKeyOfUrl(url: string, imageObjectKeyByUrl: Record<string, string>): string {
  const objectKey = imageObjectKeyByUrl[url]
  if (!objectKey) throw new Error('objectKey를 알 수 없는 사진입니다')
  return objectKey
}

/**
 * 기록 전체 사진 그리드의 최종 상태(기존 사진 유지 + 새로 첨부한 사진 + 삭제)를 그대로
 * objectKey 배열로 표현한다. 이제 기존 사진도 `objectKey`를 알 수 있어서(TravelRecordImageResponse),
 * 안 건드린 사진은 그 objectKey를, 새로 첨부한 File은 방금 업로드한 objectKey를 그대로 섞어
 * 보낼 수 있다 — 예전처럼 뭐든 바뀌면 전체를 새 파일로만 교체할 필요가 없다.
 */
function buildRecordImageObjectKeysForUpdate(
  photos: (File | string)[] | undefined,
  originalOwnPhotoUrls: string[],
  imageObjectKeyByUrl: Record<string, string>,
  fileToObjectKey: Map<File, string>,
): string[] | undefined {
  if (!photos) return undefined
  const unchanged =
    photos.length === originalOwnPhotoUrls.length &&
    photos.every((photo, index) => photo === originalOwnPhotoUrls[index])
  if (unchanged) return undefined

  return photos.map((photo) =>
    typeof photo === 'string' ? objectKeyOfUrl(photo, imageObjectKeyByUrl) : objectKeyOf(photo, fileToObjectKey),
  )
}

export async function updateRecord(id: string, patch: RecordUpdatePatch, original: SavedRecord): Promise<void> {
  const files = collectUniqueUpdateFiles(patch)
  const objectKeys = await Promise.all(files.map((file) => uploadImageAndGetObjectKey(file)))
  const fileToObjectKey = new Map(files.map((file, index) => [file, objectKeys[index]]))

  const places = patch.visitedPlaces
    ? buildPlaceUpdateRequests(patch.visitedPlaces, original.visitedPlaces, fileToObjectKey)
    : undefined
  // original.photoUrls는 서버가 대표 사진 + 장소별 사진을 합쳐서 주는 값(`allImages`)이라,
  // 기록 자체의 대표 사진첩과 비교하려면 장소 사진과 겹치는 걸 빼야 한다(RecordEditPage의
  // `photos` state도 같은 기준으로 걸러서 만든다 — 안 맞추면 "변경 없음" 판정이 항상 어긋나서
  // 매번 imageObjectKeys를 필요 이상으로 다시 보내게 된다).
  const originalPlacePhotoUrls = new Set(original.visitedPlaces.flatMap((place) => place.photoUrls))
  const originalOwnPhotoUrls = original.photoUrls.filter((url) => !originalPlacePhotoUrls.has(url))
  const imageObjectKeys = buildRecordImageObjectKeysForUpdate(
    patch.photos,
    originalOwnPhotoUrls,
    original.imageObjectKeyByUrl,
    fileToObjectKey,
  )
  const thumbnailImageObjectKey =
    patch.coverPhoto === undefined || patch.coverPhoto === null
      ? undefined
      : typeof patch.coverPhoto === 'string'
        ? objectKeyOfUrl(patch.coverPhoto, original.imageObjectKeyByUrl)
        : objectKeyOf(patch.coverPhoto, fileToObjectKey)

  const payload: TravelRecordUpdateRequest = {
    title: patch.title,
    description: patch.summary,
    visibility: patch.visibility ? toApiVisibility(patch.visibility) : undefined,
    places: places && places.length > 0 ? places : undefined,
    imageObjectKeys,
    thumbnailImageObjectKey,
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
