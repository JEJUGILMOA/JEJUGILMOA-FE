import { createGlobalTheme } from '@vanilla-extract/css'

/** 레이아웃·간격 등 비색상 토큰 */
export const vars = createGlobalTheme(':root', {
  fontFamily: {
    sans: '"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '36px',
  },
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.625',
  },
  space: {
    0: '0px',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
  },
  radius: {
    none: '0px',
    sm: '6px',
    md: '10px',
    lg: '14px',
    xl: '20px',
    full: '9999px',
  },
  shadow: {
    sm: '0 1px 2px rgba(10, 52, 26, 0.08)',
    md: '0 4px 12px rgba(10, 52, 26, 0.12)',
    lg: '0 12px 28px rgba(10, 52, 26, 0.16)',
  },
  zIndex: {
    base: '0',
    dropdown: '10',
    sticky: '20',
    overlay: '30',
    modal: '40',
    toast: '50',
  },
  size: {
    touch: '44px',
    header: '56px',
    bottomNav: '64px',
  },
  duration: {
    fast: '120ms',
    normal: '200ms',
    slow: '320ms',
  },
  overlay: 'rgba(37, 37, 45, 0.48)',
})
