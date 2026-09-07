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

  it('parses LOGOUT message', () => {
    const result = webToNativeMessageSchema.safeParse({ type: 'LOGOUT' })
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

  it('parses TAB_POP_TO_ROOT message', () => {
    const result = nativeToWebMessageSchema.safeParse({
      type: 'TAB_POP_TO_ROOT',
      path: '/plan',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid TAB_POP_TO_ROOT path', () => {
    const result = nativeToWebMessageSchema.safeParse({
      type: 'TAB_POP_TO_ROOT',
      path: '/place/123',
    })
    expect(result.success).toBe(false)
  })
})

describe('nativeBridge', () => {
  it('posts without throwing in mock mode', () => {
    expect(() => nativeBridge.postToNative({ type: 'WEB_READY' })).not.toThrow()
  })
})
