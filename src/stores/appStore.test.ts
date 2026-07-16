import { describe, expect, it, beforeEach } from 'vitest'
import { appStore } from '@/stores/appStore'
import { authStore } from '@/stores/authStore'

describe('appStore', () => {
  beforeEach(() => {
    appStore.setState({
      isInitialized: false,
      isWebView: false,
      nativeLocation: null,
      selectedPlace: null,
      ui: {
        isBottomSheetOpen: false,
        isLoadingOverlayVisible: false,
      },
    })
  })

  it('updates native location', () => {
    appStore.getState().setNativeLocation({ latitude: 33.5, longitude: 126.5 })
    expect(appStore.getState().nativeLocation).toEqual({
      latitude: 33.5,
      longitude: 126.5,
    })
  })
})

describe('authStore', () => {
  beforeEach(() => {
    authStore.getState().clearAuth()
  })

  it('sets and clears auth', () => {
    authStore.getState().setAuth({
      accessToken: 'token',
      user: { id: '1', nickname: '테스터' },
    })

    expect(authStore.getState().isAuthenticated).toBe(true)
    expect(authStore.getState().user?.nickname).toBe('테스터')

    authStore.getState().clearAuth()
    expect(authStore.getState().isAuthenticated).toBe(false)
    expect(authStore.getState().accessToken).toBeNull()
  })
})
