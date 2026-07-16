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
})

describe('nativeBridge', () => {
  it('posts without throwing in mock mode', () => {
    expect(() => nativeBridge.postToNative({ type: 'WEB_READY' })).not.toThrow()
  })
})
