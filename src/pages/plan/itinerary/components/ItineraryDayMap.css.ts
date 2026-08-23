import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const viewportStyle = style({
  position: 'absolute',
  inset: 0,
  backgroundColor: colors.surface[4],
  overflow: 'hidden',
  touchAction: 'none',
})

export const canvasStyle = style({
  position: 'absolute',
  inset: 0,
  transformOrigin: 'center center',
  cursor: 'grab',
  selectors: {
    '&:active': { cursor: 'grabbing' },
  },
})

export const routeSvgStyle = style({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
})

export const stopPinRecipe = recipe({
  base: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    padding: 0,
    border: 'none',
    borderRadius: '50%',
    backgroundColor: colors.primary[500],
    color: colors.text[5],
    fontSize: vars.fontSize.xs,
    fontWeight: vars.fontWeight.bold,
    cursor: 'default',
  },
})

// "꼭 가고 싶은 장소"로 정한 스톱 핀의 오른쪽 위에 붙는 작은 별 배지 —
// 방문 순서 번호는 그대로 두고, 이 장소가 앵커임을 추가로 표시한다.
export const mustVisitBadgeStyle = style({
  position: 'absolute',
  top: '-4px',
  right: '-4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '13px',
  height: '13px',
  borderRadius: '50%',
  backgroundColor: colors.warning[500],
  color: colors.text[5],
  boxShadow: `0 0 0 2px ${colors.surface[1]}`,
})

// Day 출발지 전용 깃발 핀 — 방문 순서 핀(초록 번호)과는 다르게, 동선의 시작점임을 표시한다.
export const departurePinStyle = style({
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '22px',
  height: '22px',
  borderRadius: '50%',
  backgroundColor: colors.text[2],
  color: colors.text[5],
  boxShadow: `0 0 0 2px ${colors.surface[1]}`,
})

// 유명한 장소(빨강)와 가까운 장소(파랑) 추천을 지도에서도 색으로 구분한다.
// 초록은 이미 확정된 일정 스톱(stopPinRecipe) 색이라, 추천 핀은 둘 다 초록과 겹치지 않는 색으로 뺐다.
export const unassignedPinRecipe = recipe({
  base: {
    position: 'absolute',
    width: '16px',
    height: '16px',
    padding: 0,
    border: 'none',
    borderRadius: '50%',
    opacity: 0.75,
    cursor: 'pointer',
    transition: 'opacity 120ms ease, background-color 120ms ease',
  },
  variants: {
    kind: {
      popular: {
        backgroundColor: colors.error[100],
        selectors: {
          '&:hover': { opacity: 1, backgroundColor: colors.error[300] },
          '&:active': { opacity: 1, backgroundColor: colors.error[500] },
        },
      },
      nearby: {
        backgroundColor: colors.secondary[400],
        selectors: {
          '&:hover': { opacity: 1, backgroundColor: colors.secondary[500] },
          '&:active': { opacity: 1, backgroundColor: colors.secondary[600] },
        },
      },
    },
  },
  defaultVariants: {
    kind: 'popular',
  },
})

export const zoomControlsStyle = style({
  position: 'absolute',
  right: vars.space[3],
  // Day 페이저 플로팅 pill + 그 아래 헤더 검색창 높이만큼 내려서 겹치지 않게 함
  top: '112px',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: vars.radius.sm,
  overflow: 'hidden',
  boxShadow: vars.shadow.sm,
})

export const zoomButtonStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '28px',
  height: '28px',
  border: 'none',
  borderBottom: `1px solid ${colors.border[1]}`,
  backgroundColor: colors.surface[1],
  color: colors.text[2],
  cursor: 'pointer',
  selectors: {
    '&:last-child': { borderBottom: 'none' },
    '&:disabled': { color: colors.text[6], cursor: 'not-allowed' },
  },
})

export const emptyStateStyle = style({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: vars.fontSize.sm,
  color: colors.text[4],
})
