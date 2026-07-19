import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors } from './styles/colors.css.ts' // 실제 colors가 정의된 파일 경로로 맞춰주세요
import * as typography from './typography.css' // 실제 타이포그래피 스타일이 정의된 파일 경로

// 공통 기본 스타일
const baseChip = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid transparent',
  borderRadius: '100px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  userSelect: 'none',
  gap: '6px',
})

export const chipRecipe = recipe({
  base: baseChip,

  variants: {
    // 1. 크기 규격 (SM, MD, LG) 및 타이포그래피 매핑
    size: {
      SM: [
        typography.labelSmall, // 12px, 500, -0.005em
        style({
          height: '28px',
          padding: '0 12px',
        }),
      ],
      MD: [
        typography.labelMedium, // 14px, 500, -0.005em
        style({
          height: '34px',
          padding: '0 16px',
        }),
      ],
      LG: [
        typography.titleMedium, // 16px, 600, -0.025em (LG 글자 크기와 매칭)
        style({
          height: '40px',
          padding: '0 20px',
        }),
      ],
    },

    // 2. 상태별 색상 테마 적용
    variant: {
      // 초록색 활성화 상태 (전체, 내 주변 등)
      selected: {
        backgroundColor: colors.primary[500],
        color: colors.text[5],
        borderColor: colors.primary[500],
      },
      // 기본 테두리가 있는 흰색 배경 (자연, 맛집, 찜한 장소 등)
      outline: {
        backgroundColor: colors.surface[1],
        color: colors.text[2],
        borderColor: colors.border[1],
        selectors: {
          '&:hover': {
            backgroundColor: colors.surface[3],
          },
        },
      },
      // 비활성화 또는 배경이 깔린 연회색 스타일 (우측 끝 맛집, 도보 10분 이내 등)
      filled: {
        backgroundColor: colors.surface[4],
        color: colors.text[3],
        borderColor: colors.surface[4],
      },
    },
  },

  defaultVariants: {
    size: 'MD',
    variant: 'outline',
  },
})

// 내부 아이콘 전용 스타일
export const iconStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
})

// REMOVABLE의 X 삭제 버튼 스타일
export const removeBtnStyle = style({
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  marginLeft: '2px',
  color: colors.text[4],
  transition: 'color 0.2s ease',
  selectors: {
    '&:hover': {
      color: colors.text[2],
    },
  },
})
