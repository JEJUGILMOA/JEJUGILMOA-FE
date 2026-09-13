import { nativeBridge } from '@/bridge/nativeBridge'

type NaverMapPlace = {
  name: string
  latitude?: number
  longitude?: number
}

function buildNaverMapUrls(place: NaverMapPlace) {
  const name = encodeURIComponent(place.name)
  const hasCoords = place.latitude != null && place.longitude != null

  const appUrl = hasCoords
    ? `nmap://place?lat=${place.latitude}&lng=${place.longitude}&name=${name}&appname=jejugilmoa`
    : `nmap://search?query=${name}&appname=jejugilmoa`

  const webUrl = hasCoords
    ? `https://map.naver.com/v5/?c=${place.longitude},${place.latitude},15,0,0,0,dh`
    : `https://map.naver.com/v5/search/${name}`

  return { appUrl, webUrl }
}

/** 네이버 지도 앱(없으면 웹)으로 장소 열기 */
export function openNaverMapPlace(place: NaverMapPlace) {
  const { appUrl, webUrl } = buildNaverMapUrls(place)

  if (nativeBridge.isNativeWebView()) {
    nativeBridge.postToNative({
      type: 'OPEN_EXTERNAL_URL',
      url: appUrl,
      fallbackUrl: webUrl,
    })
    return
  }

  window.open(webUrl, '_blank', 'noopener,noreferrer')
}
