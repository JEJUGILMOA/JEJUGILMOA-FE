import { mockCompletedTrips } from './mockCompletedTrips'
import type { CompletedTrip, RecordDraft, SavedRecord } from './types'

/** TODO: 백엔드 API 연동 전까지 목데이터를 사용하는 스텁 */
export async function fetchCompletedTrips(): Promise<CompletedTrip[]> {
  return mockCompletedTrips
}

/** TODO: 백엔드 기록 저장소가 준비되면 제거. 그전까지 세션 내 임시 저장소 역할 */
const myRecords: SavedRecord[] = []

function toSavedRecord(draft: RecordDraft): SavedRecord {
  const trip = mockCompletedTrips.find((item) => item.id === draft.tripId)
  const memoPhotoCount = Object.values(draft.placeMemos).reduce(
    (sum, memo) => sum + memo.photos.length,
    0,
  )

  return {
    id: `record-${Date.now()}`,
    title: draft.title,
    summary: draft.summary,
    thumbnailUrl: draft.photos[0] ? URL.createObjectURL(draft.photos[0]) : null,
    visitedPlaceCount: trip?.places.length ?? 0,
    photoCount: draft.photos.length + memoPhotoCount,
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
  return myRecords
}
