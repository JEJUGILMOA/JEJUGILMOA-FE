import { createGlobalTheme } from '@vanilla-extract/css'

export const colors = createGlobalTheme(':root', {
  primary: {
    100: '#E9F8EB',
    200: '#BDEACE',
    300: '#92DCAE',
    400: '#66CE8D',
    500: '#24B95C',
    600: '#1F9D4E',
    700: '#17783C',
    800: '#105329',
    900: '#0A341A',
  },
  secondary: {
    100: '#E9F1FC',
    200: '#BDD2F8',
    300: '#91B5F3',
    400: '#6597EE',
    500: '#236AE6',
    600: '#1E5AC4',
    700: '#174596',
    800: '#103068',
    900: '#0A1E40',
  },
  success: {
    300: '#00E45F',
    500: '#01D258',
    700: '#00C552',
  },
  warning: {
    300: '#FFC13F',
    500: '#FFB721',
    700: '#FFAC00',
  },
  info: {
    100: '#6597EE',
    300: '#006DCE',
    500: '#0057A4',
    700: '#0055A1',
  },
  surface: {
    1: '#FFFFFF',
    2: '#FEFEFE',
    3: '#F9F9F9',
    4: '#F3F4F6',
    5: '#EAEAE7',
  },
  error: {
    100: '#FF4C4C',
    300: '#B23A3A',
    500: '#973131',
    700: '#742626',
  },
  background: {
    1: '#FDFEFE',
    2: '#F3F4F8',
  },
  text: {
    1: '#25252D',
    2: '#45484F',
    3: '#5B5C60',
    4: '#9C9C97',
    5: '#FFFFFF',
    6: '#D1D5DC',
  },
  border: {
    1: '#EBEBED',
  },
})
