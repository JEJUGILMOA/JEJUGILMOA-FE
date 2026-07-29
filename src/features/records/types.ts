export type TripPlace = {
  id: string
  name: string
}

export type CompletedTrip = {
  id: string
  title: string
  dateRangeLabel: string
  places: TripPlace[]
}

export type PlaceMemo = {
  note: string
  photos: File[]
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

export type SavedRecord = {
  id: string
  title: string
  summary: string
  thumbnailUrl: string | null
  visitedPlaceCount: number
  photoCount: number
  visibility: RecordVisibility
  likeCount: number
  dislikeCount: number
  createdAt: string
}

export type PathPoint = {
  x: number
  y: number
}

export type ReactionType = 'like' | 'dislike'

export type ExploreRecord = {
  id: string
  title: string
  summary: string
  authorName: string
  linkedPlanTitle: string | null
  path: PathPoint[]
  likeCount: number
  dislikeCount: number
  myReaction: ReactionType | null
}
