import { mockCompletedTrips } from './mockCompletedTrips'
import { mockExploreRecords } from './mockExploreRecords'
import type { CompletedTrip, ExploreRecord, ReactionType, RecordDraft, SavedRecord } from './types'

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
  const uniquePhotos = new Set<File>()
  Object.values(draft.placeMemos).forEach((memo) => {
    memo.photos.forEach((photo) => uniquePhotos.add(photo))
  })
  draft.extraPhotos.forEach((photo) => uniquePhotos.add(photo))

  return {
    id: `record-${Date.now()}`,
    title: draft.title,
    summary: draft.summary,
    thumbnailUrl: draft.coverPhoto ? URL.createObjectURL(draft.coverPhoto) : null,
    visitedPlaceCount: trip?.places.length ?? 0,
    photoCount: uniquePhotos.size,
    visibility: draft.visibility,
    likeCount: 0,
    dislikeCount: 0,
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
  patch: Partial<Pick<SavedRecord, 'title' | 'summary' | 'visibility'>>,
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

/** TODO: 둘러보기 API가 준비되면 apiClient.get('/records/explore')로 교체 */
export async function fetchExploreRecords(): Promise<ExploreRecord[]> {
  // 매 호출마다 새 배열을 반환 (fetchMyRecords와 같은 이유)
  return [...mockExploreRecords]
}

/** TODO: 반응 API가 준비되면 apiClient.post(`/records/${id}/reactions`, ...)로 교체 */
export async function reactToExploreRecord(
  id: string,
  reaction: ReactionType,
): Promise<ExploreRecord> {
  const index = mockExploreRecords.findIndex((record) => record.id === id)
  if (index === -1) throw new Error('Record not found')

  const current = mockExploreRecords[index]
  const next = { ...current }

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

  mockExploreRecords[index] = next
  return next
}
