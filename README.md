# Cinder

> A warm-dark desktop starter — Electron 30 + React 18 + TypeScript + Mantine v7.

Cinder is one of a family of "pro" Electron starter templates. It is opinionated
about dense, power-user-friendly information layouts: monospace headings,
amber accents on a coal-dark surface, a sortable data table, and a clean
AppShell to grow into. It is not a demo — every screen is wired end-to-end with
the Firebase emulator so the happy path actually works on day one.

> Add screenshots here. (Placeholder — no binary assets in this repo.)

## Why Cinder?

Most Electron starters ship a white-default React app and a hero animation.
Cinder starts in the dark, with warm amber accents and a monospace-first
typographic system, so the first thing you see is "this is a tool, not a
landing page." If you are building a desktop app for engineers, editors,
analysts, or anyone who lives in their data, Cinder is the look you want.

## Features

- **Electron 30 + React 18 + TypeScript 5** in strict mode
- **Vite 5** via `electron-vite` for fast HMR and clean main/preload/renderer splits
- **Mantine v7** with a custom warm-dark theme (amber/orange accent, coal surfaces)
- **Inter Variable** for UI, **JetBrains Mono Variable** for headings, numbers, dates, IDs
- **AppShell** layout with collapsible Navbar + Header (breadcrumb + theme toggle)
- **Sign-in screen** with a split layout (brand left, form right) — Google + Email/Password
- **Items list** with a sortable Mantine `Table`, monospace timestamps and IDs
- **Add Item drawer** (`useForm` validated) + `notifications` toast on success
- **Empty state** with a large monospace heading and an amber CTA
- **Firebase Auth + Firestore** wired with emulator support (`VITE_USE_EMULATOR=true`)
- **No Firebase Storage** for user media (per project #46 — see `lib/media-routing.ts`)
- **`electron-updater`** wired in the main process (GitHub releases)
- **CI** on push/PR (ubuntu/windows/macos) and **release** on `v*` tag
- **Husky + lint-staged + commitlint** enforcing conventional commits

## Quick start

```sh
npm install
npm run dev
```

That launches the Electron shell with HMR. On first run you will land on the
split sign-in screen.

## Firebase setup

1. Create a Firebase project at <https://console.firebase.google.com>.
2. Copy `.env.example` to `.env.local` and fill in the values.
3. To use the local emulator:
   ```sh
   firebase emulators:start --only auth,firestore
   # in another terminal
   VITE_USE_EMULATOR=true npm run dev
   ```
4. To talk to a real Firebase project, leave `VITE_USE_EMULATOR` unset and the
   app will use the values in `.env.local`.

> **Hard rule:** this template never stores user media on Firebase Storage. See
> `src/renderer/src/lib/media-routing.ts` and project #46.

## Build & release

```sh
npm run build         # produces dist/ and dist-electron/
npm run release       # builds + publishes via electron-builder (needs GH_TOKEN)
```

Code signing is **not configured** out of the box. To sign macOS/Windows
binaries, set the `CSC_LINK` and `CSC_KEY_PASSWORD` secrets on the release
workflow.

## Tech stack

| Layer            | Library                          |
| ---------------- | -------------------------------- |
| Shell            | Electron 30                      |
| Bundler          | Vite 5 via electron-vite         |
| UI               | React 18                         |
| Type system      | TypeScript 5 (strict)            |
| Component kit    | Mantine v7                       |
| Icons            | @tabler/icons-react              |
| Fonts            | Inter Variable + JetBrains Mono  |
| State            | React + Zustand-ready            |
| Auth + DB        | Firebase v10 (Auth + Firestore)  |
| Tests            | Vitest (unit) + Playwright (e2e) |
| Lint / format    | ESLint flat + Prettier           |
| Hooks            | Husky + lint-staged + commitlint |
| Updates          | electron-updater (GitHub)        |

## Project layout

```
cinder/
├── src/
│   ├── main/                 # Electron main process
│   │   └── index.ts
│   ├── preload/              # contextBridge -> window.api
│   │   └── index.ts
│   ├── renderer/             # React + Mantine UI
│   │   ├── index.html
│   │   └── src/
│   │       ├── App.tsx
│   │       ├── main.tsx
│   │       ├── components/   # AppFrame, AddItemDrawer, EmptyState
│   │       ├── lib/          # firebase.ts, theme.ts, format.ts, media-routing.ts
│   │       ├── routes/       # SignInPage, HomePage
│   │       └── styles/       # global.css
│   └── shared/               # types shared between main and renderer
│       └── types.ts
├── tests/
│   ├── unit/                 # Vitest
│   └── e2e/                  # Playwright (_electron)
├── .github/                  # workflows + issue/PR templates
├── electron.vite.config.ts
├── tsconfig.{json,node,web}.json
├── package.json
└── README.md
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). Commits follow Conventional
Commits and are gated by `commitlint`.

## License

[MIT](./LICENSE) © HCME579.
