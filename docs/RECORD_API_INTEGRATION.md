# 여행 기록(record) 페이지 API 연동 진행 상황 (feat/#20)

기준: `feat/#20` 브랜치, 최신 커밋 `e7c554c`([Feat] #20 기록 이미지 presigned URL 업로드 util 추가) + 워킹 디렉토리에 STEP C~E(기록 생성·목록/상세 조회·반응/북마크·수정·삭제 실 연동) 변경 미커밋 상태로 존재.

## 목표

`src/features/records/api.ts`는 전부 로컬 mock(`myRecords` 인메모리 배열, `mockCompletedTrips`, `mockExploreRecords`)으로 동작 중. 이걸 실제 백엔드(`https://gilmoa-dev.gyeonseo.com`, swagger 확인 가능)로 연동한다. 이미지는 presigned URL 방식(`POST /api/image-uploads`로 S3 업로드 URL 발급 → 프론트가 S3에 직접 PUT → `objectKey`만 기록 API에 전달).

## 확정된 결정 3가지

1. **장소별 사진 vs 서버 1장 제약**: `placeMemos[placeId].photos`는 로컬에서 여러 장 첨부 가능하지만, 스웨거 스펙(`TravelRecordPlaceMemoRequest.imageObjectKey`)은 장소당 사진 1개만 받는다. 백엔드가 배열로 바꿔주기로 했으나 **아직 작업 중(ETA 미정)** — 지금은 단수 스펙 기준으로 구현했고, 장소당 어떤 사진을 보낼지 고르는 로직을 `resolvePlaceImageObjectKey`(`records/api.ts`) 한 곳에 격리해둠. 배열로 바뀌면 이 함수 + `TravelRecordPlaceMemoRequest` 타입만 고치면 됨.
2. **좋아요/싫어요/북마크**: swagger에 대응 API 없음(기록 CRUD + 이미지 업로드만 존재). 이번 스코프에서는 로컬 mock 유지 — 단, STEP D에서 목록/상세가 서버 데이터로 바뀌면 지금처럼 mock 배열을 직접 mutate하는 방식은 깨지므로, React Query 캐시를 `setQueryData`로 직접 토글하는 방식으로 재구현 예정(STEP E).
3. **완료 여행 목록**: `GET /api/plans?status=COMPLETED`로 가져와야 해서 `src/features/plans/api.ts`(record 폴더 밖 기존 파일)를 확장함 — `fetchPlans({status})` 옵션 파라미터 추가.

## 알려진 리스크

- **`GET /api/records` 목록 응답 스키마가 swagger에 여전히 미완성**이다 (`content: {}` 제네릭). 실제 응답을 확인하지 못한 채로, 목록에서는 `recordId`만 신뢰하고(가장 안전한 가정) 나머지 필드는 각 항목을 `GET /api/records/{recordId}`(문서화된 상세)로 다시 조회해서 채우는 방식(N+1)으로 구현함(`fetchRecordDetails`, `records/api.ts`). 기록이 많아지면 비효율적이니, 실제 목록 응답을 확인하게 되면 이 N+1을 없애고 목록 필드를 직접 매핑하도록 최적화할 것.
- **`mine=false`(둘러보기)가 본인의 공개 기록도 포함하는지 미검증**. mock 시절 의도(전체공개 내 기록이 둘러보기에도 보임)를 그대로 따른다고 가정하고 별도 처리 안 함 — 서버가 실제로 그렇게 동작하는지 확인 필요.
- **수정(PATCH) 시 기록 전체 사진(`imageObjectKeys`) 부분 교체가 불가능**: 서버가 기존 사진의 `objectKey`를 안 돌려줘서(응답엔 `imageUrl`만 있음) "기존 몇 장은 유지 + 몇 장만 교체" 를 표현할 방법이 없다. 지금은 안 건드리면 생략(유지), 뭐든 바뀌면 새로 첨부한 File만 업로드해서 전체 교체 — 그 사이 남겨두고 싶던 기존 사진은 유실될 수 있음(`buildRecordImageObjectKeysForUpdate`, `records/api.ts`). 장소별 사진(`places[].image`)은 REPLACE/REMOVE 액션 방식이라 이 문제 없음.
- **`travelCourseId` 네이밍 불일치 가능성**: 기록 생성 요청은 장소를 `travelCourseId`로 받는데, 계획 상세(`PlanWaypointDetail`)엔 `waypointId`만 있다. 같은 값이라 가정하고 `waypointId`를 그대로 보냄 — 첫 실제 생성 요청에서 400이 나면 이 가정부터 의심할 것.
- 위 리스크들 전부 **실제로 로그인해서 기록 생성·조회·수정을 한 번씩 눌러보고 네트워크 탭으로 확인해야 확정**됨 — 아직 실제 서버 응답으로 검증된 적 없음.

## 진행 상황

| STEP | 내용 | 상태 |
|---|---|---|
| A | 완료 여행 목록 (`GET /api/plans?status=COMPLETED`) 실 연동 | ✅ 완료 (`b5c2b75`) |
| B | presigned URL 이미지 업로드 인프라 (`src/features/records/imageUpload.ts`) | ✅ 완료 (`e7c554c`) |
| C | 기록 생성(`createRecord`) 실 연동 | ⚠️ 구현 완료, **미커밋** |
| D | 목록/상세 조회(`fetchMyRecords`/`fetchExploreRecords`) 실 연동 | ⚠️ 구현 완료, **미커밋** |
| E | 좋아요/북마크 로컬 재구현(캐시 토글) + 수정/삭제(`updateRecord`/`deleteRecord`) 실 연동 | ⚠️ 구현 완료, **미커밋** |

D는 E 없이는 반응·수정·삭제가 즉시 깨져서(mock 배열이 영구히 빈 채로 남음) 셋을 한 번에 구현함. `mockCompletedTrips.ts`/`mockExploreRecords.ts`는 더 안 쓰여서 삭제함.

### 다음에 할 일 (사람이 해야 함) — 실제 동작 확인

1. `pnpm dev`로 앱 실행, 로그인
2. 완료된 여행으로 기록 작성 → 사진 첨부 → 저장까지 실제로 눌러보고, 실패하면(특히 `travelCourseId` 400) 콘솔/네트워크 탭 에러 확인
3. "내 기록"/"둘러보기" 목록이 실제로 뜨는지, 좋아요·북마크가 새로고침 전까지 유지되는지
4. 기록 수정(제목/장소 메모/사진/공개범위)·삭제까지 한 번씩 확인
5. 위 "알려진 리스크"에 적힌 가정들이 실제로 맞는지 이 과정에서 자연스럽게 검증됨

## 참고

- `docs/NETWORK_REVIEW.md` — 인증/axios 클라이언트 세팅 현황 (같은 스타일의 점검 문서)
- 기록 생성 이미지 업로드 흐름 원본 가이드는 이 작업을 요청한 사람이 채팅으로 전달(별도 저장 안 함) — 요약: 이미지 선택 → `POST /api/image-uploads`로 presigned URL 발급 → S3에 `PUT` → 성공한 `objectKey`만 모아서 `POST /api/records`에 전달. `uploadUrl` 자체는 기록 생성 API에 보내면 안 됨.
