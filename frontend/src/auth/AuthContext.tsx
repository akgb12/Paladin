import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react'
import type { AuthConfig, User } from '../lib/types'

interface AuthState {
  user: User | null
  config: AuthConfig | null
  loading: boolean
  signInWithGoogle: () => void
  signInAsDev: () => Promise<void>
  signOut: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthState | undefined>(undefined)

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T | null> {
  const res = await fetch(url, { credentials: 'include', ...init })
  if (res.status === 401 || res.status === 204) return null
  if (!res.ok) throw new Error(`Request to ${url} failed: ${res.status}`)
  return (await res.json()) as T
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [config, setConfig] = useState<AuthConfig | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const [cfg, me] = await Promise.all([
        fetchJson<AuthConfig>('/api/auth/config'),
        fetchJson<User>('/api/auth/me'),
      ])
      setConfig(cfg)
      setUser(me)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const signInWithGoogle = useCallback(() => {
    window.location.href = '/oauth2/authorization/google'
  }, [])

  const signInAsDev = useCallback(async () => {
    const me = await fetchJson<User>('/api/auth/dev-login', { method: 'POST' })
    setUser(me)
  }, [])

  const signOut = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    setUser(null)
    window.location.href = '/login'
  }, [])

  const value = useMemo<AuthState>(
    () => ({ user, config, loading, signInWithGoogle, signInAsDev, signOut, refresh }),
    [user, config, loading, signInWithGoogle, signInAsDev, signOut, refresh],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
