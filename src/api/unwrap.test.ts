import { describe, expect, it } from 'vitest'
import { isApiEnvelope, unwrapApiResult } from './unwrap'

describe('unwrapApiResult', () => {
  it('returns result from swagger envelope', () => {
    expect(
      unwrapApiResult<{ id: number }>({
        isSuccess: true,
        code: 'OK',
        message: '성공',
        result: { id: 1 },
      }),
    ).toEqual({ id: 1 })
  })

  it('passes through raw payloads', () => {
    expect(unwrapApiResult([{ id: 1 }])).toEqual([{ id: 1 }])
  })

  it('detects envelope shape', () => {
    expect(
      isApiEnvelope({
        isSuccess: true,
        code: 'OK',
        message: 'ok',
        result: null,
      }),
    ).toBe(true)
    expect(isApiEnvelope({ foo: 1 })).toBe(false)
  })
})
