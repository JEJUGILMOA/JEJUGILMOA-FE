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

  it('parses HEADER_ACTION message', () => {
    const result = nativeToWebMessageSchema.safeParse({ type: 'HEADER_ACTION', id: 'save' })
    expect(result.success).toBe(true)
  })
})

describe('nativeBridge', () => {
  it('posts without throwing in mock mode', () => {
    expect(() => nativeBridge.postToNative({ type: 'WEB_READY' })).not.toThrow()
  })
})
