# Changelog

All notable changes to **Cinder** are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this project
adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- Initial scaffold: Electron 30 + React 18 + TypeScript 5 + Vite 5
  (electron-vite) + Mantine v7 warm-dark theme.
- AppShell layout with collapsible Navbar, Header (breadcrumb + theme toggle),
  and Main area.
- Split sign-in screen (brand left, Mantine `useForm` right) supporting Google
  and Email/Password.
- Items list (Mantine `Table` with sortable columns) backed by Firestore via
  a one-time `getDocs` plus a real-time `onSnapshot` subscription.
- Add Item drawer (`useForm` validated) with `notifications` toast on success.
- Empty state with monospace heading + amber CTA.
- Firebase Auth + Firestore wiring with emulator toggle (`VITE_USE_EMULATOR`).
- `electron-updater` configured in the main process (GitHub release provider).
- `lib/media-routing.ts` documenting the local / Drive / Dropbox policy
  (no Firebase Storage for user media — see project #46).
- Vitest unit tests on the `format` utility, plus a Playwright e2e that
  launches the app via `_electron`.
- CI workflows (build on push/PR across Ubuntu/Windows/macOS) and a release
  workflow on `v*` tags.
- Husky `pre-commit` (Prettier + ESLint --fix on staged files) and
  `commit-msg` (commitlint) hooks.
