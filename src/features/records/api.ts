import { authStore } from '@/stores/authStore'
import { mockCompletedTrips } from './mockCompletedTrips'
import { mockExploreRecords } from './mockExploreRecords'
import type { CompletedTrip, ExploreRecord, ReactionType, RecordDraft, SavedRecord } from './types'

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

/** 새로 첨부한 File은 blob URL로, 기록 수정에서 프리필된 기존 URL 문자열은 그대로 반환 */
function photoToUrl(photo: File | string): string {
  return typeof photo === 'string' ? photo : URL.createObjectURL(photo)
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

/** TODO: 백엔드 API 연동 전까지 목데이터를 사용하는 스텁 */
export async function fetchCompletedTrips(): Promise<CompletedTrip[]> {
  return mockCompletedTrips
}

/** TODO: 백엔드 기록 저장소가 준비되면 제거. 그전까지 세션 내 임시 저장소 역할 */
const myRecords: SavedRecord[] = []

function toSavedRecord(draft: RecordDraft): SavedRecord {
  const trip = mockCompletedTrips.find((item) => item.id === draft.tripId)

  // 장소별 사진과 STEP 03 추가 업로드 사진을 합쳐 중복 없이 센다.
  // 대표 사진은 이 풀에서 고른 것이라 별도로 더하면 중복 집계된다.
  const uniquePhotos = collectUniquePhotos(draft)

  const visitedPlaces = (trip?.places ?? []).map((place) => {
    const memo = draft.placeMemos[place.id]
    return {
      placeId: place.id,
      placeName: place.name,
      note: memo?.note ?? '',
      photoUrls: (memo?.photos ?? []).map(photoToUrl),
    }
  })

  return {
    id: `record-${Date.now()}`,
    tripId: draft.tripId,
    title: draft.title,
    summary: draft.summary,
    thumbnailUrl: draft.coverPhoto ? URL.createObjectURL(draft.coverPhoto) : null,
    photoUrls: uniquePhotos.map((file) => URL.createObjectURL(file)),
    tripDateRangeLabel: trip?.dateRangeLabel ?? '',
    visitedPlaces,
    visitedPlaceCount: trip?.places.length ?? 0,
    photoCount: uniquePhotos.length,
    visibility: draft.visibility,
    likeCount: 0,
    dislikeCount: 0,
    myReaction: null,
    isBookmarked: false,
    createdAt: new Date().toISOString(),
  }
}

/** TODO: 기록 생성 API가 준비되면 apiClient.post('/records', ...)로 교체 */
export async function createRecord(draft: RecordDraft): Promise<{ id: string }> {
  const record = toSavedRecord(draft)
  myRecords.unshift(record)
  return { id: record.id }
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
