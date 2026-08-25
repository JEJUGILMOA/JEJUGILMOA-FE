import { globalStyle } from '@vanilla-extract/css'

/** 지도는 네이티브가 뒤에 두고, 시트 WebView는 투명 배경만 쓴다. */
globalStyle('html.gilmoa-native-map, html.gilmoa-native-map body, html.gilmoa-native-map #root', {
  backgroundColor: 'transparent',
})

globalStyle('html.gilmoa-native-map [data-gilmoa-shell], html.gilmoa-native-map main', {
  backgroundColor: 'transparent',
  height: '100%',
  overflow: 'hidden',
})

globalStyle('html.gilmoa-native-map [data-gilmoa-itinerary-sheet-body]', {
  height: '100%',
  maxHeight: '100%',
  overflowY: 'auto',
  WebkitOverflowScrolling: 'touch',
})
