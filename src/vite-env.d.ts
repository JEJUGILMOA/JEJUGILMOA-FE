/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_USE_MOCK_BRIDGE: string
  readonly VITE_HIDE_WEB_NAV: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
