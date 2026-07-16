import { createStore } from 'zustand/vanilla'
import { useStore } from 'zustand'

export type GeoLocation = {
  latitude: number
  longitude: number
  accuracy?: number
}

export type SelectedPlace = {
  id: string
  name: string
} | null

export type GlobalUiState = {
  isBottomSheetOpen: boolean
  isLoadingOverlayVisible: boolean
}

type AppState = {
  isInitialized: boolean
  isWebView: boolean
  nativeLocation: GeoLocation | null
  selectedPlace: SelectedPlace
  ui: GlobalUiState
  setInitialized: (value: boolean) => void
  setIsWebView: (value: boolean) => void
  setNativeLocation: (location: GeoLocation | null) => void
  setSelectedPlace: (place: SelectedPlace) => void
  setUi: (patch: Partial<GlobalUiState>) => void
}

export const appStore = createStore<AppState>()((set) => ({
  isInitialized: false,
  isWebView: false,
  nativeLocation: null,
  selectedPlace: null,
  ui: {
    isBottomSheetOpen: false,
    isLoadingOverlayVisible: false,
  },
  setInitialized: (value) => set({ isInitialized: value }),
  setIsWebView: (value) => set({ isWebView: value }),
  setNativeLocation: (location) => set({ nativeLocation: location }),
  setSelectedPlace: (place) => set({ selectedPlace: place }),
  setUi: (patch) => set((state) => ({ ui: { ...state.ui, ...patch } })),
}))

export function useAppStore<T>(selector: (state: AppState) => T): T {
  return useStore(appStore, selector)
}
