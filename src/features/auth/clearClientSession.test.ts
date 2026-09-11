import { afterEach, describe, expect, it, vi } from 'vitest'

import { clearClientAuthSession } from './clearClientSession'

describe('clearClientAuthSession', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    document.cookie.split(';').forEach((part) => {
      const name = part.split('=')[0]?.trim()
      if (name) {
        document.cookie = `${name}=; Max-Age=0; path=/`
      }
    })
    localStorage.clear()
  })

  it('expires readable cookies and oauth pending keys', () => {
    localStorage.setItem('gilmoa_oauth_state', 'abc')
    localStorage.setItem('gilmoa_oauth_provider', 'kakao')
    document.cookie = 'accessToken=secret; path=/'
    document.cookie = 'custom_session=1; path=/'

    clearClientAuthSession()

    expect(localStorage.getItem('gilmoa_oauth_state')).toBeNull()
    expect(localStorage.getItem('gilmoa_oauth_provider')).toBeNull()
    expect(document.cookie).not.toMatch(/accessToken=secret/)
    expect(document.cookie).not.toMatch(/custom_session=1/)
  })
})
