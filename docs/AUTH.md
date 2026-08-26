# API · 소셜 로그인 (웹)

- axios: `src/api/axios.ts` (`withCredentials`)
- 헬퍼: `src/api/http.ts`
- 인증 API: `src/features/auth/api.ts`
- OAuth: `src/features/auth/oauth.ts` → `/login`, `/oauth/:provider/callback`
- 로컬: `pnpm dev` (port **3000**), `VITE_API_BASE_URL=/api`, `VITE_DEV_AUTH=false`
- `.env`에 `VITE_KAKAO_REST_API_KEY` / `VITE_NAVER_CLIENT_ID` / `VITE_GOOGLE_WEB_CLIENT_ID`

정책 상세는 앱 저장소 `docs/AUTH.md`.
