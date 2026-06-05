import { contextBridge, ipcRenderer } from 'electron'
import type {
  AppInfo,
  MediaRouteRequest,
  MediaRouteResult
} from '../shared/types.js'

const api = {
  appInfo: (): Promise<AppInfo> => ipcRenderer.invoke('app:info'),
  mediaRoute: (req: MediaRouteRequest): Promise<MediaRouteResult> =>
    ipcRenderer.invoke('media:route', req)
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error('[cinder] contextBridge failed', error)
  }
} else {
  // @ts-expect-error fallback for non-isolated contexts (dev only)
  window.api = api
}

export type Api = typeof api
