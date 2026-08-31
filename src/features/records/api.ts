import { apiGet, apiPost } from '@/api/http'
import { fetchPlans } from '@/features/plans/api'
import type { TravelPlan, TravelPlanDetailResponse } from '@/features/plans/types'
import { authStore } from '@/stores/authStore'
import { uploadImageAndGetObjectKey } from './imageUpload'
// TODO: STEP D에서 fetchMyRecords/fetchExploreRecords가 실 API로 바뀌면 이 mock 의존도 제거
import { mockCompletedTrips } from './mockCompletedTrips'
import { mockExploreRecords } from './mockExploreRecords'
import type {
  CompletedTrip,
  ExploreRecord,
  PlaceMemo,
  ReactionType,
  RecordDraft,
  SavedRecord,
  TravelRecordCreateRequest,
  TravelRecordCreateResponse,
  TravelRecordPlaceMemoRequest,
  TripDayPlan,
  TripPlace,
} from './types'

function currentNickname(): string {
  return authStore.getState().user?.nickname ?? '나'
}

/** 좋아요/싫어요 배타 토글 로직 (내 기록·둘러보기 기록 공용) */
function applyReaction<T extends { myReaction: ReactionType | null; likeCount: number; dislikeCount: number }>(
  record: T,
  reaction: ReactionType,
): T {
  const next = { ...record }
  if (next.myReaction === reaction) {
    if (reaction === 'like') next.likeCount -= 1
    else next.dislikeCount -= 1
    next.myReaction = null
  } else {
    if (next.myReaction === 'like') next.likeCount -= 1
    if (next.myReaction === 'dislike') next.dislikeCount -= 1
    if (reaction === 'like') next.likeCount += 1
    else next.dislikeCount += 1
    next.myReaction = reaction
  }
  return next
}

/** 전체공개로 설정한 내 기록을 둘러보기 목록에도 노출하기 위한 변환 */
function toExploreRecord(record: SavedRecord, authorName: string): ExploreRecord {
  const trip = mockCompletedTrips.find((item) => item.id === record.tripId)
  return {
    id: record.id,
    title: record.title,
    summary: record.summary,
    authorName,
    linkedPlanTitle: trip?.title ?? null,
    linkedPlanItinerary: trip?.itinerary ?? null,
    path: [],
    photoUrls: record.photoUrls,
    tripDateRangeLabel: record.tripDateRangeLabel,
    visitedPlaces: record.visitedPlaces,
    createdAt: record.createdAt,
    isBookmarked: record.isBookmarked,
    likeCount: record.likeCount,
    dislikeCount: record.dislikeCount,
    myReaction: record.myReaction,
  }
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

/** TODO: STEP D·E에서 fetchMyRecords/updateRecord/deleteRecord/반응·북마크가 실 API로 바뀌면 제거 */
const myRecords: SavedRecord[] = []

function objectKeyOf(file: File, fileToObjectKey: Map<File, string>): string {
  const objectKey = fileToObjectKey.get(file)
  if (!objectKey) throw new Error('업로드되지 않은 사진입니다')
  return objectKey
}

/**
 * 장소당 사진을 1장(`imageObjectKey`, 단수)만 받는 현재 서버 스펙에 맞춰, 장소의 "대표 사진
 * 하나"를 고르는 부분만 분리해뒀다. 서버가 장소당 여러 장(배열)을 받게 바뀌면 이 함수와
 * `TravelRecordPlaceMemoRequest` 타입만 고치면 된다.
 */
function resolvePlaceImageObjectKey(
  memo: PlaceMemo,
  fileToObjectKey: Map<File, string>,
): string | undefined {
  const [firstPhoto] = memo.photos
  if (!firstPhoto || typeof firstPhoto === 'string') return undefined
  return objectKeyOf(firstPhoto, fileToObjectKey)
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
      imageObjectKey: resolvePlaceImageObjectKey(memo, fileToObjectKey),
    }))
}

/**
 * 대표 사진 + STEP 03 추가 업로드 사진 + (장소당 대표 사진으로 쓰지 않은) 장소별 나머지
 * 사진을 기록 전체 사진첩(`imageObjectKeys`)으로 모은다.
 */
function buildRecordImageObjectKeys(draft: RecordDraft, fileToObjectKey: Map<File, string>): string[] {
  const leftoverPlacePhotos = Object.values(draft.placeMemos).flatMap((memo) =>
    memo.photos.slice(1).filter((photo): photo is File => photo instanceof File),
  )

  const files = [
    ...(draft.coverPhoto ? [draft.coverPhoto] : []),
    ...draft.extraPhotos,
    ...leftoverPlacePhotos,
  ]
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
    visibility: draft.visibility === 'public' ? 'PUBLIC' : 'PRIVATE',
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

/** TODO: 백엔드 API가 준비되면 apiClient.get('/records/me')로 교체 */
export async function fetchMyRecords(): Promise<SavedRecord[]> {
  // 매 호출마다 새 배열을 반환 — 같은 참조를 반환하면 구조적 공유 최적화로 인해
  // React Query가 "데이터 변경 없음"으로 판단해 리렌더를 건너뛴다.
  return [...myRecords]
}

/** TODO: 기록 수정 API가 준비되면 apiClient.patch(`/records/${id}`, patch)로 교체 */
export async function updateRecord(
  id: string,
  patch: Partial<
    Pick<
      SavedRecord,
      'title' | 'summary' | 'visibility' | 'visitedPlaces' | 'photoUrls' | 'photoCount'
    >
  >,
): Promise<SavedRecord> {
  const index = myRecords.findIndex((record) => record.id === id)
  if (index === -1) throw new Error('Record not found')

  const updated = { ...myRecords[index], ...patch }
  myRecords[index] = updated
  return updated
}

/** TODO: 기록 삭제 API가 준비되면 apiClient.delete(`/records/${id}`)로 교체 */
export async function deleteRecord(id: string): Promise<void> {
  const index = myRecords.findIndex((record) => record.id === id)
  if (index !== -1) myRecords.splice(index, 1)
}

/** TODO: 북마크 API가 준비되면 apiClient.post(`/records/${id}/bookmark`, ...)로 교체 */
export async function toggleRecordBookmark(id: string): Promise<SavedRecord> {
  const index = myRecords.findIndex((record) => record.id === id)
  if (index === -1) throw new Error('Record not found')

  const updated = { ...myRecords[index], isBookmarked: !myRecords[index].isBookmarked }
  myRecords[index] = updated
  return updated
}

/** TODO: 반응 API가 준비되면 apiClient.post(`/records/${id}/reactions`, ...)로 교체 */
export async function reactToRecord(id: string, reaction: ReactionType): Promise<SavedRecord> {
  const index = myRecords.findIndex((record) => record.id === id)
  if (index === -1) throw new Error('Record not found')

  const next = applyReaction(myRecords[index], reaction)
  myRecords[index] = next
  return next
}

/** TODO: 둘러보기 API가 준비되면 apiClient.get('/records/explore')로 교체 */
export async function fetchExploreRecords(): Promise<ExploreRecord[]> {
  // 전체공개로 설정한 내 기록도 다른 사용자 기록과 함께 노출한다.
  // 매 호출마다 새 배열을 반환 (fetchMyRecords와 같은 이유)
  const ownPublicRecords = myRecords
    .filter((record) => record.visibility === 'public')
    .map((record) => toExploreRecord(record, currentNickname()))

  return [...ownPublicRecords, ...mockExploreRecords].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  )
}

/** TODO: 반응 API가 준비되면 apiClient.post(`/records/${id}/reactions`, ...)로 교체 */
export async function reactToExploreRecord(
  id: string,
  reaction: ReactionType,
): Promise<ExploreRecord> {
  // 둘러보기에 노출된 게 내 기록일 수도 있으니 내 기록 저장소에서 먼저 찾는다
  const ownIndex = myRecords.findIndex((record) => record.id === id)
  if (ownIndex !== -1) {
    const updated = applyReaction(myRecords[ownIndex], reaction)
    myRecords[ownIndex] = updated
    return toExploreRecord(updated, currentNickname())
  }

  const index = mockExploreRecords.findIndex((record) => record.id === id)
  if (index === -1) throw new Error('Record not found')

  const next = applyReaction(mockExploreRecords[index], reaction)
  mockExploreRecords[index] = next
  return next
}

/** TODO: 북마크 API가 준비되면 apiClient.post(`/records/${id}/bookmark`, ...)로 교체 */
export async function toggleExploreRecordBookmark(id: string): Promise<ExploreRecord> {
  const ownIndex = myRecords.findIndex((record) => record.id === id)
  if (ownIndex !== -1) {
    const updated = { ...myRecords[ownIndex], isBookmarked: !myRecords[ownIndex].isBookmarked }
    myRecords[ownIndex] = updated
    return toExploreRecord(updated, currentNickname())
  }

  const index = mockExploreRecords.findIndex((record) => record.id === id)
  if (index === -1) throw new Error('Record not found')

  const updated = {
    ...mockExploreRecords[index],
    isBookmarked: !mockExploreRecords[index].isBookmarked,
  }
  mockExploreRecords[index] = updated
  return updated
}
