// Firebase modular SDK — wired per project #46: Auth + Firestore only.
// NO Firebase Storage for user media files. Ever.

import { initializeApp, type FirebaseApp } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  connectAuthEmulator,
  type Auth,
  type User
} from 'firebase/auth'
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  connectFirestoreEmulator,
  type Firestore
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? 'demo-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? 'demo-cinder.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? 'demo-cinder',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? 'demo-cinder.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '0',
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? '1:0:web:0'
}

let _app: FirebaseApp | null = null
let _auth: Auth | null = null
let _db: Firestore | null = null

export function getFirebaseApp(): FirebaseApp {
  if (_app) return _app
  _app = initializeApp(firebaseConfig)
  _auth = getAuth(_app)
  _db = getFirestore(_app)

  const useEmu = String(import.meta.env.VITE_USE_EMULATOR).toLowerCase() === 'true'
  if (useEmu) {
    if (_auth) connectAuthEmulator(_auth, 'http://localhost:9099', { disableWarnings: true })
    if (_db) connectFirestoreEmulator(_db, '127.0.0.1', 8080)
  }
  return _app
}

export function firebaseAuth(): Auth {
  if (!_auth) getFirebaseApp()
  return _auth as Auth
}

export function firestore(): Firestore {
  if (!_db) getFirebaseApp()
  return _db as Firestore
}

export async function signInWithGoogle(): Promise<User> {
  const auth = firebaseAuth()
  const provider = new GoogleAuthProvider()
  const cred = await signInWithPopup(auth, provider)
  return cred.user
}

export async function signInWithEmail(email: string, password: string): Promise<User> {
  const auth = firebaseAuth()
  const cred = await signInWithEmailAndPassword(auth, email, password)
  return cred.user
}

export async function signUpWithEmail(email: string, password: string): Promise<User> {
  const auth = firebaseAuth()
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  return cred.user
}

export async function signOut(): Promise<void> {
  await fbSignOut(firebaseAuth())
}

export interface ItemRecord {
  id: string
  name: string
  createdAt: number
}

const itemsCol = () => collection(firestore(), 'items')

export async function listItems(): Promise<ItemRecord[]> {
  const snap = await getDocs(itemsCol())
  return snap.docs.map((d) => {
    const data = d.data() as { name: string; createdAt?: { toMillis?: () => number } | number }
    const ts = data.createdAt
    const createdAt =
      typeof ts === 'number'
        ? ts
        : ts && typeof ts.toMillis === 'function'
          ? ts.toMillis()
          : Date.now()
    return { id: d.id, name: data.name, createdAt }
  })
}

export function subscribeItems(onChange: (items: ItemRecord[]) => void): () => void {
  return onSnapshot(itemsCol(), (snap) => {
    const items: ItemRecord[] = snap.docs.map((d) => {
      const data = d.data() as { name: string; createdAt?: { toMillis?: () => number } | number }
      const ts = data.createdAt
      const createdAt =
        typeof ts === 'number'
          ? ts
          : ts && typeof ts.toMillis === 'function'
            ? ts.toMillis()
            : Date.now()
      return { id: d.id, name: data.name, createdAt }
    })
    onChange(items)
  })
}

export async function createItem(name: string): Promise<ItemRecord> {
  const ref = await addDoc(itemsCol(), { name, createdAt: serverTimestamp() })
  return { id: ref.id, name, createdAt: Date.now() }
}

export function itemDoc(id: string) {
  return doc(firestore(), 'items', id)
}
