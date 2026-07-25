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
  photos: File[]
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

export type ExploreRecord = {
  id: string
  title: string
  summary: string
  authorName: string
  linkedPlanTitle: string | null
  path: PathPoint[]
}
