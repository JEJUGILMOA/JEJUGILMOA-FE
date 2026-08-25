import { describe, expect, it } from 'vitest'
import { webToNativeMessageSchema, nativeToWebMessageSchema } from '@/bridge/messageSchema'
import { nativeBridge } from '@/bridge/nativeBridge'

describe('bridge messageSchema', () => {
  it('parses valid web→native messages', () => {
    const result = webToNativeMessageSchema.safeParse({ type: 'REQUEST_LOCATION' })
    expect(result.success).toBe(true)
  })

  it('rejects invalid native→web messages', () => {
    const result = nativeToWebMessageSchema.safeParse({ type: 'UNKNOWN' })
    expect(result.success).toBe(false)
  })

  it('parses ANDROID_BACK message', () => {
    const result = nativeToWebMessageSchema.safeParse({ type: 'ANDROID_BACK' })
    expect(result.success).toBe(true)
  })

  it('parses SET_HEADER message', () => {
    const result = webToNativeMessageSchema.safeParse({
      type: 'SET_HEADER',
      title: '설정',
      showBack: true,
      visible: true,
      rightText: '1 / 4',
      actions: [{ id: 'save', label: '저장', tone: 'primary' }],
    })
    expect(result.success).toBe(true)
  })

  it('parses SET_TOAST message', () => {
    const result = webToNativeMessageSchema.safeParse({
      type: 'SET_TOAST',
      visible: true,
      kind: 'success',
      message: '저장했어요',
      duration: 2000,
    })
    expect(result.success).toBe(true)
  })

  it('parses SET_ITINERARY_CHROME message', () => {
    const result = webToNativeMessageSchema.safeParse({
      type: 'SET_ITINERARY_CHROME',
      visible: true,
      day: 2,
      totalDays: 3,
      dateLabel: '8.25(화)',
      searchQuery: '',
      searchPlaceholder: '장소를 검색해보세요',
      isSelectingDeparture: false,
      nextLabel: '다음',
    })
    expect(result.success).toBe(true)
  })

  it('parses NATIVE_LAYOUT message', () => {
    const result = nativeToWebMessageSchema.safeParse({
      type: 'NATIVE_LAYOUT',
      screenHeight: 844,
    })
    expect(result.success).toBe(true)
  })

  it('parses SET_MODAL message', () => {
    const result = webToNativeMessageSchema.safeParse({
      type: 'SET_MODAL',
      visible: true,
      id: 'm1',
      title: '담을까요?',
      actions: [{ id: 'm1#0', label: '취소', variant: 'ghost' }],
    })
    expect(result.success).toBe(true)
  })
})

describe('nativeBridge', () => {
  it('posts without throwing in mock mode', () => {
    expect(() => nativeBridge.postToNative({ type: 'WEB_READY' })).not.toThrow()
  })
})
