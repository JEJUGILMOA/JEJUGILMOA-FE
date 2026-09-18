# Apple App Store 심사 리스크 체크리스트

> **작성 기준**: [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/) (공개 문서) + JEJUGILMOA FE/APP **코드 점검**  
> **작성일**: 2026-09-19  
> **대상**: `JEJUGILMOA-FE` · `JEJUGILMOA-APP` 하이브리드 앱

## 이 문서의 한계 (중요)

Apple 심사는 **가이드라인 + 심사원의 판단**이라, 아래는 “떨어질 만한 리스크” 점검이지 **통과 보증이 아닙니다.**

| 검증 가능 | 코드만으로 검증 불가 |
|-----------|----------------------|
| 로그인/탈퇴/신고 UI·API 호출 | App Store Connect 개인정보 설문(Nutrition Label) 답변 |
| 스푸프·mock·테스트 라우트 존재 | 연령 등급·카테고리(Kids 여부) 메타데이터 |
| Info.plist usage 문자열(앱 설정) | 약관/개인정보 페이지 **실게시·법무 적합성** |
| WebView/권한/UGC 흐름 | 심사 계정·백엔드 가동 상태, 데모 데이터 |

공식 기준이 모호하거나 버전별로 바뀌는 부분은 문서에 **「심사 재량」**으로 표시했습니다.  
최신 원문: [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/) · [계정 삭제 가이드](https://developer.apple.com/support/offering-account-deletion-in-your-app)

---

## 우선순위 요약

| 우선순위 | 항목 | Guideline | 코드상 상태 |
|----------|------|-----------|-------------|
| **P0** | 방문 인증 스푸프(설정 위치 7탭) | 2.1 | 스토어 빌드에서도 동작 가능 |
| **P1** | mock 공지 / mock 여행상세 / `/test/*` | 2.1 | 프로드 라우트에 존재 |
| **P1** | WebView `tel:` / `_blank` 링크 무반응 | 2.1 | FE 장소 상세 등 |
| **P1** | WebView 래퍼로 보이는 인상 | 4.2 | 다수 탭이 WebView |
| **P2** | 설정「위치/알림」토글과 OS 권한 불일치 | 5.1.1 | 서버 플래그만 패치 가능 |
| **P2** | 프로덕션 API/웹 URL 확인 | 2.1 | `EXPO_PUBLIC_*` 빌드 의존 |
| **OK** | Sign in with Apple | 4.8 | iOS 네이티브 제공 |
| **OK** | 인앱 회원 탈퇴 | 5.1.1(v) | 설정에 있음 |
| **OK** | UGC 신고·차단 | 1.2 | 기록 상세에 있음 |
| **해당 없음** | IAP / 디지털 결제 | 3.1.1 | 결제 코드 미발견 |

---

## 1. 로그인 · 계정 (Guideline 4.8 / 5.1.1)

### 1.1 Sign in with Apple — 대체로 OK

- **기준**: Kakao/Google/Naver 등 **타사 소셜로 주 계정을 만들면**, 동등한 옵션으로 [Sign in with Apple](https://developer.apple.com/app-store/review/guidelines/#login-services)(또는 가이드에 맞는 대체 로그인) 필요.
- **코드**: `LoginPage.tsx`에서 카카오·네이버·구글 + **네이티브일 때 Apple** 버튼. APP `usesAppleSignIn` / `expo-apple-authentication`.
- **리스크**: Low. 웹 브라우저만으로 쓰는 로그인 페이지에는 Apple이 없지만, **iOS 앱 심사 대상은 네이티브 WebView**라 보통 문제 없음.
- **권장**: Apple 버튼은 `inNative && iOS`로 한정해 Android에 안 보이게 정리. 심사 노트에 “로그인: Apple / Kakao / …” 경로 명시.

### 1.2 계정 삭제 — OK (경로 유지 필수)

- **기준**: 계정 생성이 있으면 **앱 안에서** 삭제 시작 가능해야 함. 비활성화만으로는 부족. ([공식 FAQ](https://developer.apple.com/support/offering-account-deletion-in-your-app))
- **코드**: 설정 → 「회원 탈퇴」→ `DELETE /users/me`.
- **추가 확인(백엔드)**: Sign in with Apple 사용자 탈퇴 시 **Apple token revoke** (`/auth/revoke`) 여부 — FE만으로는 확인 불가. [TN3194](https://developer.apple.com/documentation/technotes/tn3194-handling-account-deletions-and-revoking-tokens-for-sign-in-with-apple) 참고.
- **권장**: 심사 노트에 `마이 → 설정 → 회원 탈퇴` 경로 적기.

### 1.3 강제 로그인 벽 — 양호

- **기준**: 계정 기능이 핵심이 아니면 로그인 없이 쓸 수 있게 하는 편이 안전(5.1.1(v) 취지).
- **코드**: 홈·지도·기록「둘러보기」는 게스트 가능. 계획 생성·즐겨찾기·신고 등만 `requireLogin`.
- **리스크**: Low.

---

## 2. 완성도 · 데모/개발 잔존 (Guideline 2.1)

### 2.1 [P0] 방문 인증 시뮬레이션(스푸프)

- **증거**: `SettingsPage.tsx` — 「위치」라벨 **7회 탭** → `TOGGLE_TRIP_VISIT_SPOOF`. APP `tripVisitSpoof.ts`에 **`__DEV__` 가드 없음**. 토스트에 「개발자 옵션」문구.
- **왜 위험한가**: 심사원/사용자가 위치 위조·미완성 개발 메뉴로 인식 → **Incomplete / Misleading** 소지.
- **조치**: 스토어(production) 빌드에서 **UI·브릿지·스토리지 전부 제거**, 또는 `__DEV__` / 내부 빌드 프로파일만 허용.

### 2.2 [P1] Mock · 테스트 화면

| 경로 | 내용 |
|------|------|
| `/my/notices`, `/my/notices/:id` | `mockNotices`만 사용 |
| `/my/trips/:tripId` (`TripDetailPage`) | `mockTrips` + 하드코딩 |
| `/test/jinsung`, `/test/suji` | 테스트 페이지 라우트 |

- **조치**: 프로덕션 번들에서 라우트 제거 또는 메뉴/딥링크 비노출. 공지는 API 연동 또는 진입점 삭제.

### 2.3 [P2] 개발 API / DEV UI

- `LoginPage` 「개발 로그인」, `MyPageApiLogPanel` → `import.meta.env.DEV` 한정이면 스토어 웹 번들에서는 보통 제외됨.
- APP `config` 기본값이 **dev API**일 수 있음 → **EAS production 환경변수**가 운영 URL인지 제출 전 반드시 확인.

### 2.4 심사 계정 (메타 — 코드 외)

- **기준**: 계정 기반 기능이 있으면 **데모 계정 또는 데모 모드**를 Review Information에 제공.
- **권장**: 카카오 없이 쓸 수 있는 테스트 계정, 또는 Apple 로그인 가능 계정 + 백엔드 가동.

---

## 3. 최소 기능 · WebView 하이브리드 (Guideline 4.2)

- **기준**: “웹사이트만 감싼 앱”은 거절될 수 있음. **네이티브 가치**가 보여야 함.
- **코드 현실**: 홈/계획/기록/마이 = WebView, 지도·일정 맵·방문 인증·SIWA = 네이티브.
- **리스크**: Med (심사 재량 큼).
- **권장 심사 노트 포인트**:
  1. 네이버맵 기반 네이티브 지도·카테고리·장소 시트  
  2. 여행 중 방문 인증(위치)  
  3. Sign in with Apple  
  4. 웹은 콘텐츠/기록 UI, 핵심 지도 경험은 네이티브  

---

## 4. 개인정보 · 권한 (Guideline 5.1.x)

### 4.1 Usage Description — 대체로 OK

- `app.config.ts`: 위치(When In Use), 카메라, 사진 — 목적 문구 있음. Always 위치는 의도적 미사용.
- ATT / `NSUserTrackingUsageDescription` — 코드상 추적 SDK 미발견 → ATT 불필요해 보임. **Connect 설문과 일치**시킬 것.

### 4.2 [P2] 설정 토글 UX

- 「위치 권한」「알림」이 **OS 설정이 아니라 서버 플래그**만 바꿀 수 있으면, 심사원에게 “권한 요청이 이상하다”는 인상.
- 푸시(`expo-notifications` 등) 미구현이면 알림 토글 제거 또는 “준비 중” 숨김.

### 4.3 약관 · 개인정보 링크

- `https://www.gilmoa.site/privacy-policy`, `/terms`, `/support` — 앱에서 외부 오픈.
- **제출 전**: 실제 200 OK, 빈 페이지/플레이스홀더 아닌지 브라우저 확인 (플레이스홀더 URL은 2.1/5.1.1 거절 사유).

---

## 5. UGC · 안전 (Guideline 1.2)

- 여행 기록 등 UGC → **신고·차단** UI/API 있음 (`ReportRecordModal`, `BlocksPage`).
- **리스크**: Low. 백엔드가 실제로 처리하는지·약관에 정책이 있는지는 별도 확인.

---

## 6. 결제 (Guideline 3.1.1)

- 인앱 결제 / StoreKit / 외부 디지털 결제 플로우 **코드에서 미발견**.
- 관광지 「유료」는 입장료 성격 라벨로 보임 → 디지털 재화 판매가 아니면 보통 해당 없음.
- 이후 구독·코인 등 추가 시 **IAP 필수** 검토.

---

## 7. WebView · 링크 · 크래시성 UX (Guideline 2.1 / 2.5)

### 7.1 [P1] `tel:` / 새 창

- WebView가 `http(s)`/`about`만 허용하면 FE 장소 상세의 `tel:`이 **무반응**.
- `target="_blank"` 홈페이지도 `setSupportMultipleWindows={false}`면 실패 가능.
- 네이티브 지도 시트는 `Linking.openURL`로 전화 가능 → **경로별 UX 불일치**.
- **조치**: `tel:`/`mailto:`/외부 URL은 `OPEN_EXTERNAL_URL` / `Linking`으로 통일. 도메인 allowlist 검토.

### 7.2 `originWhitelist={['*']}`

- WebView 안에서 임의 https 탐색 가능 → “브라우저 앱” 인상(4.2) 또는 보안 이슈.
- **권장**: 자사 웹 오리진 + OAuth 도메인 중심으로 제한, 나머지는 시스템 브라우저.

---

## 8. 메타데이터 (Connect — 코드 외)

| 항목 | 권장 |
|------|------|
| 연령 등급 | 위치·UGC 앱에 맞게 (Kids 카테고리 비권장) |
| Privacy Nutrition Label | 실제 수집(계정, 위치, 사진, 식별자)과 일치 |
| 스크린샷/설명 | 플레이스홀더·다른 앱 UI 금지 |
| Review Notes | 데모 계정, 탈퇴 경로, 네이티브 지도 가치, (제거 후) 스푸프 없음 |

---

## 제출 전 체크리스트 (실무)

- [ ] 방문 인증 스푸프 **프로덕션에서 제거** 확인
- [ ] mock 공지·TripDetail·`/test/*` 비노출
- [ ] production `EXPO_PUBLIC_WEB_BASE_URL` / API가 **운영**
- [ ] Apple / 카카오 등 **심사 데모 계정** Review Information 기입
- [ ] 약관·개인정보·고객센터 URL 실서비스
- [ ] 전화·외부 지도·홈페이지 링크 탭 동작(앱 실기기)
- [ ] 회원 탈퇴 E2E (특히 Apple 로그인 유저 + 서버 revoke)
- [ ] App Privacy 설문 ↔ 실제 수집 일치
- [ ] 심사 노트에 네이티브 기능·로그인·탈퇴 경로 명시

---

## 참고 링크

- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Offering account deletion in your app](https://developer.apple.com/support/offering-account-deletion-in-your-app)
- [TN3194 — Account deletion & Sign in with Apple token revoke](https://developer.apple.com/documentation/technotes/tn3194-handling-account-deletions-and-revoking-tokens-for-sign-in-with-apple)

---

## 부록: 코드 증거 (빠른 참조)

| 주제 | 위치 |
|------|------|
| Apple / 소셜 로그인 | `FE/src/pages/login/LoginPage.tsx`, `APP/src/auth/appleAuth.ts` |
| 회원 탈퇴 | `FE/src/pages/mypage/settings/SettingsPage.tsx`, `FE/src/features/auth/api.ts` |
| 방문 스푸프 | `SettingsPage.tsx` (`DEV_UNLOCK_TAPS`), `APP/src/utils/tripVisitSpoof.ts` |
| Mock 공지/여행 | `FE/src/pages/mypage/notices/*`, `trip-detail/TripDetailPage.tsx` |
| 테스트 라우트 | `FE/src/app/router.tsx` (`/test/jinsung`, `/test/suji`) |
| 권한 문구 | `APP/app.config.ts` |
| UGC 신고/차단 | `ReportRecordModal`, `BlocksPage`, `RecordDetailPage` |
| WebView 로드 가드 | `APP/src/screens/WebViewScreen.tsx` (`onShouldStartLoadWithRequest`) |
