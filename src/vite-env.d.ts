/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_USE_MOCK_BRIDGE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
