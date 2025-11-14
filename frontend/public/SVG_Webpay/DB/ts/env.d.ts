import { defineConfig } from 'vite'

export interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_API_TIMEOUT: string
  // ... add other env variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}