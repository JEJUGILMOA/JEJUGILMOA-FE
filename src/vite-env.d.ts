/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_USE_MOCK_BRIDGE: string
  readonly VITE_HIDE_WEB_NAV: string
  readonly VITE_DEV_AUTH: string
  readonly VITE_KAKAO_REST_API_KEY: string
  readonly VITE_NAVER_CLIENT_ID: string
  readonly VITE_GOOGLE_WEB_CLIENT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
