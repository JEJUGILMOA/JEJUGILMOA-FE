import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors, typography } from '@/styles'

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
  whiteSpace: 'nowrap',
})

export const chipRecipe = recipe({
  base: baseChip,

  variants: {
    // 1. 크기 규격 (SM, MD, LG) 및 타이포그래피 매핑
    size: {
      SM: [
        typography.labelSmall, // 12px, 500, -0.005em
        style({
          height: '22px',
          padding: '0 12px',
        }),
      ],
      MD: [
        typography.labelMedium, // 14px, 500, -0.005em
        style({
          height: '33px',
          padding: '0 16px',
        }),
      ],
      LG: [
        typography.labelLarge, // 16px, 600, -0.025em (LG 글자 크기와 매칭)
        style({
          height: '40px',
          padding: '0 20px',
        }),
      ],
    },

    // 2. 테마 색상 (초록 계열 vs 회색 계열)
    colorScheme: {
      // Primary (초록 계열)
      primary: {
        backgroundColor: colors.surface[1],
        color: colors.text[2],
        borderColor: colors.border[1],
      },
      primaryLight: {
        backgroundColor: colors.surface[1],
        color: colors.text[2],
        borderColor: colors.border[1],
      },
      // Neutral / Gray (회색 계열 - 맛집 등)
      neutral: {
        backgroundColor: colors.surface[1],
        color: colors.text[2],
        borderColor: colors.border[1],
      },
    },

    // 3. 선택(Selected) 여부
    isSelected: {
      true: {},
      false: {},
    },
    // 4. Removable 여부
    removable: {
      true: style({
        paddingRight: '12px',
        gap: '4px',
      }),
    },
  },

  // 선택 상태(isSelected: true)에 따른 Compound Variants 지정
  compoundVariants: [
    // 초록색 칩이 선택되었을 때 ('전체' 등)
    {
      variants: { colorScheme: 'primary', isSelected: true },
      style: {
        backgroundColor: colors.primary[500],
        color: colors.text[5],
        borderColor: colors.primary[500],
      },
    },
    // 2) primaryLight 선택 시 -> 연한 초록 배경 + 진한 초록 글자 ('내 주변')
    {
      variants: { colorScheme: 'primaryLight', isSelected: true },
      style: {
        backgroundColor: colors.primary[300], // #92DCAE
        color: colors.primary[700], // #17783C
        borderColor: colors.primary[300],
      },
    },
    // 회색 칩이 선택되었을 때 ('맛집' 오른쪽 등)
    {
      variants: { colorScheme: 'neutral', isSelected: true },
      style: {
        backgroundColor: colors.surface[4], // 연회색 배경
        color: colors.text[3], // 회색 글자
        borderColor: colors.surface[4],
      },
    },
  ],

  defaultVariants: {
    size: 'MD',
    colorScheme: 'neutral',
    isSelected: false,
    removable: false,
  },
})

// 내부 아이콘 전용 스타일
//fill="currentColor"나 stroke="currentColor"로 사용
export const iconStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  color: 'inherit',
})

// REMOVABLE의 X 삭제 버튼 스타일
export const removeBtnStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  marginLeft: '2px', // 텍스트와의 미세 간격

  // 원형 배경 구현
  width: '14px', // 버튼 전체 크기
  height: '14px',
  borderRadius: '50%', // 완벽한 원
  backgroundColor: colors.text[4], // 연회색 배경 (#F3F4F8)

  // 내부 X 아이콘 색상
  color: colors.text[5], // 더 진한 회색 (#9C9C97)
})
