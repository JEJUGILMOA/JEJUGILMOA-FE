import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors, typography } from '@/styles'

// 종 아이콘과 뱃지를 감싸는 컨테이너
export const badgeContainer = style({
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
})

// 기본 뱃지 공통 스타일 (조금 더 둥근 모서리)
const baseBadge = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '4px', // 칩(100px)과 달리 둥근 사각형 형태
  fontWeight: 500,
  whiteSpace: 'nowrap',
  userSelect: 'none',
  boxSizing: 'border-box',
})

export const badgeRecipe = recipe({
  base: baseBadge,

  variants: {
    // 1. 크기 규격 (xs, sm, md)
    size: {
      // xs: 종 아이콘 우측 상단에 붙는 붉은색 Dot 뱃지
      xs: style({
        position: 'absolute',
        top: '2px', // 위쪽 위치 조정 (더 올리려면 -2px, -4px 등 음수 사용)
        right: '2px', // 오른쪽 위치 조정
        width: '6px',
        height: '6px',
        padding: 0,
        borderRadius: '50%',
        minWidth: '6px',
      }),
      // sm (기본)
      sm: [
        typography.labelSmall, // 12px
        style({
          height: '22px',
          padding: '0 8px',
        }),
      ],
      // md
      md: [
        typography.labelMedium, // 12px, font-weight 500
        style({
          height: '25px',
          padding: '0 12px',
        }),
      ],
    },

    // 2. 상태 및 색상 (STATUS / COLOR)
    status: {
      // 무료 (초록 연한 배경 + 초록 텍스트)
      success: {
        backgroundColor: colors.primary[300],
        color: colors.primary[800],
      },
      // 진행중 (파랑 연한 배경 + 파랑 텍스트)
      info: {
        backgroundColor: colors.secondary[200],
        color: colors.secondary[500],
      },
      // 마감 / xs Dot (빨강 연한 배경 + 빨강 텍스트 / Dot은 진한 빨강)
      error: {
        backgroundColor: colors.error[100],
        color: colors.error[500],
      },
      // 준비중 (회색 연한 배경 + 회색 텍스트)
      neutral: {
        backgroundColor: colors.surface[5],
        color: colors.text[3],
      },
    },
    // 3. 형태 (FILLED vs OUTLINE)
    variant: {
      filled: {},
      outline: {
        backgroundColor: colors.surface[1], // #FFFFFF
        border: '1px solid currentColor',
      },
    },
  },

  // Compound Variants로 OUTLINE 상태의 전용 테두리/텍스트 색상 정밀 매핑
  compoundVariants: [
    {
      variants: { variant: 'outline', status: 'success' },
      style: {
        color: colors.primary[600], // #1F9D4E
        borderColor: colors.primary[500], // #24B95C
      },
    },
    {
      variants: { variant: 'outline', status: 'error' },
      style: {
        color: colors.error[300], // #B23A3A
        borderColor: colors.error[300], // #B23A3A
      },
    },
    {
      variants: { size: 'xs', status: 'error' },
      style: {
        backgroundColor: colors.error[500], // Red Dot
      },
    },
  ],

  defaultVariants: {
    size: 'sm',
    status: 'success',
    variant: 'filled',
  },
})
