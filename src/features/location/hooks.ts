import { useAppStore } from '@/stores/appStore'
import { nativeBridge } from '@/bridge/nativeBridge'

export function useNativeLocation() {
  const location = useAppStore((s) => s.nativeLocation)

  return {
    location,
    requestLocation: () => nativeBridge.requestNativeLocation(),
  }
}
