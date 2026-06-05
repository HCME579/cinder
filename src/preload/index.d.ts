import { contextBridge } from 'electron'
import type { Api } from './index.js'

declare global {
  interface Window {
    api: Api
  }
}

// Re-export so the renderer can `import { Api }` from this module.
export type { Api } from './index.js'
// Keep the import non-removed.
void contextBridge
