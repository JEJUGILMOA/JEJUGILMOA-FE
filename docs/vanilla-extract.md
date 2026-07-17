# Vanilla Extract 가이드

## 설정 평가

### 총평: **양호 (프로덕션 사용 가능)**

Vite + Vanilla Extract 기본 구성은 올바르게 잡혀 있고, 디자인 토큰(`colors` / `vars` / `typography`)과 컴포넌트 스타일 패턴도 일관됩니다. TypeScript 빌드(`tsc -b`)도 통과합니다.

### 잘 된 점

| 항목 | 상태 | 설명 |
|------|------|------|
| Vite 플러그인 | ✅ | `vite.config.ts`에 `vanillaExtractPlugin()` 등록 |
| 패키지 | ✅ | `@vanilla-extract/css`, `recipes`, `sprinkles`, `vite-plugin` 설치 |
| 엔트리 로드 | ✅ | `main.tsx` → `@/styles` → fonts / reset / global |
| 디자인 토큰 | ✅ | `colors` · `vars` · `typography` 분리, 역할이 명확 |
| 컴포넌트 패턴 | ✅ | `Component.css.ts` + `style` / `recipe` 사용 (예: Button) |
| 폰트 | ✅ | `globalFontFace` + `public/fonts/PretendardVariable.ttf` |
| 경로 별칭 | ✅ | `@/` → `src/` |

### 보완하면 좋은 점

| 항목 | 상태 | 설명 |
|------|------|------|
| `typography` 미사용 | ⚠️ | 정의만 있고 화면/컴포넌트에서 거의 안 씀 |
| `sprinkles` 미사용 | ⚠️ | 정의만 있고 import/사용처 없음 |
| TTF 용량 | ⚠️ | ~6.7MB. 가능하면 `woff2`로 교체 권장 |
| 테마 전환 | ℹ️ | `createGlobalTheme(':root')`만 사용 → 다크모드 없음 (현재는 OK) |

---

## 폴더 구조

```
src/styles/
  index.ts          # fonts / reset / global 로드 + export
  fonts.css.ts      # @font-face
  reset.css.ts      # 리셋
  global.css.ts     # body, heading 등 전역
  colors.css.ts     # 색상 CSS 변수
  vars.css.ts       # spacing, radius, fontSize 등
  typography.css.ts # 텍스트 스타일 프리셋
  sprinkles.css.ts  # 유틸리티 클래스 (선택)

components/ui/Button/
  Button.tsx
  Button.css.ts     # 컴포넌트 전용 스타일
```

---

## 기본 규칙

1. **스타일은 `*.css.ts`에만 작성** — TSX 안에 인라인 스타일/CSS 문자열 지양
2. **색상은 `colors`, 간격·크기 등은 `vars` 사용**
3. **텍스트 스타일은 `typography` 프리셋 우선**
4. **variant가 필요하면 `recipe`**, 단순하면 `style`

---

## 사용 방법

### 1. 색상 (`colors`)

```ts
import { colors } from '@/styles/colors.css.ts'

colors.primary[500]   // #24B95C
colors.text[1]        // 본문
colors.border[1]      // 보더
colors.surface[1]     // 카드 배경
colors.error[500]     // 에러
```

| 스케일 | 키 |
|--------|-----|
| primary / secondary | 100 ~ 900 |
| success / warning | 300, 500, 700 |
| info / error | 100, 300, 500, 700 |
| surface | 1 ~ 5 |
| background | 1, 2 |
| text | 1 ~ 6 |
| border | 1 |

### 2. 레이아웃 토큰 (`vars`)

```ts
import { vars } from '@/styles/vars.css.ts'

vars.space[4]           // 16px
vars.radius.md          // 10px
vars.fontSize.sm        // 14px
vars.fontWeight.semibold
vars.shadow.sm
vars.zIndex.modal
vars.size.touch         // 44px
vars.duration.fast
vars.overlay
```

### 3. 타이포그래피 (`typography`)

```tsx
import * as typography from '@/styles/typography.css.ts'
// 또는
import { heading1, bodyMedium } from '@/styles/typography.css.ts'

<h1 className={typography.heading1}>제목</h1>
<p className={typography.bodyMedium}>본문</p>
```

| export | Figma |
|--------|--------|
| `displayLarge` ~ `displaySmall` | Display |
| `heading1` ~ `heading3` | Heading |
| `titleLarge` ~ `titleSmall` | Title |
| `bodyLarge` ~ `bodySmall` | Body |
| `labelLarge` ~ `labelSmall` | Label |
| `captionBase`, `captionSm` | Caption |

### 4. 단순 스타일 (`style`)

```ts
// Card.css.ts
import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const cardStyle = style({
  padding: vars.space[4],
  borderRadius: vars.radius.lg,
  backgroundColor: colors.surface[1],
  border: `1px solid ${colors.border[1]}`,
})
```

```tsx
// Card.tsx
import { cardStyle } from './Card.css.ts'

export function Card({ children }: { children: React.ReactNode }) {
  return <div className={cardStyle}>{children}</div>
}
```

### 5. Variant (`recipe`)

```ts
// Button.css.ts
import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const buttonRecipe = recipe({
  base: {
    borderRadius: vars.radius.md,
    fontWeight: vars.fontWeight.semibold,
  },
  variants: {
    variant: {
      primary: {
        backgroundColor: colors.primary[500],
        color: colors.text[5],
      },
      ghost: {
        backgroundColor: 'transparent',
        color: colors.text[1],
        border: `1px solid ${colors.border[1]}`,
      },
    },
    size: {
      sm: { fontSize: vars.fontSize.sm },
      md: { fontSize: vars.fontSize.md },
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})
```

```tsx
<button className={buttonRecipe({ variant: 'primary', size: 'md' })}>
  확인
</button>
```

### 6. Sprinkles (유틸, 선택)

한두 개 레이아웃 속성만 줄 때:

```tsx
import { sprinkles } from '@/styles/sprinkles.css.ts'

<div
  className={sprinkles({
    display: 'flex',
    gap: 3,
    padding: 4,
    background: 'surface',
    color: 'text',
  })}
/>
```

복잡한 UI는 `style` / `recipe`를 쓰고, sprinkles는 보조로 쓰는 것을 권장합니다.

### 7. className 합치기

```tsx
import { cn } from '@/utils/cn'
import { cardStyle } from './Card.css.ts'
import { titleMedium } from '@/styles/typography.css.ts'

<div className={cn(cardStyle, titleMedium, className)} />
```

---

## 새 컴포넌트 체크리스트

1. `MyComponent.css.ts` 생성
2. `colors` / `vars` / `typography` import
3. `style` 또는 `recipe`로 클래스 export
4. `MyComponent.tsx`에서 `className`에 연결
5. (선택) `sprinkles`로 일회성 레이아웃 보완

---

## 자주 하는 실수

| 금지 | 올바른 방법 |
|------|-------------|
| `.css.ts`에서 런타임 값 계산 후 스타일 분기 | `recipe` variants 사용 |
| 하드코딩 hex (`#24B95C`) | `colors.primary[500]` |
| TSX에 `style={{ color: '...' }}` | `.css.ts`의 `style()` |
| `*.css.ts`를 빼고 일반 `.ts`에 `style()` 작성 | 반드시 `*.css.ts` |

---

## 참고 파일

- 토큰: `src/styles/colors.css.ts`, `vars.css.ts`, `typography.css.ts`
- 예시: `src/components/ui/Button/Button.css.ts`
- Vite: `vite.config.ts` → `vanillaExtractPlugin()`
