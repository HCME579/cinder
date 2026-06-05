export interface AppInfo {
  name: string
  version: string
  electron: string
  chrome: string
  node: string
  platform: NodeJS.Platform
}

export interface Item {
  id: string
  name: string
  createdAt: number
}

export interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
}

export type SignInProvider = 'google' | 'email'

export interface SignInRequest {
  provider: SignInProvider
  email?: string
  password?: string
}

export type MediaSource = 'local' | 'drive' | 'dropbox'

export interface MediaRouteRequest {
  source: MediaSource
  filename?: string
}

export interface MediaRouteResult {
  ok: boolean
  source: MediaSource
  message: string
}
