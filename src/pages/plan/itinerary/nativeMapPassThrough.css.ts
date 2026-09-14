import { globalStyle } from '@vanilla-extract/css'

/** 지도는 네이티브가 뒤에 두고, 시트 WebView는 투명 배경만 쓴다. */
globalStyle('html.gilmoa-native-map, html.gilmoa-native-map body, html.gilmoa-native-map #root', {
  backgroundColor: 'transparent',
})

globalStyle('html.gilmoa-native-map [data-gilmoa-shell], html.gilmoa-native-map main', {
  backgroundColor: 'transparent',
  height: '100%',
  overflow: 'hidden',
  // flush+hideNav(contentFlushNoNavStyle)의 safe-area+16px이 Day CTA를 위로 띄움
  // 네이티브 시트 WebView는 이미 시트 영역만 차지하므로 하단 inset 불필요
  paddingBottom: 0,
})

globalStyle('html.gilmoa-native-map [data-gilmoa-itinerary-sheet-body]', {
  height: '100%',
  maxHeight: '100%',
  overflowY: 'auto',
  WebkitOverflowScrolling: 'touch',
})
