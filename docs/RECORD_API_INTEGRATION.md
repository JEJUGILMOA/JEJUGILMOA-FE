# 여행 기록(record) 페이지 API 연동 진행 상황 (feat/#20)

기준: `feat/#20` 브랜치, 최신 커밋 기준 STEP A~E(완료 여행 목록·이미지 업로드·기록 생성·목록/상세 조회·반응·수정·삭제) 전부 실 API 연동 완료 + 후속으로 스웨거 변경분(좋아요/싫어요 실 API, 사진 배열화) 반영함.

## 목표

`src/features/records/api.ts`를 로컬 mock에서 실제 백엔드(`https://gilmoa-dev.gyeonseo.com`)로 연동. 이미지는 presigned URL 방식(`POST /api/image-uploads`로 S3 업로드 URL 발급 → 프론트가 S3에 직접 PUT → `objectKey`만 기록 API에 전달).

## 진행 상황

| STEP | 내용 | 상태 |
|---|---|---|
| A | 완료 여행 목록 (`GET /api/plans?status=COMPLETED`) 실 연동 | ✅ 완료 |
| B | presigned URL 이미지 업로드 인프라 | ✅ 완료 |
| C | 기록 생성(`createRecord`) 실 연동 | ✅ 완료 |
| D | 목록/상세 조회(`fetchMyRecords`/`fetchExploreRecords`) 실 연동 | ✅ 완료 |
| E | 수정(`updateRecord`)/삭제(`deleteRecord`) 실 연동 | ✅ 완료 |
| F | 좋아요/싫어요 실 API 연동 (`POST/DELETE /api/records/{id}/reactions`) | ✅ 완료 |
| G | 장소별 사진 배열화 (`imageObjectKeys`/`objectKeys`, 생성·수정·응답 전부) | ✅ 완료 |

`mockCompletedTrips.ts`/`mockExploreRecords.ts`는 더 안 쓰여서 삭제함.

## 해결된 이슈 (과거엔 리스크였던 것)

- **장소당 사진 1장 제약이 배열로 풀림**: 백엔드가 `TravelRecordPlaceMemoRequest.imageObjectKey`(단수)를 `imageObjectKeys`(배열)로, `TravelRecordPlaceUpdateRequest.image.objectKey`도 `objectKeys`(배열)로, 응답 `TravelRecordPlaceResponse.image`도 `images`(배열)로 전부 바꿔줬다. 장소당 사진 여러 장을 그대로 다 보내고/받아올 수 있음 — 예전에 "장소당 첫 사진만 보내고 나머지는 기록 전체 사진첩으로" 하던 우회 로직 제거함.
- **좋아요/싫어요 API가 생김**: `POST /api/records/{id}/reactions`(설정)/`DELETE /api/records/{id}/reactions`(취소)로 실 연동. `hooks.ts`의 로컬 캐시 토글 제거하고 성공 시 캐시 무효화 방식으로 교체.
- **`travelCourseId` = 여행(trip)의 `waypointId`로 확인됨**: `POST /api/trips/{tripId}/waypoints/{waypointId}/skip`(경유지 건너뛰기, 신규 API) 스웨거 설명에 `waypointId`를 "건너뛸 경유지(**TravelCourse**) ID"라고 명시해둔 걸 확인 — 기록 생성 요청의 `travelCourseId`와 같은 개념·같은 값이라는 뜻. 기존에 `waypointId`를 그대로 보내던 가정이 맞았음.
- **`GET /api/records/{recordId}` 응답에 `thumbnailUrl`/`thumbnailImageId`/`imageCount`/`allImages`(대표 사진 + 장소별 사진을 서버가 합쳐서 주는 전체 목록) 추가됨** — 프론트에서 하던 "대표 사진 + 장소 사진 합치기" 로직(`collectAllPhotoUrls`)을 걷어내고 `allImages`/`thumbnailUrl`을 그대로 씀(`mapDetailToSavedRecord`/`mapDetailToExploreRecord`, `records/api.ts`).
- **`TravelRecordImageResponse`에 `objectKey` 필드 추가됨** (`imageId`/`imageUrl`/`objectKey`/`sequenceOrder`) — 기존에 저장된 사진도 이제 objectKey를 알 수 있음. `SavedRecord.imageObjectKeyByUrl`(url → objectKey)로 노출해서 씀.
- **대표(썸네일) 사진 지정이 생성·수정 둘 다 실제로 연결됨**: `PATCH`뿐 아니라 `POST /api/records`에도 `thumbnailImageObjectKey`가 추가돼서, 생성 시 장소 사진을 대표로 골라도(=기록 전체 사진첩엔 안 들어가는 사진이어도) 문제없이 반영됨(`buildRecordCreateRequest`). 수정 화면(`CoverPhotoSelector`)에서도 새로 첨부한 사진뿐 아니라 **기존 사진 중에서도** 대표로 재지정 가능.
- **수정(PATCH) 시 기록 전체 사진(`imageObjectKeys`) 부분 교체 제약도 풀림**: 위 `objectKey` 추가 덕분에 기존 사진 유지 + 새 사진 추가 + 일부 삭제를 한 번에 정확히 표현 가능(`buildRecordImageObjectKeysForUpdate`, `records/api.ts`) — 더 이상 "뭐든 바뀌면 새로 첨부한 것만으로 전체 교체" 방식이 아님.

## 아직 남은 리스크

- **`GET /api/records` 목록 응답 스키마가 swagger에 여전히 미완성**이다 (`content: {}` 제네릭). 목록에서는 `recordId`만 신뢰하고 나머지는 `GET /api/records/{recordId}`(문서화된 상세)로 재조회하는 N+1 방식(`fetchRecordDetails`, `records/api.ts`)으로 우회 중. 목록 응답이 확정되면 최적화할 것.
- **`mine=false`(둘러보기)가 본인의 공개 기록도 포함하는지 미검증**. mock 시절 의도(전체공개 내 기록이 둘러보기에도 보임)를 그대로 따른다고 가정 — 서버가 실제로 그렇게 동작하는지 확인 필요.
- **북마크는 여전히 API가 없어서 로컬(React Query 캐시) 전용** — 새로고침하면 사라짐.
- 위 리스크들은 실제로 로그인해서 기록 생성·조회·수정을 눌러보고 네트워크 탭으로 확인해야 최종 확정됨.

## 참고

- `docs/NETWORK_REVIEW.md` — 인증/axios 클라이언트 세팅 현황 (같은 스타일의 점검 문서)
- `POST /api/trips`(여행 시작)·`POST /api/trips/{id}/visits`(경유지 방문 인증, `waypointId`+`latitude`+`longitude`)·`POST /api/trips/{id}/waypoints/{waypointId}/skip`(GPS 없이 경유지 건너뛰기, 신규)·`POST /api/trips/{id}/complete`(여행 완료)·`GET /api/trips/current`(진행 중인 내 여행 조회, 신규) API가 스웨거에 있음 — 아직 프론트 연동 없음(콘솔 스크립트로만 테스트 중). 이게 없으면 어떤 계획도 서버상 COMPLETED가 될 수 없어서, 기록 작성 STEP01의 "완료된 여행 선택" 목록(`GET /api/plans?status=COMPLETED`)이 실제로는 비어있을 수 있음. 별도 기능으로 논의 중.
- **`GET /api/places/{id}` 버그(회귀 의심)**: 로그인한 사용자로 호출하면 id와 무관하게 항상 `400 COMMON400_1`. 로그인 없이는 401이 정상적으로 나서 라우팅은 문제없음. 예전(계획 8번 완료 처리할 때)엔 됐었는데 지금은 안 됨 — 백엔드에 보고함, 미해결.
