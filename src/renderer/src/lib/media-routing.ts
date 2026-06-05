import type { MediaSource } from '@shared/types'

/**
 * Media-routing policy (project #46).
 *
 * User media (video / image / audio files, exported MP4s) is NEVER stored on
 * Firebase Storage. The app stores a *reference* — a local path, a Google
 * Drive file-ID, or a Dropbox path — and the renderer asks the main process
 * (via window.api.mediaRoute) to resolve it.
 *
 * The actual file IO for cloud sources happens via system-browser OAuth + PKCE
 * + the HTTP API (see #44/#45) — never via web popups or SDKs that don't
 * work inside Electron's webContents.
 */
export interface MediaRoutePolicy {
  source: MediaSource
  label: string
  description: string
}

export const MEDIA_POLICIES: MediaRoutePolicy[] = [
  {
    source: 'local',
    label: 'This PC',
    description: 'Open a system file dialog and store an absolute path on disk.'
  },
  {
    source: 'drive',
    label: 'Google Drive',
    description: 'OAuth + PKCE in the system browser; store a Drive file-ID.'
  },
  {
    source: 'dropbox',
    label: 'Dropbox',
    description: 'OAuth + PKCE in the system browser; store a Dropbox path.'
  }
]

export function pickMediaSource(preferred: MediaSource): MediaRoutePolicy {
  return MEDIA_POLICIES.find((p) => p.source === preferred) ?? MEDIA_POLICIES[0]
}
