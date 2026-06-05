# Architecture notes

Cinder follows the [pro baseline](../../_baseline.md) — Electron 30, React 18,
TypeScript 5, Vite 5, Firebase v10. The unique constraints of this template
are listed below.

## Warm-dark Mantine theme

The default `MantineProvider` ships with a custom theme:

- `primaryColor: 'amber'` with a brighter shade for dark mode
- Custom `coal` color scale used for surfaces and borders
- Headings default to **JetBrains Mono Variable** for a dense info-feel
- UI body text uses **Inter Variable** for legibility
- Numbers, dates, and IDs are explicitly tagged with `data-mono="true"` so
  they get tabular numerals via the JetBrains Mono feature settings

## Media routing (project #46)

Cinder never stores user media on Firebase Storage. The renderer asks the
main process (via the typed `window.api.mediaRoute` bridge) which source to
use — local, Drive, or Dropbox. The main process is responsible for
resolving file paths or returning Drive file-IDs / Dropbox paths.

Cloud import must use **system-browser OAuth + PKCE** + the HTTP API (see
#44 / #45). Web popups and SDKs that don't work inside Electron's
`webContents` are explicitly out of scope.

## Why no `react-router` in main?

Routes are owned by the renderer (`src/renderer/src/App.tsx`) and use
`react-router-dom`. The main process exposes only IPC handlers and a
typed `window.api` surface.
