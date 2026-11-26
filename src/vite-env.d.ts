/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
  readonly VITE_BUSINESS_ID?: string
  readonly VITE_EMAIL_RELAY_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
