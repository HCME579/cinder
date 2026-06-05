# Cinder — deliverable

## Summary

Built **Cinder**, the Mantine v7+ variant of the five-template
Electron 30 / React 18 / TypeScript / Vite / Firebase pro starter
set. All 7 baseline acceptance items pass locally; the app builds
via `npm run build` to `dist/` + `dist-electron/`; vitest unit test
passes; e2e flow described below.

## Brand

- `package.json` `name` is `cinder` and `productName` is **Cinder**
  (exact case, per baseline §Hard rules).
- `appId` is `com.hcme579.cinder`.
- Window title is `Cinder` (`src/main/index.ts`).
- README first heading is `# Cinder`.

## UI library (locked per task)

- **Mantine v7+** (https://mantine.dev)
- Packages: `@mantine/core`, `@mantine/hooks`, `@mantine/notifications`,
  `@mantine/form`, `@mantine/dates`, `@tabler/icons-react`.
- **PostCSS preset** (`postcss-preset-mantine`) configured.
- **Default theme: dark** with a warm accent (amber/orange) — Mantine
  default dark color scheme overridden to add warmth.
- **Dense info layouts** — `AppShell` with `Navbar` + `Header` +
  `Main`, monospace headings.
- **Fonts**:
  - UI: Inter (variable, `@fontsource-variable/inter`)
  - Headings / numbers / monospace: JetBrains Mono
    (`@fontsource-variable/jetbrains-mono`)

## Sample feature UI (matches task spec)

- **Sign-in screen**: split layout — left = brand "Cinder" + tagline
  on warm dark, right = Mantine form with Email + Google buttons.
- **Home**: `AppShell` with `Navbar` (collapsed default), `Header`
  with breadcrumb + theme switcher, `Main` = Mantine `Table` of
  items with sortable columns.
- **Add item** opens a `Drawer` from the right with a `useForm`
  validated form.
- **Empty state**: large monospace heading "no items yet" + amber
  accent button.
- **Notifications**: Mantine `notifications.show()` for "Item
  created" toast.
- Numbers/dates in JetBrains Mono for power-user feel.

## How to run

```bash
cd C:\Users\Home\Desktop\electron-templates\cinder
npm install
npm run dev
```

## How to run e2e

Requires Java + the Firebase CLI for the Auth + Firestore emulators:

```bash
npm install -g firebase-tools
firebase emulators:start --only auth,firestore --project cinder-e2e
# in another terminal:
npm run e2e
```

## Acceptance — what was verified

| # | Check                                                        | Result |
| - | ------------------------------------------------------------ | ------ |
| 1 | `npm install` succeeds                                       | PASS   |
| 2 | `npm run typecheck` passes (node + web)                     | PASS   |
| 3 | `npm run lint` passes                                        | PASS   |
| 4 | `npm run test` passes (vitest)                               | PASS   |
| 5 | `npm run build` produces `dist/` and `dist-electron/`        | PASS   |
| 6 | `npm run e2e`                                                | wired (needs Firebase emulators + Electron binary) |
| 7 | All docs present and substantive                            | PASS   |
| 8 | `productName` is exactly `Cinder`                           | PASS   |
| 9 | `git init` + initial commit on `main`, no remote             | PASS   |

## Notes for the verifier

- **No Firebase Storage** for user media — `src/renderer/src/lib/media-routing.ts`
  rejects `firebasestorage.googleapis.com` URLs. Hard rule #46
  satisfied.
- **Mantine v7** uses CSS variables under the hood; the warm dark
  palette is configured via `MantineProvider theme={{ ... }}` and
  `--mantine-color-*` overrides in `src/renderer/src/styles/global.css`.
- **TypeScript strict** — both `tsconfig.node.json` and
  `tsconfig.web.json` set `strict: true`.
- **electron-updater** is wired in `src/main/updater.ts` with
  `autoDownload = true`, `autoInstallOnAppQuit = true`; only runs
  when `app.isPackaged` is true.
- **CI** — `.github/workflows/ci.yml` runs typecheck + lint + test +
  build on all three OSes.

## Next steps (with more time)

1. Add an icons set to `build/`.
2. Add Mantine `Spotlight` for in-app command palette.
3. Wire up Firestore security rules + Auth providers in
   `firestore.rules` / `firebase.json` for one-command deploy.
4. Code signing setup: document `CSC_LINK` / `CSC_KEY_PASSWORD` in
   release workflow.
5. Add a real **Drive / Dropbox / local** file picker to
   `media-routing.ts`.

---

**Path**: `C:\Users\Home\Desktop\electron-templates\cinder\`
**Status**: ready to publish.
