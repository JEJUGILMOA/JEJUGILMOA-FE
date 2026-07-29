export type TripPlace = {
  id: string
  name: string
}

export type TripItineraryItem = {
  time: string
  activity: string
}

export type TripDayPlan = {
  day: number
  dateLabel: string
  items: TripItineraryItem[]
}

export type CompletedTrip = {
  id: string
  title: string
  dateRangeLabel: string
  places: TripPlace[]
  itinerary: TripDayPlan[]
}

export type PlaceMemo = {
  note: string
  /** 문자열은 이미 저장된 사진의 URL(기록 수정에서 기존 사진을 프리필할 때 사용), File은 새로 첨부한 사진 */
  photos: (File | string)[]
}

export type RecordVisibility = 'public' | 'private'

export type RecordDraft = {
  tripId: string | null
  title: string
  summary: string
  placeMemos: Record<string, PlaceMemo>
  /** 장소 사진만으로 대표 사진이 부족할 때 STEP 03에서 추가로 업로드한 사진 */
  extraPhotos: File[]
  /** STEP 03에서 고른 대표(썸네일) 사진. 장소별 사진 또는 extraPhotos 중 하나 */
  coverPhoto: File | null
  visibility: RecordVisibility
}

export type VisitedPlaceRecord = {
  placeId: string
  placeName: string
  note: string
  photoUrls: string[]
}

export type ReactionType = 'like' | 'dislike'

export type SavedRecord = {
  id: string
  /** 이 기록이 기반한 여행 계획의 id. CompletedTrip.id를 참조 (STEP 09 여행 계획 보기용) */
  tripId: string | null
  title: string
  summary: string
  thumbnailUrl: string | null
  /** STEP 03 대표 사진 + 장소별 사진을 합친 전체 사진 (캐러셀용) */
  photoUrls: string[]
  /** 이 기록이 기반한 여행의 일정 라벨 (예: "2026.05.02 - 05.05 · 3박4일") */
  tripDateRangeLabel: string
  visitedPlaces: VisitedPlaceRecord[]
  visitedPlaceCount: number
  photoCount: number
  visibility: RecordVisibility
  likeCount: number
  dislikeCount: number
  myReaction: ReactionType | null
  isBookmarked: boolean
  createdAt: string
}

export type PathPoint = {
  x: number
  y: number
}

export type ExploreRecord = {
  id: string
  title: string
  summary: string
  authorName: string
  linkedPlanTitle: string | null
  /** linkedPlanTitle이 있을 때의 일자별 일정. 작성자 본인 계획이 아니라 상세 데이터가 없으면 null */
  linkedPlanItinerary: TripDayPlan[] | null
  path: PathPoint[]
  photoUrls: string[]
  tripDateRangeLabel: string
  visitedPlaces: VisitedPlaceRecord[]
  createdAt: string
  isBookmarked: boolean
  likeCount: number
  dislikeCount: number
  myReaction: ReactionType | null
}
