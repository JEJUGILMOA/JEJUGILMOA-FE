# 네트워크 세팅 점검 (feat/#16)

기준: `feat/#16` 브랜치, 커밋 `08d886a` (`[Feat] 웹 소셜 로그인·API 클라이언트 및 마이 프로필 연동`).
워킹 디렉토리 clean 상태에서 확인 — 커밋된 코드 기준.

## 구성

- `src/api/axios.ts` — `apiClient` (baseURL, timeout, `withCredentials`)
- `src/api/http.ts` — `apiGet/apiPost/apiPut/apiPatch/apiDelete` 공통 래퍼
- `src/api/unwrap.ts` (+ `unwrap.test.ts`) — 스웨거 공통 응답 `{isSuccess, code, message, result}`에서 `result`만 추출
- `src/api/types.ts` — `ApiEnvelope`, OAuth/유저 프로필 타입
- `src/features/auth/` — `api.ts`(로그인·재발급·로그아웃·내 프로필), `oauth.ts`(+테스트), `session.ts`
- `src/pages/login/` — 로그인 페이지, OAuth 콜백 페이지, 소셜 로그인 버튼

## 잘 된 부분

- 응답 envelope 언래핑이 인터셉터(에러 케이스)와 `unwrap.ts`(성공 케이스)로 분리되어 있음
- `withCredentials: true` — 쿠키 세션 기반으로 전환, Bearer는 보조 수단
- 401 처리에서 `/auth/oauth/`, `/auth/reissue`, `/auth/logout` 등 인증 관련 호출은 예외 처리 — 로그인 시도 중 강제 로그아웃되는 문제 방지
- OAuth 로그인 플로우에 테스트(`oauth.test.ts`) 포함

## 아직 안 된 부분

- `reissueAuth()`(`/auth/reissue`)는 정의만 되어 있고, axios 응답 인터셉터에서 401 시 **자동으로 재발급을 시도하고 원 요청을 재시도하는 로직은 없음**. 지금은 401 → 즉시 로그아웃.

### `/api/auth/reissue` 스펙 (Swagger 확인)

- `POST`, request body 없음. refresh token은 쿠키로 서버가 검증 (`withCredentials: true`라 자동으로 실림)
- 200: `ApiResponseVoid`(`isSuccess: true`) + 새 access/refresh 토큰을 쿠키로 재발급 — 프론트가 토큰을 직접 다룰 필요 없음
- 401: refresh token 없음/무효/재사용 감지. 코드 `AUTH401_4`, 메시지 "이미 사용되었거나 탈취 의심되는 리프레시 토큰입니다. 다시 로그인해주세요." → 이 경우는 진짜 재로그인 필요

## 체크리스트 대비 현황

| 단계 | 상태 | 비고 |
|---|---|---|
| 1. HTTP 클라이언트 인스턴스 | ✅ | `axios.ts` |
| 2. 환경변수로 서버 주소 분리 | ✅ | `VITE_API_BASE_URL=/api` + vite proxy(쿠키·CORS 유리), `VITE_DEV_AUTH`로 mock/실제 로그인 스위치 |
| 3. 요청 인터셉터(토큰 부착) | ✅ | |
| 4. 응답 인터셉터(에러 공통 처리) | ✅ | envelope(`isSuccess`) 인식 + 인증 호출 401 예외 처리 |
| 5. 커스텀 에러 타입 | ✅ | `ApiError` |
| 6. 토큰 재발급(refresh) 로직 | ❌ | `reissueAuth()` 정의는 있으나 인터셉터 자동 재시도 미연결 |
| 7. react-query 세팅 | ✅ | |
| 8. 쿼리 키 관리 | ✅ | `QUERY_KEYS.myProfile` 추가 |
| 9. 도메인별 API 함수 | ⚠️ 부분 | `auth`/`places`는 실제 API, `plans`/`records`는 여전히 mock |
| 10. 도메인별 hooks | ✅ | `useMyProfileQuery`가 프로필 조회 후 `authStore` 동기화 |
| 11. 테스트용 API 모킹(msw) | ⚠️ 정체 | `src/test/mocks/handlers.ts`에 `/places`만 있고 `/auth/*`, `/users/me` 핸들러 없음 |

**남은 구멍은 6번(refresh 자동 재시도)뿐** — 나머지는 ✅ 또는 부분 진행 상태.

## 참고

- 인증 흐름 상세: [`docs/AUTH.md`](./AUTH.md)

## 추가해야 할 로직

1. **401 → reissue 자동 재시도** (`src/api/axios.ts` 응답 인터셉터)
   - 비인증 요청이 401을 받으면 `reissueAuth()` 호출 → 성공(200) 시 원래 요청을 그대로 재시도
   - 동시에 여러 요청이 401을 받는 경우 `reissueAuth()`가 중복 호출되지 않도록 진행 중인 재발급 Promise를 공유(큐잉)
2. **reissue 자체 실패 처리**
   - `reissueAuth()`가 401(`AUTH401_4` 등)이면 `authStore.clearAuth()` 호출 + 로그인 페이지로 리다이렉트
3. **`plans`/`records` 도메인 mock → 실제 API 전환**
   - `src/features/plans/api.ts`, `src/features/records/api.ts`의 TODO 주석 자리에 `http.ts`의 `apiGet/apiPost/...`로 교체 (백엔드 엔드포인트 준비 시)
4. **msw 핸들러 보강**
   - `src/test/mocks/handlers.ts`에 `/auth/*`, `/users/me` 핸들러 추가 (현재 `/places`만 있음)
