# GILMOA-WEB Frontend

제주 여행 장소 탐색 및 여행 계획 서비스 **GILMOA-WEB**의 프론트엔드입니다.

React Native 앱 내부 **WebView**에서 실행되는 React SPA로, 브라우저에서도 개발·검증할 수 있도록 Mock Bridge를 제공합니다.

| 항목 | 내용 |
| --- | --- |
| 패키지 매니저 | **pnpm** (`packageManager`: `pnpm@10.20.0`) |
| 빌드 도구 | Vite 8 |
| 언어 | TypeScript |
| UI | React 19 |
| 라우팅 | React Router 8 (`createBrowserRouter`) |
| 스타일 | vanilla-extract |
| 서버 상태 | TanStack Query |
| 클라이언트 상태 | Zustand Vanilla Store (`createStore`) |
| HTTP | Axios |
| 검증 / 폼 | Zod · React Hook Form |

> npm / yarn 대신 **반드시 pnpm**을 사용하세요.

문서:

- [기술 스택](./docs/TECH_STACK.md)
- [코드 컨벤션](./docs/CODE_CONVENTION.md)
- [Git 컨벤션](./docs/GIT_CONVENTION.md)

---

## 빠른 시작

```bash
# 의존성 설치
pnpm install

# 환경 변수 (최초 1회)
cp .env.example .env   # Windows: copy .env.example .env

# 개발 서버
pnpm dev
```

기본 주소: `http://localhost:5173`

### 환경 변수

| 변수 | 설명 | 예시 |
| --- | --- | --- |
| `VITE_API_BASE_URL` | API Base URL | `http://localhost:3000/api` |
| `VITE_USE_MOCK_BRIDGE` | 브라우저에서 Native Bridge Mock 사용 | `true` |

---

## 스크립트

| 명령 | 설명 |
| --- | --- |
| `pnpm dev` | Vite 개발 서버 |
| `pnpm build` | TypeScript 검사 + 프로덕션 빌드 |
| `pnpm preview` | 빌드 결과 미리보기 |
| `pnpm lint` | ESLint |
| `pnpm format` | Prettier 포맷 적용 |
| `pnpm format:check` | Prettier 검사만 |
| `pnpm test` | Vitest 한 번 실행 |
| `pnpm test:watch` | Vitest watch 모드 |
| `pnpm test:coverage` | 커버리지 리포트 |

---

## 프로젝트 형태

소규모~중소규모를 가정한 **기능 중심 구조**입니다.  
Feature-Sliced Design은 사용하지 않습니다.

```text
src/
├── app/                 # 앱 진입 조립
│   ├── App.tsx
│   ├── router.tsx
│   └── providers.tsx    # QueryClient, ErrorBoundary, Theme, Toaster
├── pages/               # URL 단위 화면 (조합만)
│   ├── home/
│   ├── map/
│   ├── place/
│   ├── plan/
│   ├── record/
│   ├── my/
│   └── test/            # 임시 테스트 페이지
├── features/            # 도메인 기능
│   ├── auth/
│   ├── places/          # api, hooks, schemas, PlaceCard …
│   ├── plans/
│   ├── reviews/
│   └── location/
├── components/
│   ├── ui/              # Button, Card, Empty, Input, Modal …
│   └── layout/          # AppLayout, AppHeader, BottomNavigation
├── api/                 # Axios 인스턴스, 공통 오류, QueryClient
├── bridge/              # RN WebView 메시지 통신
├── stores/              # Zustand Vanilla Store
├── hooks/
├── styles/              # tokens, theme, reset, sprinkles …
├── utils/
├── constants/
├── types/
├── test/                # setup, MSW handlers, renderWithProviders
└── main.tsx
```

### 계층 역할

| 영역 | 역할 |
| --- | --- |
| `pages` | 라우트 화면. API/복잡한 상태 로직을 직접 두지 않고 features·components를 조합 |
| `features` | 실제 기능(검색, 계획, 인증 등). 필요할 때만 `api.ts` / `hooks.ts` / `components/` 분리 |
| `components` | 도메인에 종속되지 않는 공통 UI·레이아웃 |
| `api` | Axios, interceptor, 공통 `ApiError`, QueryClient |
| `bridge` | WebView `postMessage` 통신 (일반 API와 분리) |
| `stores` | 여러 화면이 공유하는 클라이언트 상태만 |

### 의존성 규칙

1. `pages` → features, components, hooks, stores 사용 가능  
2. `features` → 공통 components, api, hooks, stores, utils 사용 가능  
3. 공통 `components`는 특정 feature를 import하지 않음  
4. feature 간 직접 import는 최소화  
5. 서버 데이터는 **TanStack Query**, 공유 클라이언트 상태만 **Zustand**  
6. 순환 참조 금지 · 불필요한 `index.ts` 남발 금지

### 라우트 (현재)

| 경로 | 페이지 |
| --- | --- |
| `/` | 홈 |
| `/map` | 지도 |
| `/place/:placeId` | 장소 상세 |
| `/plan` | 여행 계획 |
| `/record` | 여행 기록 |
| `/my` | 마이 |
| `/test/jinsung`, `/test/suji` | 임시 테스트 |
| `*` | 404 |

하단 탭: 홈 · 지도 · 계획 · 기록 · 마이 (`BottomNavigation`)

---

## 주요 구현 포인트

### 상태 관리

- **Zustand Vanilla Store** (`createStore`) + React에서는 `useStore(store, selector)` 구독
- `appStore`: 초기화, WebView 여부, 네이티브 위치, 선택 장소, 전역 UI
- `authStore`: 토큰·유저·로그인 여부
- 서버 목록/상세 데이터는 store에 넣지 않음

### API

- `apiClient` (Axios) + Authorization interceptor
- 401 시 `authStore.clearAuth()`
- 오류는 `ApiError`로 정규화
- 실제 API 함수는 각 feature의 `api.ts`에 위치

### WebView Bridge

| 방향 | 방법 |
| --- | --- |
| 웹 → 네이티브 | `nativeBridge.postToNative` |
| 네이티브 → 웹 | `useNativeMessage` 구독 |
| 검증 | Zod (`messageSchema.ts`) |
| 브라우저 개발 | Mock Bridge (`VITE_USE_MOCK_BRIDGE`) |
| Android 뒤로가기 | `ANDROID_BACK` → history back / WebView close |

### 스타일

- vanilla-extract (컴포넌트 옆 `*.css.ts`)
- import는 **반드시** `./Foo.css.ts` 형태 (Vite `*.css` 모듈 선언과 충돌 방지)
- 토큰: 색상, spacing, radius, typography, shadow, z-index
- WebView 대응: safe-area, `100dvh`, 하단 내비 여백, 최소 터치 44px, reduced-motion 등

---

## 테스트 방법

이 프로젝트는 **Vitest + React Testing Library + MSW** 조합입니다.

### 실행

```bash
# 전체 테스트 (CI와 동일하게 한 번 실행)
pnpm test

# 파일 저장 시 자동 재실행
pnpm test:watch

# 커버리지
pnpm test:coverage
```

### 설정

| 파일 | 역할 |
| --- | --- |
| `vite.config.ts` → `test` | jsdom, globals, setupFiles |
| `src/test/setup.ts` | jest-dom 매처 + MSW server listen/reset/close |
| `src/test/mocks/handlers.ts` | API 목 핸들러 |
| `src/test/test-utils.tsx` | `renderWithProviders` (QueryClient + MemoryRouter + theme) |

### 현재 대표 테스트

| 파일 | 검증 내용 |
| --- | --- |
| `src/components/ui/Button/Button.test.tsx` | 클릭, 로딩 상태 |
| `src/stores/appStore.test.ts` | Vanilla store 상태 변경 |
| `src/bridge/nativeBridge.test.ts` | Zod 메시지 검증, Mock post |
| `src/features/places/hooks.test.tsx` | MSW + Query hook 렌더 |

### 새 테스트 작성 가이드

1. 파일명은 `*.test.ts` / `*.test.tsx` (대상 파일 옆 또는 같은 폴더)
2. UI 테스트는 `render` 또는 `renderWithProviders` 사용
3. API가 필요하면 MSW `handlers`에 엔드포인트 추가
4. Zustand는 `store.getState()` / `store.setState()`로 직접 검증 가능

```tsx
// 예시: 공통 UI
import { render, screen } from '@testing-library/react'
import { Button } from './Button'

it('renders', () => {
  render(<Button>확인</Button>)
  expect(screen.getByRole('button', { name: '확인' })).toBeInTheDocument()
})
```

```tsx
// 예시: Query + Router가 필요한 경우
import { renderWithProviders } from '@/test/test-utils'

renderWithProviders(<MyComponent />, { route: '/map' })
```

---

## 개발 팁

- 경로 alias: `@/` → `src/`
- 패키지 추가: `pnpm add <pkg>` / 개발 의존성: `pnpm add -D <pkg>`
- 화면 추가 흐름: `pages/...` 컴포넌트 → `constants` ROUTES → `app/router.tsx` 등록
- 도메인 로직은 `features`에, 재사용 UI만 `components/ui`에 두기

---

## 커밋 컨벤션

이 프로젝트는 [Conventional Commits](https://www.conventionalcommits.org/)을 기반으로 한 커밋 규칙을 따릅니다.

### 커밋 메시지 구조

```text
<type>(<scope>): <제목>

<본문 (선택)>
```

### Type

| Type | 설명 |
| --- | --- |
| `feat` | 새로운 기능 추가 |
| `fix` | 버그 수정 |
| `docs` | 문서 수정 (README 등) |
| `style` | 코드 포맷팅, 세미콜론 등 (로직 변경 없음) |
| `refactor` | 기능 변화 없이 코드 구조 개선 |
| `test` | 테스트 추가/수정 |
| `chore` | 빌드, 설정, 패키지 매니저 등 기타 작업 |

### 작성 규칙

- 제목은 **50자 이내**로 간결하게 작성합니다.
- 제목은 마침표로 끝내지 않습니다.
- 하나의 커밋에는 하나의 논리적 변경만 담습니다.
- 본문에는 **"무엇을 했는지"보다 "왜 했는지"**를 적습니다.
- 관련 이슈가 있다면 제목 끝에 이슈 번호를 붙입니다. (예: `(#123)`)

### 예시

```text
feat(auth): 카카오 로그인 연동

fix(cart): 수량 0일 때 상품이 삭제되지 않는 버그 수정

docs: 설치 가이드에 환경 변수 설명 추가 (#42)

refactor: 유저 서비스 로직 분리
```

### 커밋 작성 예시 (pnpm / git)

```bash
# 변경 확인
git status
git diff

# 스테이징 후 커밋
git add .
git commit -m "feat(places): 장소 카드 컴포넌트 추가"
```

본문이 필요하면:

```bash
git commit -m "$(cat <<'EOF'
feat(bridge): Android 뒤로가기 이벤트 처리

WebView에서 시스템 뒤로가기를 웹 히스토리와 맞추기 위함
EOF
)"
```

---

## 라이선스

Private (`package.json` `private: true`)
