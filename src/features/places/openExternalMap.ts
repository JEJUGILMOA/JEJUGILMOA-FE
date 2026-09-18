import { nativeBridge } from '@/bridge/nativeBridge'

export type ExternalMapPlace = {
  name: string
  latitude?: number
  longitude?: number
}

function isAndroidUserAgent() {
  return typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent)
}

/** iOS App Store Guideline 4: Apple Maps. Android는 geo/Google Maps. */
export function buildExternalMapUrls(place: ExternalMapPlace) {
  const name = encodeURIComponent(place.name)
  const hasCoords = place.latitude != null && place.longitude != null
  const lat = place.latitude
  const lng = place.longitude

  if (isAndroidUserAgent()) {
    const appUrl = hasCoords
      ? `geo:${lat},${lng}?q=${lat},${lng}(${name})`
      : `geo:0,0?q=${name}`
    const webUrl = hasCoords
      ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
      : `https://www.google.com/maps/search/?api=1&query=${name}`
    return { appUrl, webUrl }
  }

  const appUrl = hasCoords
    ? `maps://?ll=${lat},${lng}&q=${name}`
    : `maps://?q=${name}`
  const webUrl = hasCoords
    ? `https://maps.apple.com/?ll=${lat},${lng}&q=${name}`
    : `https://maps.apple.com/?q=${name}`
  return { appUrl, webUrl }
}

/** 외부 지도 앱(iOS: Apple Maps, Android: geo)으로 장소 열기 */
export function openExternalMapPlace(place: ExternalMapPlace) {
  const { appUrl, webUrl } = buildExternalMapUrls(place)

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

/** @deprecated openExternalMapPlace 사용 */
export const openNaverMapPlace = openExternalMapPlace
