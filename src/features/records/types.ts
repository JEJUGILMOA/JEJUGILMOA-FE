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

export type RecordVisibilityApi = 'PUBLIC' | 'PRIVATE'

/** `POST /api/records`의 장소별 메모 하나. 장소당 사진 여러 장(`imageObjectKeys`)을 보낼 수 있다 */
export type TravelRecordPlaceMemoRequest = {
  travelCourseId: number
  memo?: string
  imageObjectKeys?: string[]
}

/** `POST /api/records` 요청 body */
export type TravelRecordCreateRequest = {
  tripId: number
  title: string
  description?: string
  visibility?: RecordVisibilityApi
  placeMemos?: TravelRecordPlaceMemoRequest[]
  imageObjectKeys?: string[]
}

/** `POST /api/records` 응답 */
export type TravelRecordCreateResponse = {
  recordId: number
  tripId: number
  title: string
  visibility: RecordVisibilityApi
  createdAt: string
}

export type VisitedPlaceRecord = {
  /** 서버가 매긴 이 장소 방문 기록의 id. 수정(PATCH) 요청에 그대로 되돌려보낸다 */
  recordPlaceId: number
  placeId: string
  placeName: string
  address: string
  note: string
  photoUrls: string[]
  stayMinutes: number | null
  rating: number | null
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
  authorProfileImageUrl: string | null
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

/** `POST /api/image-uploads` 요청 — 이미지 하나당 presigned URL을 발급받는다 */
export type ImageUploadRequest = {
  contentType: string
  fileSize: number
}

/** `POST /api/image-uploads` 응답. `uploadUrl`은 S3 PUT 전용, 이후엔 `objectKey`만 쓴다 */
export type ImageUploadResponse = {
  objectKey: string
  uploadUrl: string
  httpMethod: string
  requiredHeaders: Record<string, string>
  expiresAt: string
}

export type RecordReactionApi = 'LIKE' | 'DISLIKE'

export type TravelRecordAuthorResponse = {
  authorId: number
  nickname: string
  profileImageUrl: string | null
}

export type TravelRecordImageResponse = {
  imageId: number
  imageUrl: string
  sequenceOrder: number
}

export type TravelRecordPlaceResponse = {
  recordPlaceId: number
  placeId: number
  placeName: string
  address: string
  latitude: number
  longitude: number
  visitDate: string
  sequenceOrder: number
  visited: boolean
  visitedAt: string | null
  memo: string | null
  stayMinutes: number | null
  rating: number | null
  images: TravelRecordImageResponse[]
}

export type TravelRecordPlanLinkResponse = {
  planId: number
  title: string
}

/** `GET /api/records/{recordId}` 응답 */
export type TravelRecordDetailResponse = {
  recordId: number
  title: string
  description: string | null
  visibility: RecordVisibilityApi
  actualStartDate: string
  actualEndDate: string
  createdAt: string
  updatedAt: string
  author: TravelRecordAuthorResponse
  plan: TravelRecordPlanLinkResponse | null
  images: TravelRecordImageResponse[]
  places: TravelRecordPlaceResponse[]
  likeCount: number
  dislikeCount: number
  myReaction: RecordReactionApi | null
}

/**
 * `GET /api/records` 목록 응답 페이지네이션 래퍼. swagger에 `content` 아이템 스키마가
 * 미완성으로 남아있어서(`content: {}` 제네릭), 목록에서는 `recordId`만 신뢰하고 나머지
 * 필드는 각 항목을 `GET /api/records/{recordId}`로 다시 조회해서 채운다.
 */
export type PageResponseObject<T> = {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  last: boolean
}

export type TravelRecordImageUpdateAction = 'REPLACE' | 'REMOVE'

export type TravelRecordPlaceUpdateRequest = {
  recordPlaceId: number
  memo?: string
  image?: { action: TravelRecordImageUpdateAction; objectKeys: string[] }
}

/** `PATCH /api/records/{recordId}` 요청 body */
export type TravelRecordUpdateRequest = {
  title?: string
  description?: string
  visibility?: RecordVisibilityApi
  places?: TravelRecordPlaceUpdateRequest[]
  /** null(또는 생략)=유지, []=전체 제거. 기존 사진의 objectKey를 서버가 안 돌려줘서(`imageUrl`만
   * 응답) 일부만 바꾸는 부분 diff는 표현할 수 없다 — 안 건드렸으면 생략, 바뀌었으면 새로
   * 첨부한 사진만으로 전체 교체한다(그 사이 유지하려던 기존 사진은 유실될 수 있음, 백엔드
   * 확인 필요 — `docs/RECORD_API_INTEGRATION.md` 리스크 참고). */
  imageObjectKeys?: string[]
}

/** 기록 수정 화면에서 장소 하나의 메모 입력 상태 → PATCH 요청으로 변환하기 전 중간 형태 */
export type RecordPlaceMemoUpdate = {
  recordPlaceId: number
  note: string
  photos: (File | string)[]
}

/** `updateRecord`에 넘기는 로컬 patch. `RecordEditPage`/`RecordManageSheet`가 이 모양으로 채운다 */
export type RecordUpdatePatch = {
  title?: string
  summary?: string
  visibility?: RecordVisibility
  visitedPlaces?: RecordPlaceMemoUpdate[]
  /** 기록 전체 사진 그리드의 현재 상태 (File=새로 첨부, string=기존 사진 URL 유지) */
  photos?: (File | string)[]
}
