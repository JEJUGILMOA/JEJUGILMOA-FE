import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

export const tabRowStyle = style({
  display: 'flex',
  gap: vars.space[1],
  padding: vars.space[1],
  borderRadius: vars.radius.full,
  backgroundColor: colors.surface[4],
})

export const tabButtonRecipe = recipe({
  base: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '36px',
    border: 'none',
    borderRadius: vars.radius.full,
    background: 'transparent',
    fontSize: vars.fontSize.sm,
    fontWeight: vars.fontWeight.semibold,
    color: colors.text[4],
    cursor: 'pointer',
  },
  variants: {
    active: {
      true: {
        backgroundColor: colors.surface[1],
        color: colors.text[1],
        boxShadow: vars.shadow.sm,
      },
      false: {},
    },
  },
  defaultVariants: {
    active: false,
  },
})

export const pageRootStyle = style({
  position: 'relative',
  height: '100%',
  minHeight: '100%',
  overflow: 'hidden',
})

export const backButtonStyle = style({
  position: 'absolute',
  top: vars.space[3],
  left: vars.space[3],
  zIndex: vars.zIndex.toast,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
  border: 'none',
  borderRadius: vars.radius.full,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  color: colors.text[1],
  boxShadow: vars.shadow.sm,
  cursor: 'pointer',
})

export const nextButtonStyle = style({
  position: 'absolute',
  top: vars.space[4],
  right: vars.space[3],
  zIndex: vars.zIndex.toast,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '37px',
  padding: `0 ${vars.space[4]}`,
  border: 'none',
  borderRadius: vars.radius.full,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  color: colors.primary[600],
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.bold,
  boxShadow: vars.shadow.sm,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
})

export const dayPagerFloatStyle = style({
  position: 'absolute',
  top: vars.space[3],
  left: '64px',
  right: '84px',
  zIndex: vars.zIndex.toast,
  filter: 'drop-shadow(0 2px 10px rgba(0, 0, 0, 0.12))',
})

// 네이버맵처럼 지도 위, 뒤로가기·Day페이저·다음 버튼 줄 바로 아래에 항상 떠 있는 검색창 —
// "일정" 탭을 보고 있어도 탭 전환 없이 바로 검색할 수 있게 한다.
export const headerSearchBarStyle = style({
  position: 'absolute',
  top: '64px',
  left: vars.space[3],
  right: vars.space[3],
  zIndex: vars.zIndex.toast,
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
  height: '40px',
  padding: `0 ${vars.space[4]}`,
  borderRadius: vars.radius.full,
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  boxShadow: vars.shadow.sm,
})

export const headerSearchIconStyle = style({
  flexShrink: 0,
  color: colors.text[4],
})

export const headerSearchInputStyle = style({
  flex: 1,
  minWidth: 0,
  height: '100%',
  border: 'none',
  background: 'transparent',
  fontFamily: vars.fontFamily.sans,
  fontSize: vars.fontSize.sm,
  color: colors.text[1],
  outline: 'none',
  selectors: {
    '&::placeholder': { color: colors.text[4] },
  },
})

export const headerSearchClearButtonStyle = style({
  flexShrink: 0,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '20px',
  height: '20px',
  padding: 0,
  border: 'none',
  borderRadius: vars.radius.full,
  backgroundColor: colors.surface[5],
  color: colors.text[3],
  cursor: 'pointer',
})

// 헤더 검색창이 "출발지 검색 모드"로 전환됐을 때의 강조 테두리 — 필드 포커스 색과 동일한
// secondary 톤을 써서 지금 검색이 평소와 다른 의미(장소 담기 아님)임을 알려준다.
export const headerSearchBarActiveStyle = style({
  border: `1.5px solid ${colors.secondary[500]}`,
  boxShadow: `0 0 0 3px ${colors.secondary[100]}`,
})

export const headerSearchModeLabelStyle = style({
  flexShrink: 0,
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.bold,
  color: colors.secondary[600],
  whiteSpace: 'nowrap',
})

export const headerSearchCancelButtonStyle = style({
  flexShrink: 0,
  border: 'none',
  background: 'transparent',
  padding: 0,
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.semibold,
  color: colors.text[3],
  cursor: 'pointer',
  whiteSpace: 'nowrap',
})

export const sectionStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
})

export const sectionHeaderStyle = style({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
})

export const sectionTitleStyle = style({
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.bold,
  color: colors.text[1],
})

export const sectionMetaStyle = style({
  fontSize: vars.fontSize.xs,
  color: colors.text[4],
})

export const emptyTextStyle = style({
  padding: `${vars.space[4]} 0`,
  textAlign: 'center',
  fontSize: vars.fontSize.sm,
  color: colors.text[4],
})

export const courseRowStyle = style({
  display: 'flex',
  gap: vars.space[2],
})


export const gatewayLabelStyle = style({
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.semibold,
  color: colors.text[2],
})

// 출발지 등, 일정 화면 안에서 탭하면 바로 값을 고칠 수 있는 필드 행.
export const fieldRowStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  padding: vars.space[3],
  border: 'none',
  borderRadius: vars.radius.md,
  backgroundColor: colors.surface[4],
  font: 'inherit',
  textAlign: 'left',
  cursor: 'pointer',
})

export const fieldHintStyle = style({
  flexShrink: 0,
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.semibold,
  color: colors.primary[600],
})

// 출발지 검색 결과 행 — 헤더 검색창을 통해 "추천·검색" 탭에 뜨는, 탭하면 바로
// 출발지로 지정되는 목록. 일반 장소 추천 행(WaypointPlaceRow)과 달리 담기·별표
// 토글이 없는 단순 선택 목록이라 별도 스타일로 둔다.
export const departureResultRowStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space[2],
  width: '100%',
  padding: `${vars.space[3]} ${vars.space[1]}`,
  border: 'none',
  borderBottom: `1px solid ${colors.border[1]}`,
  background: 'none',
  textAlign: 'left',
  cursor: 'pointer',
  selectors: {
    '&:last-child': { borderBottom: 'none' },
  },
})

export const departureResultTextStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
  minWidth: 0,
})

export const departureResultChevronStyle = style({
  flexShrink: 0,
  color: colors.text[6],
})

// 전날 출발지를 그대로 재사용할 수 있게 목록 맨 위에 얹는 추천 행의 배지.
export const departureSuggestionBadgeStyle = style({
  alignSelf: 'flex-start',
  padding: `2px ${vars.space[2]}`,
  borderRadius: vars.radius.full,
  backgroundColor: colors.primary[100],
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.semibold,
  color: colors.primary[700],
})

export const fieldResultTitleStyle = style({
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.bold,
  color: colors.text[1],
})

export const fieldResultMetaStyle = style({
  fontSize: vars.fontSize.xs,
  color: colors.text[4],
})
