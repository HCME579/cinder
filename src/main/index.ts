import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron'
import { join } from 'node:path'
import { existsSync } from 'node:fs'
import { createRequire } from 'node:module'
import { autoUpdater } from 'electron-updater'
import type { AppInfo, MediaRouteRequest, MediaRouteResult } from '../shared/types.js'

const isDev = !app.isPackaged
const APP_NAME = 'Cinder'

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 600,
    show: false,
    autoHideMenuBar: true,
    backgroundColor: '#0d0907',
    title: APP_NAME,
    webPreferences: {
      preload: resolvePreloadPath(),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (isDev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    // In production, the renderer is emitted to `<project>/dist/index.html`
    // while main lives at `<project>/dist-electron/main/index.js`.
    mainWindow.loadFile(join(import.meta.dirname, '..', '..', 'dist', 'index.html'))
  }
}

// electron-vite emits preload as `.mjs` when the project is ESM, `.js` otherwise.
// We probe the dist directory and pick the one that exists.
function resolvePreloadPath(): string {
  const candidates = ['index.mjs', 'index.js']
  const dir = join(import.meta.dirname, '..', 'preload')
  for (const name of candidates) {
    if (existsSync(join(dir, name))) return join(dir, name)
  }
  return join(dir, 'index.js')
}

// `createRequire` kept available in case we need to interop a CommonJS module later.
void createRequire

app.whenReady().then(() => {
  if (process.platform === 'win32') {
    app.setAppUserModelId('com.hcme579.cinder')
  }

  registerIpcHandlers()

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  // Auto-updater wiring — silently logs; never crashes the app.
  if (!isDev) {
    autoUpdater.autoDownload = true
    autoUpdater.autoInstallOnAppQuit = true
    autoUpdater
      .checkForUpdates()
      .catch((err) => console.error('[cinder] update check failed', err))
    autoUpdater.on('update-available', (info) =>
      console.log('[cinder] update available', info.version),
    )
    autoUpdater.on('update-downloaded', (info) =>
      console.log('[cinder] update downloaded', info.version),
    )
    autoUpdater.on('error', (err) => console.error('[cinder] updater error', err))
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

function registerIpcHandlers(): void {
  ipcMain.handle('app:info', (): AppInfo => ({
    name: APP_NAME,
    version: app.getVersion(),
    electron: process.versions.electron,
    chrome: process.versions.chrome,
    node: process.versions.node,
    platform: process.platform
  }))

  ipcMain.handle('media:route', async (_e, req: MediaRouteRequest): Promise<MediaRouteResult> => {
    // The user-facing video routing policy is documented in src/renderer/src/lib/media-routing.ts.
    // This handler exists as the IPC bridge so the renderer never imports fs/path directly.
    const result: MediaRouteResult = {
      ok: true,
      source: req.source,
      message:
        req.source === 'local'
          ? 'Local filesystem path will be returned to the renderer.'
          : req.source === 'drive'
            ? 'Drive file-ID will be resolved via OAuth + PKCE in the system browser.'
            : 'Dropbox path will be resolved via OAuth + PKCE in the system browser.'
    }

    if (req.source === 'local' && req.filename) {
      const choice = await dialog.showSaveDialog({
        title: 'Choose a destination on this PC',
        defaultPath: req.filename
      })
      if (choice.canceled || !choice.filePath) {
        return { ok: false, source: 'local', message: 'User cancelled' }
      }
      result.message = `Local path: ${choice.filePath}`
    }

    return result
  })
}
