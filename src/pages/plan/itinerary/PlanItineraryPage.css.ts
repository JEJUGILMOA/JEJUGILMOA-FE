import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/colors.css.ts'
import { vars } from '@/styles/vars.css.ts'

/** 시안: 밑줄 탭 + 우측 N/10곳 카운터 */
export const tabHeaderStyle = style({
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  gap: vars.space[3],
  borderBottom: `1px solid ${colors.border[1]}`,
})

export const tabListStyle = style({
  display: 'flex',
  alignItems: 'stretch',
  gap: vars.space[4],
  minWidth: 0,
})

export const tabButtonRecipe = recipe({
  base: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '40px',
    padding: `0 ${vars.space[1]}`,
    border: 'none',
    background: 'transparent',
    fontSize: vars.fontSize.md,
    fontWeight: vars.fontWeight.semibold,
    color: colors.text[4],
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  variants: {
    active: {
      true: {
        color: colors.text[1],
        fontWeight: vars.fontWeight.bold,
        selectors: {
          '&::after': {
            content: '""',
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: '-1px',
            height: '2px',
            borderRadius: vars.radius.full,
            backgroundColor: colors.primary[600],
          },
        },
      },
      false: {},
    },
  },
  defaultVariants: {
    active: false,
  },
})

export const placeCountStyle = style({
  flexShrink: 0,
  paddingBottom: vars.space[3],
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.semibold,
  color: colors.text[4],
})

/** @deprecated pill 탭 잔여 — tabHeaderStyle로 대체 */
export const tabRowStyle = style({
  display: 'flex',
  gap: vars.space[1],
  padding: vars.space[1],
  borderRadius: vars.radius.full,
  backgroundColor: colors.surface[4],
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
  right: '64px',
  zIndex: vars.zIndex.toast,
  filter: 'drop-shadow(0 2px 10px rgba(0, 0, 0, 0.12))',
})

export const sheetFooterHintStyle = style({
  textAlign: 'center',
  fontSize: vars.fontSize.xs,
  color: colors.text[4],
  lineHeight: 1.4,
})

/** 장소 추가 탭 안 검색창 (지도 float 아님) */
export const sheetSearchBarStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
  height: '44px',
  padding: `0 ${vars.space[3]}`,
  borderRadius: vars.radius.lg,
  backgroundColor: colors.surface[4],
})

export const sheetSearchBarActiveStyle = style({
  border: `1.5px solid ${colors.secondary[500]}`,
  boxShadow: `0 0 0 3px ${colors.secondary[100]}`,
  backgroundColor: colors.surface[1],
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
  gap: vars.space[3],
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

export const inlineHintTextStyle = style({
  textAlign: 'center',
  fontSize: vars.fontSize.sm,
  color: colors.text[4],
})

export const mustVisitSummaryRowStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space[2],
  padding: `${vars.space[2]} ${vars.space[3]}`,
  borderRadius: vars.radius.md,
  backgroundColor: '#FFF8E8',
})

export const mustVisitSummaryTextStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[1],
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.semibold,
  color: '#8A5A00',
})

export const mustVisitSummaryCountStyle = style({
  flexShrink: 0,
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.bold,
  color: '#8A5A00',
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

/** 시안: 출발지 카드 (베이지 배경) */
export const departureCardStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[3],
  width: '100%',
  padding: vars.space[3],
  border: 'none',
  borderRadius: vars.radius.lg,
  backgroundColor: '#F7F1E8',
  font: 'inherit',
  textAlign: 'left',
  cursor: 'pointer',
})

export const departureCardIconStyle = style({
  flexShrink: 0,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: colors.primary[600],
})

export const departureCardTextStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  minWidth: 0,
  flex: 1,
})

export const departureCardTitleStyle = style({
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.bold,
  color: colors.text[1],
})

export const departureCardMetaStyle = style({
  fontSize: vars.fontSize.xs,
  color: colors.text[4],
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const departureCardActionStyle = style({
  flexShrink: 0,
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.semibold,
  color: colors.primary[600],
  whiteSpace: 'nowrap',
})

/** 시안: 추천 코스 / 장소 직접 추가 액션 행 */
export const emptyActionListStyle = style({
  display: 'flex',
  flexDirection: 'column',
})

export const emptyActionRowStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[3],
  width: '100%',
  padding: `${vars.space[4]} 0`,
  border: 'none',
  borderBottom: `1px solid ${colors.border[1]}`,
  background: 'none',
  font: 'inherit',
  textAlign: 'left',
  cursor: 'pointer',
  selectors: {
    '&:last-child': { borderBottom: 'none' },
  },
})

export const emptyActionIconWrapStyle = style({
  flexShrink: 0,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
  borderRadius: vars.radius.full,
  backgroundColor: colors.primary[100],
  color: colors.primary[600],
})

export const emptyActionIconMutedStyle = style({
  backgroundColor: colors.surface[4],
  color: colors.text[3],
})

export const emptyActionTextStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  minWidth: 0,
  flex: 1,
})

export const emptyActionTitleStyle = style({
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.bold,
  color: colors.text[1],
})

export const emptyActionMetaStyle = style({
  fontSize: vars.fontSize.xs,
  color: colors.text[4],
})

export const emptyActionChevronStyle = style({
  flexShrink: 0,
  color: colors.text[6],
})

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
