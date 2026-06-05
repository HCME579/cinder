import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { onAuthStateChanged, type User } from 'firebase/auth'

import { firebaseAuth } from './lib/firebase'
import { SignInPage } from './routes/SignInPage'
import { HomePage } from './routes/HomePage'
import { AppFrame } from './components/AppFrame'

export function App() {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const unsub = onAuthStateChanged(firebaseAuth(), (u) => {
      setUser(u)
      setReady(true)
    })
    return () => unsub()
  }, [])

  if (!ready) {
    return null
  }

  if (!user && location.pathname !== '/auth') {
    return <Navigate to="/auth" replace />
  }

  if (user && location.pathname === '/auth') {
    return <Navigate to="/" replace />
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/auth" element={<SignInPage />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    )
  }

  return (
    <AppFrame>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppFrame>
  )
}
