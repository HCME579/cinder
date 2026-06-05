# Contributing to Cinder

Thanks for your interest. Cinder is part of a small family of Electron
starter templates; the bar is "production-grade scaffold, not a demo".

## Dev setup

Requirements: Node 20+, npm 10+.

```sh
npm install
npm run dev
```

For tests:

```sh
npm run test       # vitest unit tests
npm run e2e        # playwright, needs the build artifacts
```

For the Firebase emulator (used by the e2e suite and by `dev` when
`VITE_USE_EMULATOR=true`):

```sh
firebase emulators:start --only auth,firestore
```

## Scripts

| Script              | What it does                                      |
| ------------------- | ------------------------------------------------- |
| `npm run dev`       | electron-vite dev server (HMR)                    |
| `npm run build`     | Type-check + build main, preload, renderer        |
| `npm run typecheck` | `tsc --noEmit` for main + renderer tsconfigs      |
| `npm run lint`      | ESLint (flat config)                              |
| `npm run format`    | Prettier write                                    |
| `npm run test`      | Vitest                                            |
| `npm run e2e`       | Playwright (Electron)                             |
| `npm run release`   | Build + electron-builder (publishes to GitHub)    |

## Commit conventions

This repo uses **Conventional Commits** enforced by `commitlint` and a Husky
`commit-msg` hook.

```
feat: add keyboard shortcut to open the AddItem drawer
fix: prevent empty name from being saved
chore: bump mantine to 7.14
```

`pre-commit` runs `lint-staged` (Prettier + ESLint --fix) on staged files.

## Architecture rules

- **No Firebase Storage for user media.** (Project #46.) User media lives in
  Google Drive, Dropbox, or the local filesystem. The app stores a reference
  (Drive file-ID, Dropbox path, or absolute path), not the bytes.
- Cloud import uses **system-browser OAuth + PKCE + the HTTP API** — never
  web popups or SDKs that don't work inside Electron's webContents.
- The renderer never imports `fs`, `path`, or `child_process` directly. It
  asks the main process via the typed `window.api` bridge.

## Adding a new dependency

1. Make sure it's actually used (no dead deps).
2. `npm install <pkg>` — let `package-lock.json` track it.
3. Run `npm run typecheck && npm run lint && npm run test`.
4. Mention it in the PR description.
